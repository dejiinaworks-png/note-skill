#!/usr/bin/env node
/**
 * note.com 内部API クライアント v2
 * ネットワーク監視で特定した正確なエンドポイントを使用
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, basename } from 'path';

export class NoteAPI {
  constructor(statePath) {
    const stateFile = statePath
      || process.env.NOTE_POST_MCP_STATE_PATH
      || resolve(process.env.HOME || process.env.USERPROFILE || '.', '.note-state.json');

    if (!existsSync(stateFile)) {
      throw new Error(`セッションファイルが見つかりません: ${stateFile}`);
    }

    const state = JSON.parse(readFileSync(stateFile, 'utf-8'));
    this.cookies = state.cookies || [];
    this.cookieHeader = this.cookies.map(c => `${c.name}=${c.value}`).join('; ');
    this.articleId = null;
    this.noteKey = null;
  }

  _headers(extra = {}) {
    return {
      'Cookie': this.cookieHeader,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Referer': 'https://note.com/',
      'Origin': 'https://note.com',
      ...extra,
    };
  }

  // ===== 1. 新規記事を作成（空のドラフト） =====
  async createDraft() {
    const res = await fetch('https://note.com/api/v1/text_notes', {
      method: 'POST',
      headers: this._headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`記事作成失敗: ${res.status} ${text.slice(0, 200)}`);
    }

    const data = await res.json();
    // レスポンスから記事IDとnote_keyを取得
    this.articleId = data?.data?.id || data?.id;
    this.noteKey = data?.data?.key || data?.key;
    console.log(`  記事作成: id=${this.articleId}, key=${this.noteKey}`);
    return data;
  }

  // ===== 2. presigned URL を取得して画像をS3にアップロード =====
  async uploadImage(imagePath) {
    const imageBuffer = readFileSync(imagePath);
    const fileName = basename(imagePath);
    const ext = fileName.split('.').pop().toLowerCase();
    const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg'
      : ext === 'gif' ? 'image/gif' : 'image/png';

    // Step 1: presigned URL を取得
    const presignRes = await fetch('https://note.com/api/v3/images/upload/presigned_post', {
      method: 'POST',
      headers: this._headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        content_type: mimeType,
        file_name: fileName,
      }),
    });

    if (!presignRes.ok) {
      const text = await presignRes.text().catch(() => '');
      console.log(`  presigned取得失敗: ${presignRes.status} ${text.slice(0, 200)}`);
      return null;
    }

    const presignData = await presignRes.json();
    console.log(`  presigned応答: ${JSON.stringify(presignData).slice(0, 300)}`);

    // Step 2: S3にアップロード
    const uploadUrl = presignData?.data?.url || presignData?.url;
    const fields = presignData?.data?.fields || presignData?.fields || {};
    const imageKey = presignData?.data?.key || fields?.key || presignData?.key;

    if (uploadUrl && Object.keys(fields).length > 0) {
      // multipart/form-data で S3 にアップロード
      const formData = new FormData();
      for (const [k, v] of Object.entries(fields)) {
        formData.append(k, v);
      }
      formData.append('file', new Blob([imageBuffer], { type: mimeType }), fileName);

      const s3Res = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (s3Res.ok || s3Res.status === 204) {
        // S3アップロード成功。画像URLを構築
        const imageUrl = `${uploadUrl}${imageKey}`;
        console.log(`  S3アップロード成功: key=${imageKey}`);
        return { key: imageKey, url: imageUrl };
      } else {
        const text = await s3Res.text().catch(() => '');
        console.log(`  S3アップロード失敗: ${s3Res.status} ${text.slice(0, 200)}`);
      }
    } else if (uploadUrl) {
      // PUT 方式の presigned URL
      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': mimeType },
        body: imageBuffer,
      });

      if (putRes.ok || putRes.status === 200) {
        console.log(`  S3 PUT成功: key=${imageKey}`);
        return { key: imageKey, url: uploadUrl.split('?')[0] };
      } else {
        console.log(`  S3 PUT失敗: ${putRes.status}`);
      }
    }

    // presignedURLがない場合: レスポンスにURLが直接含まれているパターン
    const directUrl = presignData?.data?.image_url || presignData?.data?.src || presignData?.image_url;
    if (directUrl) {
      return { key: imageKey, url: directUrl };
    }

    return { key: imageKey, url: null, raw: presignData };
  }

  // ===== 3. アイキャッチ画像をアップロード =====
  async uploadEyecatch(imagePath) {
    const imageBuffer = readFileSync(imagePath);
    const fileName = basename(imagePath);
    const ext = fileName.split('.').pop().toLowerCase();
    const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg'
      : ext === 'gif' ? 'image/gif' : 'image/png';

    const formData = new FormData();
    formData.append('image', new Blob([imageBuffer], { type: mimeType }), fileName);
    if (this.noteKey) formData.append('note_key', this.noteKey);

    const res = await fetch('https://note.com/api/v1/image_upload/note_eyecatch', {
      method: 'POST',
      headers: this._headers(),
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.log(`  アイキャッチ失敗: ${res.status} ${text.slice(0, 200)}`);
      return null;
    }

    const data = await res.json();
    console.log(`  アイキャッチ応答: ${JSON.stringify(data).slice(0, 300)}`);
    return data;
  }

  // ===== 4. 下書き保存（タイトル・本文・タグを更新） =====
  async saveDraft({ title, body, tags = [] }) {
    if (!this.articleId) throw new Error('記事IDがありません。先にcreateDraft()を実行してください。');

    const payload = {
      name: title,
      body: body,
      hashtag_names: tags,
    };

    const url = `https://note.com/api/v1/text_notes/draft_save?id=${this.articleId}&is_temp_saved=true`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this._headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.log(`  下書き保存失敗: ${res.status} ${text.slice(0, 200)}`);
      return null;
    }

    const data = await res.json();
    return data;
  }

  // ===== Markdown → note.com HTML =====
  markdownToNoteHTML(markdown, imageUrls = {}) {
    let html = '';
    for (const line of markdown.split('\n')) {
      const trimmed = line.trim();

      // 画像
      const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
      if (imgMatch) {
        const url = imageUrls[imgMatch[2]] || imgMatch[2];
        if (url) html += `<figure><img src="${url}"></figure>\n`;
        continue;
      }

      if (trimmed.startsWith('## ')) { html += `<h2>${trimmed.slice(3)}</h2>\n`; continue; }
      if (trimmed.startsWith('### ')) { html += `<h3>${trimmed.slice(4)}</h3>\n`; continue; }
      if (trimmed === '---') { html += `<hr>\n`; continue; }
      if (trimmed === '') { html += `<br>\n`; continue; }

      let processed = trimmed.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
      html += `<p>${processed}</p>\n`;
    }
    return html;
  }
}
