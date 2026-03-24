# Note投稿くん v4.2

note.com でバズる記事を **リサーチ → 記事作成 → 図解生成 → 自動投稿** まで一気通貫で実行するツールです。

---

## バージョン履歴

| バージョン | 追加内容 |
|-----------|---------|
| v1.0 | Cookie認証 + Playwright自動投稿（テキストのみ） |
| v2.0 | AI臭ゼロ記事テンプレート + サムネイルUI設定 |
| v3.0 | 図解画像の自動挿入（ハイブリッド投稿方式） |
| v4.0 | プロンプト生成例の自動生成 + スキルフォルダ整備 |
| v4.1 | Auto Memory ログ追加 + gitignore強化 + skill/フォルダ整備 |
| v4.2 | ワークフロードキュメント整備 + noteリンク・コードブロックルール追加 |

---

## 必要環境

| ツール | バージョン |
|--------|-----------|
| Node.js | 18+ |
| Python | 3.11+ |
| Playwright | `npm install` で自動インストール |

```
npm install
```

---

## セットアップ（初回のみ）

### 1. 環境変数の設定

プロジェクトルートに `.env` を作成：

```
NOTE_ID=あなたのnote IDまたはメールアドレス
NOTE_PASSWORD=あなたのパスワード
GEMINI_API_KEY=GeminiのAPIキー
GEMINI_IMAGE_MODEL=gemini-3.1-flash-image-preview
```

> `.env` は gitignore 対象です。絶対にコミットしないでください。

### 2. note.com へのブラウザログイン

`data/browser_profile_note/` にセッションを保存します。

```bash
"/c/Program Files/nodejs/node.exe" scripts/login-note.js
```

ブラウザが起動するのでnote.comにログインしてください。ログイン後、セッションが自動保存されます。

### 3. nanobanana2（画像生成）のセットアップ

```bash
cd skill/nanobanana2
python -m venv .venv
.venv/Scripts/activate   # Windows
pip install -r requirements.txt
```

---

## 記事を作成する（最短手順）

Claude Code で以下を実行するだけ：

```
テーマ：[テーマ名] で記事を下書きまで作ってください
```

Phase 1〜6 が全自動で動きます。詳細は `docs/WORKFLOW_DETAIL.md` を参照。

---

## ワークフロー概要

```
[Phase 1] リサーチ（note-research / gem-research / mega-research-plus）
    ↓
[Phase 2] 企画・構成設計（タイトル3案 → 選択、ハッシュタグ5つ、記事構成）
    ↓
[Phase 3] 記事執筆（output/articles/<slug>.md に保存）
    ↓
[Phase 4] 図解・サムネイル生成（nanobanana2 / output/articles/images/）
    ↓
[Phase 5] 品質チェック（ARTICLE_CHECKLIST.md 全項目確認）
    ↓
[Phase 6] note.com 自動投稿（publish-hybrid.js）
    ↓
完成：下書きURL出力 → エディターで確認 → 公開
```

---

## 投稿コマンド

### 新規下書き

```bash
"/c/Program Files/nodejs/node.exe" scripts/publish-hybrid.js \
  "output/articles/<slug>.md" \
  "output/articles/images/<slug>_thumb.png" \
  "draft" "output/articles" "<マガジン名>"
```

### 既存ドラフトのサムネのみ更新

```bash
"/c/Program Files/nodejs/node.exe" scripts/publish-hybrid.js \
  "output/articles/<slug>.md" \
  "output/articles/images/<slug>_thumb.png" \
  "draft" "output/articles" "" "<ノートID>"
```

---

## noteエディター フォーマットルール

### リンクの挿入

```
❌ [テキスト](https://example.com)   ← Markdown形式はそのまま文字列表示される
✅ noteエディター「+」→「埋め込み」でURLを貼り付け
```

### 太字

```
❌ **①「インフォグラフィック」と明記する**   ← 特殊文字を含む太字は崩れる
✅ ### インフォグラフィックと明記する         ← H3見出しで代用
```

### コードブロックの活用

コードブロックはコード以外にも使ってメリハリをつける：

```
✅ ここだけ覚えて：APIキーは環境変数で管理する
```

```
✅ - ポイント①：〜
   - ポイント②：〜
   - ポイント③：〜
```

| 使いどころ | 具体例 |
|-----------|--------|
| ワンポイント | 「ここだけ覚えて」的な一言まとめ |
| 重要な数値・結論 | 価格・比較結果など |
| 箇条書きリスト | 視覚的にまとめたいリスト |

### 区切り線

セクションの境界には「+」→「区切り線」を活用する。

---

## 画像生成（nanobanana2）

```bash
cd skill/nanobanana2
python scripts/run.py generate.py \
  --prompt "[短い英語プロンプト]" \
  --output "../../output/articles/images/<slug>_fig1.png" \
  --aspect landscape
```

**注意：**
- プロンプトは短い英語のみ安定（日本語・数字含むと詰まりやすい）
- 1枚ごとに5〜10秒のインターバルを挟む（レート制限対策）
- モデル：`gemini-3.1-flash-image-preview`（`.env` で固定）

---

## フォルダ構成

```
Note投稿くん/
├── .env                          # 認証情報（gitignore対象）
├── WORKFLOW.md                   # ワークフロー早見表
├── docs/
│   ├── WORKFLOW_DETAIL.md        # Phase 1〜6 詳細手順
│   ├── FOLDER_STRUCTURE.md       # フォルダ構成図
│   └── logs/                     # 作業ログ
│
├── scripts/
│   ├── publish-hybrid.js         # ★ note.com自動投稿メイン
│   ├── login-note.js             # ログイン・セッション保存
│   └── note-api.js               # APIラッパー
│
├── skill/
│   ├── nanobanana2/              # ★ Gemini画像生成ツール
│   └── note投稿ナレッジ/         # コピーライティングナレッジ（17ファイル）
│
├── output/articles/              # 生成した記事・画像（gitignore対象）
├── templates/                    # 記事テンプレート
└── research/                     # リサーチ資料（gitignore対象）
```

---

## 品質チェックリスト（投稿前）

- [ ] タイトルは30文字以内
- [ ] リード文に読者の悩みへの共感が入っている
- [ ] AI臭い表現（「〜と言えるでしょう」等）を使っていない
- [ ] 体験ベースのエピソードが1つ以上ある
- [ ] 図解が3枚以上入っている
- [ ] 参考URLはアクセス確認済み（不明なら削除）
- [ ] 文末に `#タグ` が混入していない
- [ ] 太字に特殊文字（①「」❌）が含まれていない
- [ ] リンクは「埋め込み」で挿入されている
- [ ] 文字数は1,500〜2,500字

---

## Security

- `.env`、Cookie、セッションファイルはgitignore対象
- `.claude/agents/` は非公開（gitignore対象）
- セッションは1〜2週間で期限切れ → 再ログインで更新

## License

MIT
