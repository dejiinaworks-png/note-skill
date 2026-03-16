#!/usr/bin/env node
/**
 * note.com 記事投稿スクリプト v2.0
 * - サムネイル: エディター左上アイコンから設定
 * - 記事内画像: 「+」ボタン経由で挿入
 * - Markdownファイル（frontmatter付き）対応
 */
import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// --- Args ---
const ARTICLE_PATH = process.argv[2];
const THUMBNAIL_PATH = process.argv[3] || '';
const MODE = process.argv[4] || 'publish';
// 記事内画像ディレクトリ（オプション）
const IMAGES_DIR = process.argv[5] || '';

if (!ARTICLE_PATH || !existsSync(ARTICLE_PATH)) {
  console.error('Usage: node publish-article.js <article.md> [thumbnail.png] [draft|publish] [images_dir]');
  process.exit(1);
}

const STATE_PATH = process.env.NOTE_POST_MCP_STATE_PATH
  || resolve(process.env.HOME || process.env.USERPROFILE || '.', '.note-state.json');

if (!existsSync(STATE_PATH)) {
  console.error('Error: セッション未設定。Cookie変換を実行してください。');
  process.exit(1);
}

// --- Parse Markdown ---
const raw = readFileSync(ARTICLE_PATH, 'utf-8');
let title = '';
let tags = [];
let body = raw;
let imageInsertPoints = []; // {afterLine: number, imagePath: string}

const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
if (fmMatch) {
  const fm = fmMatch[1];
  body = fmMatch[2].trim();
  const titleMatch = fm.match(/title:\s*(.+)/);
  if (titleMatch) title = titleMatch[1].trim();
  const tagsMatch = fm.match(/tags:\s*\n((?:\s+-\s+.+\n?)*)/);
  if (tagsMatch) tags = tagsMatch[1].match(/-\s+(.+)/g)?.map(t => t.replace(/^-\s+/, '').trim()) || [];
  const tagsInline = fm.match(/tags:\s*\[([^\]]+)\]/);
  if (tagsInline) tags = tagsInline[1].split(',').map(t => t.trim());
}

if (!title) {
  const h1Match = body.match(/^#\s+(.+)/m);
  if (h1Match) { title = h1Match[1].trim(); body = body.replace(/^#\s+.+\n?/, '').trim(); }
  else title = 'Untitled';
}

// 画像マーカーを検出: ![alt](path) 形式
const lines = body.split('\n');
const processedLines = [];
for (let i = 0; i < lines.length; i++) {
  const imgMatch = lines[i].match(/^!\[([^\]]*)\]\(([^)]+)\)/);
  if (imgMatch) {
    const imgPath = resolve(IMAGES_DIR || '.', imgMatch[2]);
    if (existsSync(imgPath)) {
      imageInsertPoints.push({ afterLine: processedLines.length, imagePath: imgPath });
    }
    // 画像行はスキップ（Playwrightで画像挿入するため）
  } else {
    processedLines.push(lines[i]);
  }
}

console.log(`=== note.com 自動投稿 v2.0 ===`);
console.log(`タイトル: ${title}`);
console.log(`タグ: ${tags.join(', ')}`);
console.log(`本文: ${processedLines.length}行`);
console.log(`記事内画像: ${imageInsertPoints.length}枚`);
console.log(`サムネ: ${THUMBNAIL_PATH || 'なし'}`);
console.log(`モード: ${MODE}\n`);

// --- Playwright ---
const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ storageState: STATE_PATH });
const page = await context.newPage();

