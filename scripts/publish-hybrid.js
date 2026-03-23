#!/usr/bin/env node
/**
 * note.com ハイブリッド投稿 v4
 * エディターページを開く → 画像URL取得 → UIで本文入力 + API経由で下書き保存
 * 全てエディターの自然なフローに乗せる
 */
import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'fs';
import { resolve, basename } from 'path';

const ARTICLE_PATH = process.argv[2];
const THUMBNAIL_PATH = process.argv[3] || '';
const MODE = process.argv[4] || 'draft';
const IMAGES_DIR = process.argv[5] || '';
const MAGAZINE = process.argv[6] || '';
const NOTE_ID = process.argv[7] || '';  // 既存下書きIDを渡すと上書き（省略時は新規作成）

if (!ARTICLE_PATH || !existsSync(ARTICLE_PATH)) {
  console.error('Usage: node publish-hybrid.js <article.md> [thumbnail.png] [draft|publish] [images_dir]');
  process.exit(1);
}

const STATE_PATH = process.env.NOTE_POST_MCP_STATE_PATH
  || resolve(process.env.HOME || process.env.USERPROFILE || '.', '.note-state.json');

// --- Parse Markdown ---
const raw = readFileSync(ARTICLE_PATH, 'utf-8');
let title = '', tags = [], body = raw;

const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
if (fmMatch) {
  const fm = fmMatch[1];
  body = fmMatch[2].trim();
  const titleMatch = fm.match(/title:\s*(.+)/);
  if (titleMatch) title = titleMatch[1].trim();
  const tagsMatch = fm.match(/tags:\s*\n((?:\s+-\s+.+\n?)*)/);
  if (tagsMatch) tags = tagsMatch[1].match(/-\s+(.+)/g)?.map(t => t.replace(/^-\s+/, '').trim()) || [];
}
if (!title) {
  const h1 = body.match(/^#\s+(.+)/m);
  if (h1) { title = h1[1].trim(); body = body.replace(/^#\s+.+\n?/, '').trim(); }
}

// 画像マーカー抽出
const imageMarkers = [...body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)]
  .map(m => ({ alt: m[1], path: m[2], fullPath: resolve(IMAGES_DIR || '.', m[2]) }))
  .filter(i => existsSync(i.fullPath));

console.log(`=== note.com ハイブリッド投稿 v4 ===`);
console.log(`タイトル: ${title}`);
console.log(`タグ: ${tags.join(', ')}`);
console.log(`画像: ${imageMarkers.length}枚`);
console.log(`サムネ: ${THUMBNAIL_PATH || 'なし'}`);
console.log(`モード: ${MODE}\n`);

// ===== ヘルパー =====
// 邪魔なモーダルを閉じる（AIアシスタント確認ダイアログ等）
async function dismissModals(page) {
  try {
    const overlay = page.locator('.ReactModal__Overlay').first();
    if (!await overlay.isVisible({ timeout: 500 }).catch(() => false)) return;
    // AIアシスタントモーダルの「キャンセル」ボタンを優先してクリック
    const cancelBtn = page.locator('button:has-text("キャンセル")').first();
    if (await cancelBtn.isVisible({ timeout: 500 }).catch(() => false)) {
      await cancelBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(600);
  } catch {}
}

// + メニューから項目をクリック
async function clickPlusMenuItem(page, itemText) {
  await dismissModals(page);
  const plusBtn = page.locator('button[aria-label="メニューを開く"]').first();
  if (!await plusBtn.isVisible({ timeout: 3000 }).catch(() => false)) return false;
  await plusBtn.click({ force: true });
  await page.waitForTimeout(1500);
  const ok = await page.evaluate((text) => {
    const btn = [...document.querySelectorAll('button')].find(
      b => b.textContent?.trim() === text && b.offsetParent !== null
    );
    if (btn) { btn.click(); return true; }
    return false;
  }, itemText);
  await page.waitForTimeout(300);
  return ok;
}

// Bold(**...**) / インラインコード(`...`) 対応テキスト入力
async function typeRichText(page, text) {
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/);
  for (const token of tokens) {
    if (!token) continue;
    if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
      const code = token.slice(1, -1);
      await page.keyboard.type(code, { delay: 3 });
      for (let i = 0; i < code.length; i++) await page.keyboard.press('Shift+ArrowLeft');
      await page.keyboard.press('Control+Shift+m');
      await page.keyboard.press('ArrowRight');
    } else if (token.startsWith('**') && token.endsWith('**')) {
      const bold = token.slice(2, -2);
      await page.keyboard.press('Control+b');
      await page.keyboard.type(bold, { delay: 3 });
      await page.keyboard.press('Control+b');
    } else {
      await page.keyboard.type(token, { delay: 3 });
    }
  }
}

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ storageState: STATE_PATH });
const page = await context.newPage();

