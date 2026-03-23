#!/usr/bin/env node
/**
 * note.com エディターのネットワークリクエストを監視
 * 画像アップロード・記事保存時のAPIエンドポイントを特定する
 */
import { chromium } from 'playwright';
import { existsSync } from 'fs';
import { resolve } from 'path';

const STATE_PATH = resolve(process.env.HOME || process.env.USERPROFILE || '.', '.note-state.json');
const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ storageState: STATE_PATH });
const page = await context.newPage();

// 全リクエストを監視
const apiCalls = [];
page.on('request', req => {
  const url = req.url();
  if (url.includes('note.com/api') || url.includes('upload') || url.includes('image') || url.includes('draft') || url.includes('text_note')) {
    apiCalls.push({
      method: req.method(),
      url: url,
      contentType: req.headers()['content-type'] || '',
      postData: req.postData()?.slice(0, 200) || '',
    });
    console.log(`[REQ] ${req.method()} ${url}`);
  }
});

page.on('response', res => {
  const url = res.url();
  if (url.includes('note.com/api') || url.includes('upload') || url.includes('image') || url.includes('draft') || url.includes('text_note')) {
    console.log(`[RES] ${res.status()} ${url}`);
  }
});

try {
  console.log('=== note.com API監視モード ===');
  console.log('エディターを開きます。以下を手動で実行してください:');
  console.log('1. テキストを入力');
  console.log('2. 「+」→「画像」で画像をアップロード');
  console.log('3. 「下書き保存」を押す');
  console.log('ネットワークリクエストを全て記録します。\n');

  await page.goto('https://note.com/notes/new', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // CSRFトークン/Cookieを確認
  const cookies = await context.cookies('https://note.com');
  console.log('--- Cookies ---');
  for (const c of cookies) {
    if (c.name.includes('session') || c.name.includes('csrf') || c.name.includes('xsrf') || c.name.includes('token') || c.name.includes('auth')) {
      console.log(`  ${c.name} = ${c.value.slice(0, 30)}...`);
    }
  }

  // meta csrf-token を探す
  const csrf = await page.evaluate(() => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta?.content || null;
  });
  console.log(`\nCSRF meta tag: ${csrf || 'なし'}`);

  // XSRFヘッダーを探す
  const xsrf = cookies.find(c => c.name === 'XSRF-TOKEN');
  console.log(`XSRF-TOKEN cookie: ${xsrf ? xsrf.value.slice(0, 30) + '...' : 'なし'}`);

  console.log('\n--- 手動操作を待機中... (2分間) ---');
  console.log('画像アップロードと下書き保存を実行してください。\n');

  await page.waitForTimeout(120000); // 2分間待つ

  console.log('\n--- 記録されたAPIコール ---');
  for (const call of apiCalls) {
    console.log(`\n  ${call.method} ${call.url}`);
    if (call.contentType) console.log(`    Content-Type: ${call.contentType}`);
    if (call.postData) console.log(`    Body: ${call.postData}`);
  }

} catch (err) {
  console.error('Error:', err.message);
} finally {
  await browser.close();
  process.exit(0);
}
