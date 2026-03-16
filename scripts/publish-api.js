#!/usr/bin/env node
/**
 * note.com API直接投稿スクリプト v2
 * 正確なエンドポイント使用: presigned_post → S3 → draft_save
 */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { NoteAPI } from './note-api.js';

const ARTICLE_PATH = process.argv[2];
const THUMBNAIL_PATH = process.argv[3] || '';
const MODE = process.argv[4] || 'draft';
const IMAGES_DIR = process.argv[5] || '';

if (!ARTICLE_PATH || !existsSync(ARTICLE_PATH)) {
  console.error('Usage: node publish-api.js <article.md> [thumbnail.png] [draft|publish] [images_dir]');
  process.exit(1);
}

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
  .map(m => ({ full: m[0], alt: m[1], path: m[2], fullPath: resolve(IMAGES_DIR || '.', m[2]) }))
  .filter(i => existsSync(i.fullPath));

console.log(`=== note.com API直接投稿 v2 ===`);
console.log(`タイトル: ${title}`);
console.log(`タグ: ${tags.join(', ')}`);
console.log(`画像: ${imageMarkers.length}枚`);
console.log(`サムネ: ${THUMBNAIL_PATH || 'なし'}`);
console.log(`モード: ${MODE}\n`);

const api = new NoteAPI();

try {
  // 1. 新規ドラフト作成
  console.log('[1/5] 新規ドラフト作成...');
  await api.createDraft();

  // 2. 記事内画像をアップロード
  const imageUrls = {};
  if (imageMarkers.length > 0) {
    console.log(`[2/5] 記事内画像アップロード... (${imageMarkers.length}枚)`);
    for (const img of imageMarkers) {
      console.log(`  ${img.path}:`);
      const result = await api.uploadImage(img.fullPath);
      if (result?.url) {
        imageUrls[img.path] = result.url;
        console.log(`  → ${result.url.slice(0, 80)}`);
      } else if (result?.key) {
        // URLが直接取れなくても key があれば note.com 内部で解決される可能性
        imageUrls[img.path] = `https://assets.st-note.com/production/uploads/images/${result.key}`;
        console.log(`  → key: ${result.key} (URL推定)`);
      } else {
        console.log(`  → FAIL`);
      }
    }
  } else {
    console.log('[2/5] SKIP: 記事内画像なし');
  }

  // 3. サムネイルアップロード
  if (THUMBNAIL_PATH && existsSync(resolve(THUMBNAIL_PATH))) {
    console.log('[3/5] サムネイルアップロード...');
    const result = await api.uploadEyecatch(resolve(THUMBNAIL_PATH));
    if (result) {
      console.log('  OK');
    } else {
      console.log('  FAIL');
    }
  } else {
    console.log('[3/5] SKIP: サムネなし');
  }

  // 4. HTML変換 + 下書き保存
  console.log('[4/5] HTML変換 + 保存...');
  const htmlBody = api.markdownToNoteHTML(body, imageUrls);
  console.log(`  ${htmlBody.length}文字のHTML`);

  const saveResult = await api.saveDraft({ title, body: htmlBody, tags });
  if (saveResult) {
    console.log('  下書き保存 OK');
  } else {
    console.log('  下書き保存 FAIL');
  }

  // 5. 公開（publish モードの場合）
  if (MODE === 'publish' && api.noteKey) {
    console.log('[5/5] 公開処理...');
    const pubRes = await fetch(`https://note.com/api/v2/notes/${api.noteKey}/publish`, {
      method: 'POST',
      headers: api._headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({}),
    });
    if (pubRes.ok) {
      console.log('  公開 OK');
    } else {
      const text = await pubRes.text().catch(() => '');
      console.log(`  公開失敗: ${pubRes.status} ${text.slice(0, 200)}`);
    }
  } else {
    console.log('[5/5] SKIP: 下書きモード');
  }

  const noteUrl = api.noteKey ? `https://note.com/ina_tatsu44/n/${api.noteKey}` : '(URL不明)';
  console.log(`\n=== 完了 ===`);
  console.log(`URL: ${noteUrl}`);
  console.log(`エディタ: https://editor.note.com/notes/${api.noteKey}/edit/`);

} catch (err) {
  console.error('Error:', err.message);
}
