#!/usr/bin/env node
import { chromium } from 'playwright';
import { resolve } from 'path';

const STATE_PATH = resolve(process.env.HOME || process.env.USERPROFILE, '.note-state.json');
const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ storageState: STATE_PATH });
await context.addInitScript(() => { delete window.showOpenFilePicker; });
const page = await context.newPage();

await page.goto('https://note.com/notes/new', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000);

// タイトルとテキスト入力
await page.fill('textarea[placeholder*="タイトル"]', 'テスト');
await page.waitForTimeout(500);

const bodySel = 'div.ProseMirror';
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
await page.locator(bodySel).click({ force: true });
await page.keyboard.type('テスト行');
await page.keyboard.press('Enter');
await page.keyboard.press('Enter');
await page.waitForTimeout(1500);

// 「+」ボタンをクリック
const plusBtn = page.locator('button[aria-label="メニューを開く"]').first();
const plusVisible = await plusBtn.isVisible({ timeout: 3000 }).catch(() => false);
console.log('+ visible:', plusVisible);

if (plusVisible) {
  await plusBtn.click();
  // メニュー展開を十分待つ
  await page.waitForTimeout(3000);

  // スクリーンショット
  await page.screenshot({ path: resolve('test/menu-open.png'), fullPage: true });
  console.log('スクリーンショット保存: test/menu-open.png');

  // 全可視ボタンをダンプ
  const btns = await page.evaluate(() => {
    return [...document.querySelectorAll('button')]
      .filter(e => e.offsetParent !== null && e.textContent?.trim())
      .map(e => {
        const r = e.getBoundingClientRect();
        return { text: e.textContent.trim().slice(0, 30), y: Math.round(r.y), x: Math.round(r.x) };
      })
      .filter(b => b.y > 200);
  });
  console.log('\n可視ボタン（y>200）:');
  for (const b of btns) {
    console.log(`  "${b.text}" at (${b.x}, ${b.y})`);
  }

  // 「画像」テキストを含む要素を全検索
  const imgEls = await page.evaluate(() => {
    return [...document.querySelectorAll('*')]
      .filter(e => e.textContent?.trim() === '画像' && e.offsetParent !== null)
      .map(e => ({
        tag: e.tagName,
        class: e.className?.toString().slice(0, 50),
        parent: e.parentElement?.tagName + '.' + e.parentElement?.className?.toString().slice(0, 30),
        rect: e.getBoundingClientRect(),
      }));
  });
  console.log('\n「画像」テキスト要素:');
  for (const el of imgEls) {
    console.log(`  ${el.tag}.${el.class} parent=${el.parent} at (${Math.round(el.rect.x)},${Math.round(el.rect.y)})`);
  }
} else {
  console.log('+ ボタンが見つかりません');
  await page.screenshot({ path: resolve('test/no-plus.png'), fullPage: true });
}

await browser.close();
