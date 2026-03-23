#!/usr/bin/env node
import { chromium } from 'playwright';
import { resolve } from 'path';

const STATE_PATH = resolve(process.env.HOME || process.env.USERPROFILE || '.', '.note-state.json');

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ storageState: STATE_PATH });
const page = await context.newPage();

try {
  // まずnote.comトップに行ってユーザー情報を取得
  console.log('ユーザー情報を取得中...');
  await page.goto('https://note.com/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // アバターアイコンをクリックしてプロフィールリンクを取得
  const avatarSel = 'a[href*="/mypage"], img.o-navBarUser, [data-testid="user-menu"]';
  try {
    const avatar = page.locator('a[href*="mypage"], header a img').first();
    if (await avatar.isVisible({ timeout: 3000 })) {
      await avatar.click();
      await page.waitForTimeout(2000);
    }
  } catch {}

  // ユーザーネームを含むリンクを探す
  const profileLinks = await page.$$eval('a[href]', els =>
    els.map(el => el.href)
      .filter(h => h.match(/note\.com\/[a-zA-Z0-9_]+$/) && !h.includes('note.com/search') && !h.includes('note.com/login'))
      .slice(0, 5)
  );
  console.log('プロフィールリンク候補:', profileLinks);

  // 記事管理ページに移動（正しいURL探索）
  const mgmtUrls = [
    'https://note.com/dashboard/contents',
    'https://note.com/settings',
    'https://editor.note.com/notes',
  ];
  for (const u of mgmtUrls) {
    console.log(`試行: ${u}`);
    await page.goto(u, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);
    const isOk = !(await page.content()).includes('お探しのページが見つかりません');
    if (isOk) {
      console.log(`  → OK: ${page.url()}`);
      break;
    }
  }

  const ssPath = resolve('test/dashboard-screenshot.png');
  await page.screenshot({ path: ssPath, fullPage: true });
  console.log(`スクリーンショット: ${ssPath}`);
} catch (err) {
  console.error('Error:', err.message);
} finally {
  await browser.close();
  process.exit(0);
}
