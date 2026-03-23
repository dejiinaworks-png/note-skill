#!/usr/bin/env node
/**
 * note.com エディターのDOM構造を調査
 * 画像挿入に必要なセレクターを特定する
 */
import { chromium } from 'playwright';
import { existsSync } from 'fs';
import { resolve } from 'path';

const STATE_PATH = resolve(process.env.HOME || process.env.USERPROFILE || '.', '.note-state.json');
const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ storageState: STATE_PATH });
const page = await context.newPage();

try {
  console.log('=== note.com エディターDOM調査 ===\n');

  await page.goto('https://note.com/notes/new', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // 1. タイトルに何か入力してから本文にフォーカス
  const titleSel = 'textarea[placeholder*="タイトル"]';
  await page.waitForSelector(titleSel, { timeout: 10000 });
  await page.fill(titleSel, 'テスト');
  await page.waitForTimeout(500);

  // 2. 本文エディターにフォーカス
  const bodySel = 'div[contenteditable="true"][role="textbox"], div.ProseMirror';
  await page.waitForSelector(bodySel, { timeout: 10000 });
  await page.locator(bodySel).click({ force: true });
  await page.keyboard.type('テスト行1');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter'); // 空行を作る
  await page.waitForTimeout(2000);

  // 3. 空行にカーソルがある状態で、表示される要素を全てリストアップ
  console.log('--- 空行で表示されるボタン・要素 ---');
  const allButtons = await page.$$eval('button', els =>
    els.map(el => ({
      text: el.textContent?.trim().slice(0, 60),
      ariaLabel: el.getAttribute('aria-label'),
      className: el.className?.slice(0, 80),
      id: el.id,
      dataTestId: el.getAttribute('data-testid'),
      dataName: el.getAttribute('data-name'),
      visible: el.offsetParent !== null,
      rect: el.getBoundingClientRect(),
    })).filter(b => b.visible)
  );
  for (const b of allButtons) {
    console.log(`  BTN: "${b.text}" | aria="${b.ariaLabel}" | data-name="${b.dataName}" | class="${b.className?.slice(0, 40)}" | pos=(${Math.round(b.rect.x)},${Math.round(b.rect.y)})`);
  }

  // 4. 「+」や画像関連の要素を探す
  console.log('\n--- 画像関連セレクター探索 ---');
  const imageRelated = await page.$$eval('[aria-label*="画像"], [aria-label*="image"], [data-testid*="image"], [data-testid*="add"], button[class*="add"], button[class*="plus"], [role="toolbar"] button', els =>
    els.map(el => ({
      tag: el.tagName,
      text: el.textContent?.trim().slice(0, 40),
      ariaLabel: el.getAttribute('aria-label'),
      className: el.className?.slice(0, 60),
      dataTestId: el.getAttribute('data-testid'),
      visible: el.offsetParent !== null,
    }))
  );
  for (const el of imageRelated) {
    console.log(`  ${el.tag}: "${el.text}" | aria="${el.ariaLabel}" | testid="${el.dataTestId}" | visible=${el.visible}`);
  }

  // 5. ProseMirrorのメニュー/ツールバー要素
  console.log('\n--- エディター周辺の div/メニュー ---');
  const editorDivs = await page.$$eval('div[class*="menu"], div[class*="toolbar"], div[class*="block"], div[class*="plus"], div[class*="add"], div[role="toolbar"], div[role="menu"]', els =>
    els.map(el => ({
      className: el.className?.slice(0, 80),
      role: el.getAttribute('role'),
      children: el.children.length,
      visible: el.offsetParent !== null,
      innerHTML: el.innerHTML?.slice(0, 100),
    })).filter(e => e.visible)
  );
  for (const d of editorDivs) {
    console.log(`  DIV: class="${d.className}" | role="${d.role}" | children=${d.children}`);
  }

  // 6. input[type="file"]要素
  console.log('\n--- file input 要素 ---');
  const fileInputs = await page.$$eval('input[type="file"]', els =>
    els.map(el => ({
      accept: el.accept,
      className: el.className?.slice(0, 60),
      id: el.id,
      name: el.name,
      multiple: el.multiple,
      parentClass: el.parentElement?.className?.slice(0, 60),
    }))
  );
  for (const fi of fileInputs) {
    console.log(`  FILE: accept="${fi.accept}" | class="${fi.className}" | parent="${fi.parentClass}"`);
  }

  // 7. スクリーンショット
  const ssPath = resolve('test/editor-inspect.png');
  await page.screenshot({ path: ssPath, fullPage: true });
  console.log(`\nスクリーンショット: ${ssPath}`);

  console.log('\n--- 調査完了 ---');

} catch (err) {
  console.error('Error:', err.message);
} finally {
  await browser.close();
  process.exit(0);
}
