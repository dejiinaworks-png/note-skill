#!/usr/bin/env node
/**
 * note.com 自動投稿（下書き保存 → 公開まで）
 * Playwright + Cookie(storageState)方式
 * 完了後は自動でブラウザを閉じる
 */
import { chromium } from 'playwright';
import { existsSync } from 'fs';
import { resolve } from 'path';

const STATE_PATH = process.env.NOTE_POST_MCP_STATE_PATH
  || resolve(process.env.HOME || process.env.USERPROFILE || '.', '.note-state.json');

const THUMBNAIL_PATH = process.argv[2] || resolve('test/thumbnail.png');
const MODE = process.argv[3] || 'publish'; // 'draft' or 'publish'

if (!existsSync(STATE_PATH)) {
  console.error(`Error: ${STATE_PATH} が見つかりません。`);
  process.exit(1);
}

console.log(`=== note.com 自動投稿 (mode: ${MODE}) ===`);

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ storageState: STATE_PATH });
const page = await context.newPage();

try {
  // 1. エディターに移動
  console.log('[1/6] エディターに移動中...');
  await page.goto('https://note.com/notes/new', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  if (page.url().includes('login')) {
    throw new Error('セッション無効。Cookieを再取得してください。');
  }
  console.log(`  OK: ${page.url()}`);

  // 2. サムネイル画像アップロード
  if (existsSync(THUMBNAIL_PATH)) {
    console.log('[2/6] サムネイル画像アップロード中...');
    try {
      // 画像追加ボタン or ファイル入力を探す
      const fileInput = page.locator('input[type="file"]').first();
      // 画像エリアやアイキャッチ設定をクリックしてファイル入力を表示
      const eyecatchSelectors = [
        'button:has-text("画像")',
        '[data-testid*="eyecatch"]',
        '[data-testid*="image"]',
        '.p-editor__eyecatch',
        'label[for*="image"]',
      ];
      for (const sel of eyecatchSelectors) {
        try {
          const el = page.locator(sel).first();
          if (await el.isVisible({ timeout: 1500 })) {
            await el.click();
            await page.waitForTimeout(1000);
            break;
          }
        } catch {}
      }
      // ファイル入力にセット
      if (await fileInput.count() > 0) {
        await fileInput.setInputFiles(THUMBNAIL_PATH);
        await page.waitForTimeout(3000);
        console.log('  OK: サムネイルアップロード完了');
      } else {
        console.log('  SKIP: ファイル入力が見つかりません');
      }
    } catch (e) {
      console.log(`  SKIP: サムネイル設定失敗 (${e.message})`);
    }
  } else {
    console.log('[2/6] SKIP: サムネイル画像なし');
  }

  // 3. タイトル入力
  console.log('[3/6] タイトル入力中...');
  const titleSelector = 'textarea[placeholder*="タイトル"], textarea[data-testid="note-title"]';
  await page.waitForSelector(titleSelector, { timeout: 10000 });
  await page.fill(titleSelector, '【テスト】Claude Code から自動投稿テスト');
  await page.waitForTimeout(500);
  console.log('  OK');

  // 4. 本文入力
  console.log('[4/6] 本文入力中...');
  const bodySelector = 'div[contenteditable="true"][role="textbox"], div.ProseMirror';
  await page.waitForSelector(bodySelector, { timeout: 10000 });
  await page.click(bodySelector);

  const lines = [
    'これは Claude Code からの自動投稿テストです。',
    '',
    '## 自動投稿の仕組み',
    '',
    '1. Playwright でブラウザを自動操作',
    '2. Cookie認証でログイン済みセッションを利用',
    '3. Gemini で生成したサムネイル画像を添付',
    '4. 記事を自動で公開',
    '',
    'テスト投稿のため、確認後に削除します。',
  ];

  for (const line of lines) {
    if (line === '') {
      await page.keyboard.press('Enter');
    } else {
      await page.keyboard.type(line, { delay: 10 });
      await page.keyboard.press('Enter');
    }
  }
  await page.waitForTimeout(1000);
  console.log('  OK');

  // 5. 下書き保存
  console.log('[5/6] 下書き保存中...');
  // 自動保存を待つか、明示的にボタンを押す
  const draftSelectors = [
    'button:has-text("下書き保存")',
    'button:has-text("下書き")',
  ];
  let draftSaved = false;
  for (const sel of draftSelectors) {
    try {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 3000 })) {
        await btn.click();
        draftSaved = true;
        console.log(`  OK: ${sel}`);
        break;
      }
    } catch {}
  }
  if (!draftSaved) {
    // 自動保存に期待して5秒待つ
    await page.waitForTimeout(5000);
    console.log('  OK: 自動保存を待機');
  }
  await page.waitForTimeout(2000);

  // 6. 公開（publishモードの場合）
  if (MODE === 'publish') {
    console.log('[6/6] 公開処理中...');

    // 「公開に進む」「公開」「投稿」ボタンを探す
    const publishStep1Selectors = [
      'button:has-text("公開に進む")',
      'button:has-text("公開設定")',
      'button:has-text("投稿に進む")',
    ];
    for (const sel of publishStep1Selectors) {
      try {
        const btn = page.locator(sel).first();
        if (await btn.isVisible({ timeout: 3000 })) {
          await btn.click();
          console.log(`  Step1: ${sel}`);
          break;
        }
      } catch {}
    }
    await page.waitForTimeout(2000);

    // ハッシュタグ入力
    try {
      const tagInput = page.locator('input[placeholder*="ハッシュタグ"], input[placeholder*="タグ"]').first();
      if (await tagInput.isVisible({ timeout: 2000 })) {
        const tags = ['テスト', '自動投稿', 'AI', 'ClaudeCode'];
        for (const tag of tags) {
          await tagInput.fill(tag);
          await page.keyboard.press('Enter');
          await page.waitForTimeout(300);
        }
        console.log('  タグ設定完了');
      }
    } catch {
      console.log('  タグ入力スキップ');
    }

    // 最終「投稿」ボタン
    await page.waitForTimeout(1000);
    const publishFinalSelectors = [
      'button:has-text("投稿")',
      'button:has-text("公開する")',
      'button:has-text("公開")',
      'button[type="submit"]:has-text("投稿")',
    ];
    for (const sel of publishFinalSelectors) {
      try {
        const btn = page.locator(sel).first();
        if (await btn.isVisible({ timeout: 3000 })) {
          await btn.click();
          console.log(`  Step2: ${sel}`);
          break;
        }
      } catch {}
    }
    await page.waitForTimeout(5000);

    // 投稿後のURLを取得
    const finalUrl = page.url();
    console.log(`\n=== 投稿完了 ===`);
    console.log(`URL: ${finalUrl}`);
  } else {
    console.log('[6/6] SKIP: 下書きモード');
    console.log('\n=== 下書き保存完了 ===');
  }

  // スクリーンショット保存
  const ssPath = resolve('test/result-screenshot.png');
  await page.screenshot({ path: ssPath, fullPage: true });
  console.log(`スクリーンショット: ${ssPath}`);

} catch (err) {
  console.error('Error:', err.message);
  const ssPath = resolve('test/error-screenshot.png');
  await page.screenshot({ path: ssPath }).catch(() => {});
} finally {
  // 自動でブラウザを閉じる（ハングしない）
  await browser.close();
  console.log('ブラウザを閉じました。');
  process.exit(0);
}
