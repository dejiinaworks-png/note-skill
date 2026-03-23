# Note投稿くん — ワークフロー早見表

**詳細な実行手順は `skill/note-draft/SKILL.md` を参照。**

---

## 使い方（最短）

```
「次のテーマでnote記事の下書きを作成してください。
skill/note-draft/SKILL.md のワークフローを Phase 1〜7 まで全て実行してください。

テーマ：[テーマ]
ターゲット：[想定読者]
タグ：[タグ1], [タグ2], [タグ3], [タグ4], [タグ5]
マガジン：[任意]」
```

---

## フロー概要

```
テーマ入力
  ↓
[Phase 1] researcher エージェント → リサーチ・出典収集
  ↓
[Phase 2] sub-planner → 記事骨格設計 + 画像計画（可変枚数）
         qa-lead     → 初心者向け情報漏れチェック
  ↓
[Phase 3] sub-implementer → 記事MD執筆
  ↓
[Phase 4] nanobanana2 → 図解生成（2〜5枚）+ サムネイル（1枚）
  ↓
[Phase 5] qa-lead → 品質ゲート（ARTICLE_CHECKLIST.md）
  ↓
[Phase 6] publish-hybrid.js → 下書き投稿（タグ・マガジン含む）
  ↓
[Phase 7] エディターで完了確認
```

---

## 重要ファイル一覧

| ファイル | 役割 |
|---------|------|
| `skill/note-draft/SKILL.md` | 完全ワークフロー定義（エージェント指示含む） |
| `skill/note-draft/ARTICLE_CHECKLIST.md` | 記事品質チェックリスト（qa-lead が使用） |
| `skill/note-draft/THUMBNAIL_GUIDE.md` | サムネイル設計ガイド（5パターン × プロンプト付き） |
| `skill/nanobanana2/SKILL.md` | 画像生成スキル仕様 |
| `skill/nanobanana2/DIAGRAM_PATTERNS.md` | 100パターンの図解プロンプト集 |
| `scripts/publish-hybrid.js` | 下書き投稿スクリプト |

---

## コマンドリファレンス

### 下書き投稿（新規）
```bash
"/c/Program Files/nodejs/node.exe" scripts/publish-hybrid.js \
  "output/articles/[article].md" \
  "output/articles/images/[slug]_thumbnail.png" \
  "draft" "output/articles" "[マガジン名]"
```

### 下書き投稿（既存ノートに上書き）
```bash
"/c/Program Files/nodejs/node.exe" scripts/publish-hybrid.js \
  "output/articles/[article].md" \
  "output/articles/images/[slug]_thumbnail.png" \
  "draft" "output/articles" "" "[ノートID]"
```

### 画像生成
```bash
cd skill/nanobanana2
python scripts/run.py generate.py \
  --prompt "[英語プロンプト]" \
  --output "../../output/articles/images/[slug]_[id].png" \
  --aspect landscape
```

---

## フォーマット早見表

| Markdown | note.com表示 | 使いどころ |
|----------|------------|----------|
| `## テキスト` | 大見出し | セクション区切り |
| `### テキスト` | 小見出し | Step・サブセクション |
| `- テキスト` | 箇条書き | リスト・特徴列挙 |
| ` ```\ncode\n``` ` | コードブロック（背景付き） | コマンド・設定値 |
| `> テキスト` | 引用ブロック（グレー背景） | 要件・URLまとめ・重要ポイント |
| `**テキスト**` | 太字 | 強調 |
