# Note投稿くん v4.2

note.com でバズる記事を **リサーチ → 記事作成 → 図解生成 → 自動投稿** まで一気通貫で実行するツールです。

Claude Code（AI）に話しかけるだけで、Phase 1〜6 が全自動で動きます。

---

## バージョン履歴

| バージョン | 追加内容 |
|-----------|---------|
| v1.0 | Playwright自動投稿（テキストのみ） |
| v2.0 | AI臭ゼロ記事テンプレート + サムネイルUI設定 |
| v3.0 | 図解画像の自動挿入（ハイブリッド投稿方式） |
| v4.0 | プロンプト生成例の自動生成 + スキルフォルダ整備 |
| v4.1 | Auto Memory ログ追加 + gitignore強化 |
| v4.2 | ワークフロードキュメント整備 + noteリンク・コードブロックルール追加 |

---

## セットアップ手順

### 必要なもの

```
- Node.js 18 以上
- Python 3.11 以上
- note.com のアカウント
- Gemini API キー（画像生成用）
```

---

### STEP 1: リポジトリをクローン

```bash
git clone https://github.com/dejiinaworks-png/note-skill.git
cd note-skill
```

---

### STEP 2: Node.js パッケージのインストール

```bash
npm install
```

Playwright（ブラウザ自動操作）と dotenv がインストールされます。

---

### STEP 3: Chromium のインストール

```bash
npm run install-browser
```

Playwright が使う Chromium ブラウザをダウンロードします。

---

### STEP 4: 環境変数の設定

プロジェクトルートに `.env` ファイルを作成してください：

```
NOTE_ID=あなたのnote IDまたはメールアドレス
NOTE_PASSWORD=あなたのパスワード
GEMINI_API_KEY=GeminiのAPIキー
GEMINI_IMAGE_MODEL=gemini-3.1-flash-image-preview
```

> `.env` は gitignore 対象です。絶対にコミットしないでください。

---

### STEP 5: note.com にログイン（セッション保存）

```bash
npm run login
```

ブラウザが自動で開きます。

```
1. 表示された note.com のログインページでメールアドレス・パスワードを入力してログイン
2. ログイン完了を確認したら、ターミナルに戻って Enter を押す
3. 「セッション保存完了」と表示されたら OK
```

セッションは `~/.note-state.json` に保存されます（1〜2週間有効）。

> セッション期限切れになったら `npm run login` を再実行してください。

---

### STEP 6: 画像生成ツールのセットアップ

```bash
cd skill/nanobanana2
python -m venv .venv

# Windows
.venv\Scripts\activate

# Mac/Linux
source .venv/bin/activate

pip install -r requirements.txt
cd ../..
```

---

### セットアップ完了の確認

以下が揃っていれば準備完了です：

```
✅ npm install 完了
✅ Chromium インストール済み
✅ .env 作成済み
✅ ~/.note-state.json 存在する（npm run login 済み）
✅ skill/nanobanana2/.venv 作成済み
```

---

## 使い方

Claude Code を起動して以下のように話しかけるだけ：

```
テーマ：[テーマ名] で記事を下書きまで作ってください
```

Phase 1〜6 が全自動で動き、note.com に下書きが作成されます。

詳細な手順は `docs/WORKFLOW_DETAIL.md` を参照してください。

---

## ワークフロー概要

```
[Phase 1] リサーチ
    ↓ note.com の人気記事 + Web最新情報 + 読者のペインを収集
[Phase 2] 企画・構成設計
    ↓ タイトル3案・ハッシュタグ5つ・記事構成を決定
[Phase 3] 記事執筆
    ↓ output/articles/<slug>.md に保存（1,500〜2,500字）
[Phase 4] 図解・サムネイル生成
    ↓ nanobanana2 で図解2〜3枚 + サムネイル1枚を生成
[Phase 5] 品質チェック
    ↓ AI臭・太字ルール・ハッシュタグ・URLなど全項目確認
[Phase 6] note.com 自動投稿
    ↓ Playwright でエディターを自動操作して下書き保存
完成：下書きURLを出力 → エディターで確認 → 公開
```

---

## 投稿コマンド（手動実行する場合）

### 新規下書き

```bash
node scripts/publish-hybrid.js \
  "output/articles/<slug>.md" \
  "output/articles/images/<slug>_thumb.png" \
  "draft" "output/articles" "<マガジン名>"
```

### 既存ドラフトのサムネのみ更新

```bash
node scripts/publish-hybrid.js \
  "output/articles/<slug>.md" \
  "output/articles/images/<slug>_thumb.png" \
  "draft" "output/articles" "" "<ノートID>"
```

---

## noteエディター フォーマットルール

### リンクの挿入

```
❌ [テキスト](https://example.com)   ← Markdown形式はそのまま文字列表示される
✅ noteエディター「+」→「埋め込み」でURLを貼り付ける
```

### 太字

```
❌ **①「インフォグラフィック」と明記する**   ← 特殊文字を含む太字は崩れる
✅ ### インフォグラフィックと明記する         ← H3見出しで代用
```

### コードブロックの活用

コードブロックはコード以外にも使ってメリハリをつける：

```
✅ ここだけ覚えて：〇〇するだけでOK
```

```
✅ - ポイント①：〜
   - ポイント②：〜
   - ポイント③：〜
```

---

## 画像生成（nanobanana2）

```bash
cd skill/nanobanana2
python scripts/run.py generate.py \
  --prompt "[短い英語プロンプト]" \
  --output "../../output/articles/images/<slug>_fig1.png" \
  --aspect landscape
```

```
注意：
- プロンプトは短い英語のみ安定（日本語・特殊文字は詰まりやすい）
- 1枚ごとに5〜10秒のインターバルを挟む（レート制限対策）
- モデル：gemini-3.1-flash-image-preview（.env で固定）
```

---

## フォルダ構成

```
Note投稿くん/
├── .env                          # 認証情報（gitignore対象）
├── WORKFLOW.md                   # ワークフロー早見表
├── docs/
│   ├── WORKFLOW_DETAIL.md        # Phase 1〜6 詳細手順
│   └── FOLDER_STRUCTURE.md       # フォルダ構成図
│
├── scripts/
│   ├── publish-hybrid.js         # ★ note.com自動投稿メイン（Playwright）
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

- `.env`・Cookie・セッションファイルは gitignore 対象
- `.claude/agents/` は非公開（gitignore 対象）
- セッションは1〜2週間で期限切れ → `npm run login` で更新

## License

MIT
