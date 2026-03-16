# /note-post コマンド v2.0

テーマを与えるだけで、リサーチ→執筆→画像生成→自動投稿まで実行します。

## 使い方

```
/note-post テーマ:"[テーマ]"
```

引数: `$ARGUMENTS`

## 実行フロー

`.claude/skills/note-buzz-post.md` のスキルに従って実行。

### Step 1: リサーチ（3エージェント並列）
- テーマの最新情報
- note.comバズ記事分析
- 読者ペイン調査

### Step 2: 企画
- タイトル3案を提示 → ユーザー確認
- 記事構成（H2×4 + リード + まとめ）

### Step 3: 執筆
- AI臭ゼロルールに従って本文生成
- 語尾チェック（3連続禁止）
- 1,500〜2,500字

### Step 4: 画像生成
```bash
# サムネイル
node scripts/generate-thumbnail.js "[プロンプト]" output/articles/thumbnail.png

# 図解3枚
node scripts/generate-thumbnail.js "[図解プロンプト]" output/articles/fig1.png
node scripts/generate-thumbnail.js "[図解プロンプト]" output/articles/fig2.png
node scripts/generate-thumbnail.js "[図解プロンプト]" output/articles/fig3.png
```

### Step 5: 記事ファイル生成
Markdown形式で `output/articles/YYYYMMDD_[slug].md` に保存。
画像は `![alt](output/articles/fig1.png)` で埋め込み。

### Step 6: 自動投稿
```bash
node scripts/publish-article.js output/articles/[記事].md output/articles/thumbnail.png publish
```

### 前提条件
- `~/.note-state.json` が存在すること
- 未設定: Chrome拡張でCookie取得 → `node scripts/cookies-to-state.js cookies.txt`
- セッション期限: 1-2週間で再取得が必要
