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
  // showOpenFilePickerを無効化 → Playwrightのfilechooserが使えるようになる
  await context.addInitScript(() => {
    delete window.showOpenFilePicker;
  });
  await page.goto('https://note.com/notes/new', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  if (page.url().includes('login')) throw new Error('セッション無効');
  console.log(`  URL: ${page.url()}`);

  // ===== 3. サムネイル設定（UIで） =====
  if (THUMBNAIL_PATH && existsSync(resolve(THUMBNAIL_PATH))) {
    console.log('[3/6] サムネイル設定...');
    try {
      const addImgBtn = page.locator('button[aria-label="画像を追加"]').first();
      if (await addImgBtn.isVisible({ timeout: 3000 })) {
        await addImgBtn.click();
        await page.waitForTimeout(1500);
        const uploadBtn = page.locator('button:has-text("画像をアップロード")').first();
        if (await uploadBtn.isVisible({ timeout: 2000 })) {
          const [fc] = await Promise.all([
            page.waitForEvent('filechooser', { timeout: 10000 }),
            uploadBtn.click(),
          ]);
          await fc.setFiles(resolve(THUMBNAIL_PATH));
          await page.waitForTimeout(3000);
          // トリミングモーダルの「保存」
          const saveBtn = page.locator('.ReactModal__Content button:has-text("保存")').first();
          if (await saveBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await saveBtn.click();
            await page.waitForTimeout(3000);
          }
          console.log('  OK');
        }
      }
    } catch (e) {
      console.log(`  FAIL: ${e.message.slice(0, 80)}`);
    }
    // モーダル/ダイアログを閉じる
    await page.keyboard.press('Escape');
    await page.waitForTimeout(2000);

    // エディターに戻れなかった場合
    if (!page.url().includes('editor.note.com')) {
      console.log('  エディターに再遷移...');
      await page.goto('https://note.com/notes/new', { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(3000);
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

  const lines = body.split('\n');
  for (const line of lines) {
    const t = line.trim();

    // 画像マーカー → 「+」メニュー →「画像」→ filechooser でアップロード
    const imgMatch = t.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      const imgPath = resolve(IMAGES_DIR || '.', imgMatch[2]);
      if (!existsSync(imgPath)) continue;

      await page.keyboard.press('Enter');
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

    if (t === '' || t === '---') {
      await page.keyboard.press('Enter');
    } else {
      await page.keyboard.type(line, { delay: 3 });
      await page.keyboard.press('Enter');
    }
  }
  await page.waitForTimeout(1000);

  // ===== 6. 下書き保存 or 公開 =====
  console.log('[6/6] 保存/公開...');
  const draftBtn = page.locator('button:has-text("下書き保存")').first();
  if (await draftBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await draftBtn.click();
    await page.waitForTimeout(2000);
  }

  if (MODE === 'publish') {
    const pubBtn = page.locator('button:has-text("公開に進む")').first();
    if (await pubBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await pubBtn.click();
      await page.waitForTimeout(2000);
      // タグ入力
      if (tags.length > 0) {
        try {
          const tagInput = page.locator('input[placeholder*="ハッシュタグ"]').first();
          if (await tagInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            for (const tag of tags.slice(0, 10)) {
              await tagInput.fill(tag);
              await page.keyboard.press('Enter');
              await page.waitForTimeout(300);
            }
          }
        } catch {}
      }
      await page.waitForTimeout(1000);
      const postBtn = page.locator('button:has-text("投稿")').first();
      if (await postBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await postBtn.click();
        await page.waitForTimeout(5000);
      }
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
