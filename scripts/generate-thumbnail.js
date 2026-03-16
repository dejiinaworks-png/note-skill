#!/usr/bin/env node
/**
 * Gemini (Nano Banana 2) でサムネイル画像を生成
 */
import 'dotenv/config';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Error: GEMINI_API_KEY が .env に設定されていません');
  process.exit(1);
}

const prompt = process.argv[2] || 'ブログ記事のサムネイル画像。テクノロジーとAIをテーマにした明るくモダンなデザイン。テキスト「AI自動投稿テスト」を含む。日本語。';
const outputPath = process.argv[3] || resolve('test/thumbnail.png');

console.log('=== Gemini 画像生成 ===');
console.log(`プロンプト: ${prompt}`);
console.log(`出力先: ${outputPath}`);

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${API_KEY}`;

const body = {
  contents: [{
    parts: [{
      text: `Generate an image: ${prompt}`
    }]
  }],
  generationConfig: {
    responseModalities: ["TEXT", "IMAGE"]
  }
};

try {
  console.log('画像生成中...');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`API Error (${res.status}):`, errText);
    process.exit(1);
  }

  const data = await res.json();

  // レスポンスから画像データを探す
  let imageFound = false;
  for (const candidate of data.candidates || []) {
    for (const part of candidate.content?.parts || []) {
      if (part.inlineData) {
        const buf = Buffer.from(part.inlineData.data, 'base64');
        writeFileSync(outputPath, buf);
        console.log(`画像保存完了: ${outputPath} (${buf.length} bytes)`);
        imageFound = true;
        break;
      }
    }
    if (imageFound) break;
  }

  if (!imageFound) {
    console.log('Gemini から画像が返されませんでした。フォールバック画像を生成します...');
    // SVG → PNG の代わりにシンプルなダミー画像を作成
    await generateFallbackImage(outputPath);
  }

} catch (err) {
  console.error('Error:', err.message);
  console.log('フォールバック画像を生成します...');
  await generateFallbackImage(outputPath);
}

async function generateFallbackImage(path) {
  // 1x1 PNG をベースにしたシンプルなダミー（Playwrightでスクリーンショットを使う）
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 670 } });
  await page.setContent(`
    <html>
    <body style="margin:0; display:flex; align-items:center; justify-content:center; width:1280px; height:670px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div style="text-align:center; color:white; font-family:sans-serif;">
        <h1 style="font-size:48px; margin:0;">AI 自動投稿テスト</h1>
        <p style="font-size:24px; opacity:0.8;">Claude Code × note.com</p>
      </div>
    </body>
    </html>
  `);
  await page.screenshot({ path, type: 'png' });
  await browser.close();
  console.log(`フォールバック画像保存: ${path}`);
}
