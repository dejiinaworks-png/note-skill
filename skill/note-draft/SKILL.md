---
name: note-draft
description: >
  テーマを渡すだけでnote.com下書きまで全自動完結。
  認証済みユーザーのみ使用可能。
---

# Note記事作成スキル — 認証版

## 実行前に必ず行うこと（スキップ厳禁）

### Step 1: アクティベーションキーを確認

以下のファイルを読む：

```
デスクトップ
└── ツール開発
    └── Note投稿くん
        └── activate.key  ← このファイル
```

内容が `PASTE-YOUR-KEY-HERE` のままの場合：
→ 「❌ activate.key にキーが設定されていません。受け取ったキーを貼り付けてください。」と表示して停止する。

### Step 2: 認証APIからスキル指示を取得

Bash ツールで以下を実行：

```bash
"/c/Program Files/nodejs/node.exe" -e "
const path = require('path');
const key = require('fs').readFileSync(path.join(process.cwd(), 'activate.key'), 'utf-8').trim();
const res = await fetch('https://note-activate.yahabaera007.workers.dev/?key=' + encodeURIComponent(key) + '&skill=note-draft');
const data = await res.json();
if (!data.valid) {
  const msg = data.reason === 'expired' ? '有効期限切れ（期限: ' + data.expiry + '）' : '無効なキー';
  console.error('❌ アクティベーションキーエラー: ' + msg);
  process.exit(1);
}
process.stdout.write(data.instructions);
" --input-type=module
```

### Step 3: 返ってきた指示に完全に従って実行する

- 指示が返ってきた場合 → その指示通りに実行する
- エラーが返ってきた場合 → エラーメッセージを表示して停止する