try {
  // ===== 1. 画像URLを事前取得（note.comドメインで） =====
  const imageUrls = {};
  if (imageMarkers.length > 0) {
    console.log('[1/6] 画像URL取得中...');
    // note.comを開いてpresigned_post API を呼ぶ
    await page.goto('https://note.com/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    for (const img of imageMarkers) {
      const imgBuffer = readFileSync(img.fullPath);
      const imgBase64 = imgBuffer.toString('base64');
      const ext = img.fullPath.split('.').pop().toLowerCase();
      const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';

      const result = await page.evaluate(async ({ base64, mime, fileName }) => {
        try {
          // presigned URL取得
          const res = await fetch('/api/v3/images/upload/presigned_post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify({ mime_type: mime, filename: fileName }),
          });
          if (!res.ok) return { error: res.status };
          const data = await res.json();
          const url = data?.data?.url;
          const signedUrl = data?.data?.signed_url;

          // signed_url があればPUTで画像本体をアップロード
          if (signedUrl) {
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            await fetch(signedUrl, {
              method: 'PUT',
              headers: { 'Content-Type': mime },
              body: new Blob([bytes], { type: mime }),
            });
          }

          return { url };
        } catch (e) {
          return { error: e.message };
        }
      }, { base64: imgBase64, mime, fileName: basename(img.fullPath) });

      if (result?.url) {
        imageUrls[img.path] = result.url;
        console.log(`  ${img.path} → ${result.url.slice(0, 70)}...`);
      } else {
        console.log(`  ${img.path} → FAIL: ${JSON.stringify(result)}`);
      }
    }
  } else {
    console.log('[1/6] SKIP: 画像なし');
  }

  // ===== 2. エディターを開く =====
  console.log('[2/6] エディターを開く...');
  await context.addInitScript(() => { delete window.showOpenFilePicker; });
  const editorTarget = NOTE_ID
    ? `https://editor.note.com/notes/${NOTE_ID}/edit/`
    : 'https://note.com/notes/new';
  await page.goto(editorTarget, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  if (page.url().includes('login')) throw new Error('セッション無効');
  // エディターURLを保存（サムネ離脱後に同じ下書きに戻るため）
  const editorUrl = page.url();
  console.log(`  URL: ${editorUrl}`);

  // ===== 3. サムネイル設定（UIで） =====
  if (THUMBNAIL_PATH && existsSync(resolve(THUMBNAIL_PATH))) {
    console.log('[3/6] サムネイル設定...');
    let thumbnailOk = false;
    try {
      const addImgBtn = page.locator('button[aria-label="画像を追加"]').first();
      if (await addImgBtn.isVisible({ timeout: 5000 })) {
        await addImgBtn.click();
        await page.waitForTimeout(1500);
        const uploadBtn = page.locator('button:has-text("画像をアップロード")').first();
        if (await uploadBtn.isVisible({ timeout: 3000 })) {
          const [fc] = await Promise.all([
            page.waitForEvent('filechooser', { timeout: 10000 }),
            uploadBtn.click(),
          ]);
          await fc.setFiles(resolve(THUMBNAIL_PATH));
          await page.waitForTimeout(3000);
          // トリミングモーダルの「保存」
          const saveBtn = page.locator('.ReactModal__Content button:has-text("保存")').first();
          if (await saveBtn.isVisible({ timeout: 8000 }).catch(() => false)) {
            await saveBtn.click();
            // 保存後のナビゲーション完了を待つ
            await page.waitForTimeout(4000);
          }
          thumbnailOk = true;
          console.log('  サムネイル設定完了');
        }
      } else {
        console.log('  「画像を追加」ボタンが見つからない');
      }
    } catch (e) {
      console.log(`  FAIL: ${e.message.slice(0, 80)}`);
    }

    // エディターから離脱していたら元の下書きURLに戻る
    const currentUrl = page.url();
    if (!currentUrl.includes('editor.note.com') || currentUrl !== editorUrl) {
      console.log(`  現在URL: ${currentUrl}`);
      console.log(`  エディター(${editorUrl})に戻ります...`);
      await page.goto(editorUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(3000);
      if (page.url().includes('login')) throw new Error('セッション無効（再遷移後）');
    }

    if (thumbnailOk) {
      console.log('[3/6] OK');
    } else {
      console.log('[3/6] SKIP: サムネイル設定失敗');
    }
  } else {
    console.log('[3/6] SKIP: サムネなし');
  }

  // ===== 4. タイトル入力 =====
  console.log('[4/6] タイトル入力...');
  const titleSel = 'textarea[placeholder*="タイトル"]';
  await page.waitForSelector(titleSel, { timeout: 10000 });
  await page.fill(titleSel, title);
  await page.waitForTimeout(500);

  // ===== 5. 本文入力（テキスト + 画像URLはimgタグとして入力） =====
  console.log('[5/6] 本文入力...');
  const bodySel = 'div[contenteditable="true"][role="textbox"], div.ProseMirror';
  await page.waitForSelector(bodySel, { timeout: 10000 });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  await page.locator(bodySel).click({ force: true });

  // 画像行の直前・直後の空行を除去
  const rawLines = body.split('\n');
  const lines = rawLines.filter((line, i) => {
    const t = line.trim();
    if (t !== '') return true;
    const prevImg = i > 0 && /^!\[/.test(rawLines[i - 1].trim());
    const nextImg = i < rawLines.length - 1 && /^!\[/.test(rawLines[i + 1].trim());
    return !prevImg && !nextImg;
  });

  let inList = false;
  let inCodeBlock = false;
  let inQuote = false;
  for (const line of lines) {
    const t = line.trim();

    // 画像マーカー → 「+」メニュー →「画像」→ filechooser でアップロード
    const imgMatch = t.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      const imgPath = resolve(IMAGES_DIR || '.', imgMatch[2]);
      if (!existsSync(imgPath)) continue;

      // 画像挿入前にリスト/コードブロック/引用を閉じる
      if (inList) { await page.keyboard.press('Backspace'); await page.waitForTimeout(200); inList = false; }
      if (inCodeBlock) { await page.keyboard.press('Escape'); await page.keyboard.press('ArrowDown'); inCodeBlock = false; }
      if (inQuote) { await page.keyboard.press('Enter'); await page.waitForTimeout(200); inQuote = false; }

      await page.waitForTimeout(1000);

      let inserted = false;
      try {
        // Step 1: 「+」（メニューを開く）ボタンをクリック
        const plusBtn = page.locator('button[aria-label="メニューを開く"]').first();
        if (await plusBtn.isVisible({ timeout: 3000 })) {
          await plusBtn.click();
          await page.waitForTimeout(2000); // メニュー展開を十分待つ

          // Step 2: DOM内から「画像」テキストのボタンをJSで直接クリック
          const clicked = await page.evaluate(() => {
            const btns = [...document.querySelectorAll('button')];
            const imgBtn = btns.find(b => b.textContent?.trim() === '画像' && b.offsetParent !== null);
            if (imgBtn) {
              imgBtn.click();
              return true;
            }
            return false;
          });

          if (clicked) {
            // showOpenFilePickerが無効化されていない場合に備えて再度無効化
            await page.evaluate(() => { delete window.showOpenFilePicker; });
            await page.waitForTimeout(500);

            // 「画像」クリック後にinput[type="file"]が出現するか確認
            const hasFileInput = await page.evaluate(() => {
              const inputs = document.querySelectorAll('input[type="file"]');
              return inputs.length;
            });
            console.log(`  file input数: ${hasFileInput}`);

            if (hasFileInput > 0) {
              // input[type="file"]が出現した → setInputFilesで直接セット
              const fi = page.locator('input[type="file"]').last();
              await fi.setInputFiles(imgPath);
              await page.waitForTimeout(4000);
              inserted = true;
              console.log(`  画像挿入OK (input): ${imgMatch[2]}`);
            } else {
              // filechooser方式を試す（再度「画像」をクリック）
              try {
                // メニューが閉じていたら再度開く
                const plusBtn2 = page.locator('button[aria-label="メニューを開く"]').first();
                if (await plusBtn2.isVisible({ timeout: 1000 }).catch(() => false)) {
                  await plusBtn2.click();
                  await page.waitForTimeout(1500);
                }
                const [fc] = await Promise.all([
                  page.waitForEvent('filechooser', { timeout: 8000 }),
                  page.evaluate(() => {
                    const btn = [...document.querySelectorAll('button')].find(b => b.textContent?.trim() === '画像' && b.offsetParent !== null);
                    btn?.click();
                  }),
                ]);
                await fc.setFiles(imgPath);
                await page.waitForTimeout(4000);
                inserted = true;
                console.log(`  画像挿入OK (filechooser): ${imgMatch[2]}`);
              } catch (e2) {
                console.log(`  filechooser再試行失敗: ${e2.message.slice(0, 50)}`);
              }
            }
          } else {
            console.log('  「画像」ボタンが見つからない');
          }
        }
      } catch (e) {
        console.log(`  画像挿入失敗: ${e.message.slice(0, 80)}`);
      }

      if (!inserted) {
        console.log(`  SKIP: ${imgMatch[2]}`);
      }

      // 画像挿入後、カーソルを下に移動
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('End');
      await page.waitForTimeout(300);
      continue;
    }

    // リストから出る
    if (inList && !t.startsWith('- ') && !t.startsWith('* ')) {
      await page.keyboard.press('Backspace');
      await page.waitForTimeout(200);
      inList = false;
    }
    // 引用ブロックから出る
    if (inQuote && !t.startsWith('> ')) {
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);
      inQuote = false;
    }

    // 空行 / 区切り
    if (t === '' || t === '---') {
      await page.keyboard.press('Enter');
      continue;
    }

    // コードブロック 開始/終了
    if (t.startsWith('```')) {
      if (!inCodeBlock) {
        await clickPlusMenuItem(page, 'コード');
        await page.waitForTimeout(300);
        inCodeBlock = true;
      } else {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
        await page.keyboard.press('ArrowDown');
        inCodeBlock = false;
      }
      continue;
    }

    // コードブロック内
    if (inCodeBlock) {
      await page.keyboard.type(t, { delay: 3 });
      await page.keyboard.press('Enter');
      continue;
    }

    // H2 大見出し
    if (t.startsWith('## ')) {
      await clickPlusMenuItem(page, '大見出し');
      await page.waitForTimeout(300);
      await typeRichText(page, t.slice(3));
      await page.keyboard.press('Enter');
      continue;
    }

    // H3 小見出し
    if (t.startsWith('### ')) {
      await clickPlusMenuItem(page, '小見出し');
      await page.waitForTimeout(300);
      await typeRichText(page, t.slice(4));
      await page.keyboard.press('Enter');
      continue;
    }

    // 引用ブロック
    if (t.startsWith('> ')) {
      if (!inQuote) {
        await clickPlusMenuItem(page, '引用');
        await page.waitForTimeout(300);
        inQuote = true;
      }
      await typeRichText(page, t.slice(2));
      await page.keyboard.press('Enter');
      continue;
    }

    // 箇条書き
    if (t.startsWith('- ') || t.startsWith('* ')) {
      if (!inList) {
        await clickPlusMenuItem(page, '箇条書き');
        await page.waitForTimeout(300);
        inList = true;
      }
      await typeRichText(page, t.slice(2));
      await page.keyboard.press('Enter');
      continue;
    }

    // 通常テキスト（Bold / インラインコード対応）
    await typeRichText(page, line);
    await page.keyboard.press('Enter');
  }

  // ループ終了後に残ったブロックを閉じる
  if (inList) { await page.keyboard.press('Backspace'); inList = false; }
  if (inCodeBlock) { await page.keyboard.press('Escape'); await page.keyboard.press('ArrowDown'); inCodeBlock = false; }
  if (inQuote) { await page.keyboard.press('Enter'); inQuote = false; }

  await page.waitForTimeout(1000);

  // ===== 6. 下書き保存 =====
  console.log('[6/7] 下書き保存...');
  await dismissModals(page);
  const draftBtn = page.locator('button:has-text("下書き保存")').first();
  if (await draftBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await draftBtn.click({ force: true });
    await page.waitForTimeout(2000);
  }

  // ===== 7. タグ・マガジン設定（draft/publish共通） =====
  console.log('[7/7] タグ・マガジン設定...');
  await dismissModals(page);
  const pubBtn = page.locator('button:has-text("公開に進む")').first();
  if (await pubBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await pubBtn.click();
    await page.waitForTimeout(2000);

    // タグ入力
    if (tags.length > 0) {
      try {
        const tagInput = page.locator('input[placeholder*="ハッシュタグ"]').first();
        if (await tagInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          for (const tag of tags.slice(0, 10)) {
            await tagInput.fill(tag);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(400);
          }
          console.log(`  タグ設定: ${tags.join(', ')}`);
        }
      } catch (e) {
        console.log(`  タグ設定失敗: ${e.message.slice(0, 50)}`);
      }
    }

    // マガジン設定
    if (MAGAZINE) {
      try {
        const magBtn = page.locator('button:has-text("マガジンに追加")').first();
        if (await magBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await magBtn.click();
          await page.waitForTimeout(1500);
          const magItem = page.locator(`li:has-text("${MAGAZINE}")`).first();
          if (await magItem.isVisible({ timeout: 3000 }).catch(() => false)) {
            await magItem.click();
            await page.waitForTimeout(1000);
            console.log(`  マガジン設定: ${MAGAZINE}`);
          } else {
            console.log(`  マガジン「${MAGAZINE}」が見つからない`);
          }
        } else {
          console.log('  マガジン追加ボタンが見つからない');
        }
      } catch (e) {
        console.log(`  マガジン設定失敗: ${e.message.slice(0, 50)}`);
      }
    }

    await page.waitForTimeout(1000);

    if (MODE === 'publish') {
      const postBtn = page.locator('button:has-text("投稿")').first();
      if (await postBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await postBtn.click();
        await page.waitForTimeout(5000);
      }
    } else {
      // draft: タグ・マガジン設定後に下書き保存して戻る
      const draftBtn2 = page.locator('button:has-text("下書き保存")').first();
      if (await draftBtn2.isVisible({ timeout: 3000 }).catch(() => false)) {
        await draftBtn2.click();
        await page.waitForTimeout(2000);
      }
      console.log('  タグ・マガジン設定を下書きに保存');
    }
  }

  console.log(`\n=== 完了 ===`);
  console.log(`URL: ${page.url()}`);

} catch (err) {
  console.error('Error:', err.message);
} finally {
  await browser.close();
  process.exit(0);
}
