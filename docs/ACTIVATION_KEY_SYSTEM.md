# アクティベーションキーシステム 導入ガイド

他のスキル・スクリプトへの転用も想定した手順書。

---

## システム概要

```
ユーザーのPC（ローカル）              Cloudflare（サーバー）
─────────────────────               ──────────────────────
スクリプト起動
  ↓
~/.note-activate-key を読む
  ↓
「このキー有効？」 ──────────────→  Worker がKVで確認
                  ←──────────────  OK / NG を返す
  ↓
OK → 通常実行
NG → エラー表示して停止
```

---

## 初回セットアップ手順（1回だけ）

### Step 1：Cloudflare KV 作成

1. `dash.cloudflare.com` にログイン
2. 左メニュー「Workers & Pages」→「Workers KV」
3. 「名前空間を作成」をクリック
4. 名前：`note-activate-keys`（任意）

### Step 2：Cloudflare Worker 作成

1. 左メニュー「Workers & Pages」→「作成」
2. 名前：`note-activate`（任意）
3. 作成後「コードを編集する」を開く
4. 既存コードを全削除して以下を貼り付け → 「デプロイ」

```javascript
export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    const url = new URL(request.url);
    const key = url.searchParams.get('key');

    if (!key) {
      return new Response(JSON.stringify({ valid: false, reason: 'no_key' }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const expiry = await env.KV.get(key);

    if (!expiry) {
      return new Response(JSON.stringify({ valid: false, reason: 'invalid_key' }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const today = new Date().toISOString().split('T')[0];
    if (today > expiry) {
      return new Response(JSON.stringify({ valid: false, reason: 'expired', expiry }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    return new Response(JSON.stringify({ valid: true, expiry }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
};
```

### Step 3：バインディング設定

1. Worker の「設定」→「バインディング」→「追加」
2. 種類：KV 名前空間
3. 変数名：`KV`
4. KV 名前空間：`note-activate-keys`（ドロップダウンから選択）
5. 保存

---

## キー管理（日常運用）

### キーの発行

KV の「KV ペア」タブ → エントリを追加：

| キー | 値（有効期限） |
|---|---|
| `NK-ユーザー名-0001` | `2026-04-30` |
| `NK-ユーザー名-0002` | `2026-05-31` |

**命名規則（推奨）：** `NK-{ユーザー識別子}-{連番}`

### キーの無効化（退会・停止）

KV の「KV ペア」タブ → 該当キーを削除
→ ユーザーの次回起動時に自動停止

### 有効期限の延長（継続課金）

KV の該当キーの値（日付）を更新するだけ

---

## スクリプトへの組み込み方法

### 対象ファイルの条件

Node.js（ESモジュール）で書かれたスクリプト。
`package.json` に `"type": "module"` が必要。

### 追加するコード

スクリプトの `import` 文の直後に以下を追加：

```javascript
import { readFileSync, existsSync } from 'fs';  // 既存のimportに追加
import { join } from 'path';                     // 既存のimportに追加
import { homedir } from 'os';                    // 新規追加

// --- Activation Key Check ---
const WORKER_URL = 'https://note-activate.yahabaera007.workers.dev';
const KEY_FILE = join(homedir(), '.note-activate-key');

async function checkActivation() {
  let key = '';
  if (existsSync(KEY_FILE)) {
    key = readFileSync(KEY_FILE, 'utf-8').trim();
  }
  if (!key) {
    console.error('❌ アクティベーションキーが設定されていません。');
    console.error(`   以下のファイルにキーを記入してください: ${KEY_FILE}`);
    process.exit(1);
  }
  try {
    const res = await fetch(`${WORKER_URL}/?key=${encodeURIComponent(key)}`);
    const data = await res.json();
    if (!data.valid) {
      if (data.reason === 'expired') {
        console.error(`❌ アクティベーションキーの有効期限が切れています（期限: ${data.expiry}）`);
      } else {
        console.error('❌ アクティベーションキーが無効です。');
      }
      process.exit(1);
    }
    console.log(`✅ 認証OK（有効期限: ${data.expiry}）`);
  } catch (e) {
    console.error('⚠️ 認証サーバーに接続できません。インターネット接続を確認してください。');
    process.exit(1);
  }
}

await checkActivation();
// --- ここまでActivation Key Check ---
```

### 注意点

- `readFileSync` / `existsSync` が既存の `import 'fs'` にあれば追加不要
- `join` が既存の `import 'path'` にあれば追加不要
- `homedir` は新規追加が必要

---

## ユーザーへの案内文テンプレート

```
【Note投稿くん】アクティベーションキーのご案内

アクティベーションキー：NK-XXXX-0001
有効期限：2026年4月30日

【初回設定手順】
1. 以下のファイルを作成してください：
   C:\Users\{あなたのユーザー名}\.note-activate-key

2. ファイルの中にキーを1行だけ記入：
   NK-XXXX-0001

3. ツールを起動すると「✅ 認証OK」と表示されます

※ キーは他の方と共有しないでください
※ 有効期限が切れると自動的に停止します
```

---

## テスト済み動作確認

| パターン | 期待動作 | 確認済み |
|---|---|---|
| 有効なキー | `✅ 認証OK（有効期限: YYYY-MM-DD）` | ✅ |
| 無効なキー | `❌ アクティベーションキーが無効です。` | ✅ |
| 期限切れキー | `❌ アクティベーションキーの有効期限が切れています` | ✅ |
| キーファイルなし | `❌ アクティベーションキーが設定されていません。` | ✅ |

---

## 導入済みスクリプト

| スクリプト | 導入日 |
|---|---|
| `scripts/publish-hybrid.js` | 2026-03-31 |

---

## コスト

| サービス | 無料枠 | 備考 |
|---|---|---|
| Cloudflare Workers | 10万リクエスト/日 | ユーザー数100人でも余裕 |
| Cloudflare KV | 読み取り10万/日 | 同上 |
| 超過時 | $5/月 | 実質無料枠で十分 |