try {
  // ===== 1. エディターに移動 =====
  console.log('[1/7] エディターに移動中...');
  await page.goto('https://note.com/notes/new', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  if (page.url().includes('login')) throw new Error('セッション無効。Cookieを再取得してください。');

  // ===== 2. サムネイル（表紙画像）設定 =====
  if (THUMBNAIL_PATH && existsSync(resolve(THUMBNAIL_PATH))) {
    console.log('[2/7] サムネイル設定中...');
    let thumbnailSet = false;

    // 方法1: エディター左上の表紙画像アイコンをクリック
    const coverSelectors = [
      'button:has-text("表紙")',
      'button[aria-label*="表紙"]',
      'button[aria-label*="アイキャッチ"]',
      'button[aria-label*="画像"]',
      '[data-testid*="cover"]',
      '[data-testid*="eyecatch"]',
      '.p-editor__coverButton',
      // エディター上部の画像追加エリア
      '.o-editorEyecatch',
      'div[class*="eyecatch"]',
      'div[class*="cover"] button',
    ];

    for (const sel of coverSelectors) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 1500 })) {
          await el.click();
          await page.waitForTimeout(1500);
          // ファイル入力が出現するか確認
          const fi = page.locator('input[type="file"]').first();
          if (await fi.count() > 0) {
            await fi.setInputFiles(resolve(THUMBNAIL_PATH));
            await page.waitForTimeout(3000);
            thumbnailSet = true;
            console.log(`  OK: ${sel}`);
            break;
          }
        }
      } catch {}
    }

    // 方法2: 隠れたinput[type="file"]に直接セット（file chooserイベント使用）
    if (!thumbnailSet) {
      try {
        // ページ内の全input[type="file"]を探す
        const fileInputs = page.locator('input[type="file"]');
        const count = await fileInputs.count();
        if (count > 0) {
          await fileInputs.first().setInputFiles(resolve(THUMBNAIL_PATH));
          await page.waitForTimeout(3000);
          thumbnailSet = true;
          console.log('  OK: input[type="file"] direct');
        }
      } catch {}
    }

    // 方法3: filechooserイベントをリッスンしてから画像エリアクリック
    if (!thumbnailSet) {
      try {
        const [fileChooser] = await Promise.all([
          page.waitForEvent('filechooser', { timeout: 5000 }),
          page.locator('div[class*="editor"] >> nth=0').click(),
        ]);
        await fileChooser.setFiles(resolve(THUMBNAIL_PATH));
        await page.waitForTimeout(3000);
        thumbnailSet = true;
        console.log('  OK: filechooser event');
      } catch {}
    }

    if (!thumbnailSet) {
      console.log('  SKIP: サムネイル設定に失敗（手動で設定してください）');
      // ページ内の要素をログ出力
      const buttons = await page.$$eval('button', els =>
        els.slice(0, 15).map(el => ({ text: el.textContent?.trim().slice(0, 40), ariaLabel: el.getAttribute('aria-label') }))
      );
      console.log('  エディター内ボタン:', JSON.stringify(buttons, null, 2));
    }
  } else {
    console.log('[2/7] SKIP: サムネなし');
  }

  // ===== 3. タイトル入力 =====
  console.log('[3/7] タイトル入力中...');
  const titleSel = 'textarea[placeholder*="タイトル"], textarea[data-testid="note-title"]';
  await page.waitForSelector(titleSel, { timeout: 10000 });
  await page.fill(titleSel, title);
  await page.waitForTimeout(500);

  // ===== 4. 本文入力 + 画像挿入 =====
  console.log('[4/7] 本文入力中...');
  const bodySel = 'div[contenteditable="true"][role="textbox"], div.ProseMirror';
  await page.waitForSelector(bodySel, { timeout: 10000 });
  await page.click(bodySel);

  let insertedImages = 0;
  for (let i = 0; i < processedLines.length; i++) {
    const line = processedLines[i];

    if (line.trim() === '' || line.trim() === '---') {
      await page.keyboard.press('Enter');
    } else {
      await page.keyboard.type(line, { delay: 3 });
      await page.keyboard.press('Enter');
    }

    // この行の後に画像を挿入すべきか確認
    const imageToInsert = imageInsertPoints.find(p => p.afterLine === i + 1);
    if (imageToInsert) {
      console.log(`  画像挿入中: ${imageToInsert.imagePath}`);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);

      let imgInserted = false;

      // 方法1: 「+」ボタンを見つけてクリック
      try {
        const plusBtn = page.locator('button:has-text("+"), button[aria-label*="追加"], [data-testid*="add-block"]').first();
        if (await plusBtn.isVisible({ timeout: 2000 })) {
          await plusBtn.click();
          await page.waitForTimeout(1000);
          // 画像オプションをクリック
          const imgOption = page.locator('button:has-text("画像"), [data-testid*="image"]').first();
          if (await imgOption.isVisible({ timeout: 2000 })) {
            const [fileChooser] = await Promise.all([
              page.waitForEvent('filechooser', { timeout: 5000 }),
              imgOption.click(),
            ]);
            await fileChooser.setFiles(imageToInsert.imagePath);
            await page.waitForTimeout(3000);
            imgInserted = true;
          }
        }
      } catch {}

      // 方法2: filechooserイベントで直接
      if (!imgInserted) {
        try {
          const fileInputs = page.locator('input[type="file"]');
          if (await fileInputs.count() > 0) {
            await fileInputs.last().setInputFiles(imageToInsert.imagePath);
            await page.waitForTimeout(3000);
            imgInserted = true;
          }
        } catch {}
      }

      if (imgInserted) {
        insertedImages++;
        console.log(`  OK (${insertedImages}/${imageInsertPoints.length})`);
      } else {
        console.log(`  SKIP: 画像挿入失敗`);
      }
    }
  }

  await page.waitForTimeout(1000);

  // ===== 5. 下書き保存 =====
  console.log('[5/7] 下書き保存中...');
  const draftBtn = page.locator('button:has-text("下書き保存")').first();
  if (await draftBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await draftBtn.click();
    await page.waitForTimeout(2000);
  } else {
    await page.waitForTimeout(5000);
  }

  // ===== 6. 公開 =====
  if (MODE === 'publish') {
    console.log('[6/7] 公開処理中...');

    for (const sel of ['button:has-text("公開に進む")', 'button:has-text("公開設定")']) {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await btn.click();
        break;
      }
    }
    await page.waitForTimeout(2000);

    // タグ入力
    if (tags.length > 0) {
      try {
        const tagInput = page.locator('input[placeholder*="ハッシュタグ"], input[placeholder*="タグ"]').first();
        if (await tagInput.isVisible({ timeout: 2000 }).catch(() => false)) {
          for (const tag of tags.slice(0, 10)) {
            await tagInput.fill(tag);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(300);
          }
        }
      } catch {}
    }

    // 投稿ボタン
    await page.waitForTimeout(1000);
    for (const sel of ['button:has-text("投稿")', 'button:has-text("公開する")']) {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await btn.click();
        break;
      }
    }
    await page.waitForTimeout(5000);
    console.log(`\n=== 投稿完了 ===`);
    console.log(`URL: ${page.url()}`);
  } else {
    console.log('[6/7] SKIP: 下書きモード');
    console.log('\n=== 下書き保存完了 ===');
  }

  // ===== 7. 結果サマリー =====
  console.log(`[7/7] サマリー`);
  console.log(`  タイトル: ${title}`);
  console.log(`  タグ: ${tags.join(', ')}`);
  console.log(`  画像挿入: ${insertedImages}/${imageInsertPoints.length}`);

} catch (err) {
  console.error('Error:', err.message);
} finally {
  await browser.close();
  process.exit(0);
}
