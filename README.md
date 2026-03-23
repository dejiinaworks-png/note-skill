# Note投稿くん v4.1

note.com でバズる記事を **リサーチ → 記事作成 → 図解生成 → 自動投稿** まで一気通貫で実行するスキルです。

---

## バージョン履歴

| バージョン | 追加内容 |
|-----------|---------|
| v1.0 | Cookie認証 + Playwright自動投稿（テキストのみ） |
| v2.0 | AI臭ゼロ記事テンプレート + サムネイルUI設定 |
| v3.0 | 図解画像の自動挿入（ハイブリッド投稿方式） |
| v4.0 | プロンプト生成例の自動生成 + スキルフォルダ整備 |
| v4.1 | Auto Memory ログ追加（Stop hook）+ gitignore強化 + skill/フォルダ整備 |

---

## Phase 1: ブラウザログインセットアップ

note.com への自動ログインには **browser-use CLI** を使います。

### 前提条件

- Python 3.11 以上
- browser-use インストール済み

```bash
pip install browser-use
playwright install chromium
```

### 環境変数の設定

プロジェクトルートの `.env` ファイルに以下を記載：

```
NOTE_ID=あなたのnote ID（またはメールアドレス）
NOTE_PASSWORD=あなたのパスワード
```

`.env` はGitignore対象です。絶対にGitにコミットしないでください。

### ログイン手順

#### ステップ1: ログインページを開く

```bash
browser-use --session note-login --headed open https://note.com/login
```

#### ステップ2: ブラウザの入力欄インデックスを確認

```bash
browser-use --session note-login state
```

出力例（インデックス番号はページの状態で変わることがある）：

```
[127]<input id=email placeholder=mail@example.com or note ID />
[135]<input type=password autocomplete=current-password />
[144]<button disabled=true /> ログイン
```

#### ステップ3: ID・パスワードを入力してログイン

```bash
# メールアドレス/ID 入力（インデックス番号は state で確認）
browser-use --session note-login input 127 "あなたのNOTE_ID"

# パスワード入力
browser-use --session note-login input 135 "あなたのパスワード"

# ログインボタンをクリック
browser-use --session note-login click 144
```

#### ステップ4: ログイン確認

```bash
browser-use --session note-login state
```

note.com のトップページが表示されていればログイン成功。

### セッション管理

```bash
# 現在のセッション一覧
browser-use sessions

# 不要なセッションを閉じる
browser-use --session セッション名 close

# 全セッションを閉じる
browser-use close --all
```

### 注意事項

- `--session note-login` を毎回指定することで同じブラウザセッションを再利用できる
- セッションはPC再起動またはブラウザを閉じると終了する
- 再ログインが必要な場合は上記ステップ1から再実行する

---

## 記事制作ワークフロー

```
STEP 1: テーマ設定
  └─ 使用者がテーマを指定する

STEP 2: リサーチ（/mega-research）
  └─ バズっている・反応が取れている・信頼性の高い情報を収集
  └─ 収集した情報を記事のネタとして整理

STEP 3: 記事作成（note投稿ナレッジ）
  └─ skill/note投稿ナレッジ/ を参照しながら記事を執筆
  └─ output/articles/<slug>.md に保存

STEP 4: 図解の挿入（/nanobanana2）
  └─ 記事の要点を視覚化した図解を生成
  └─ 詰め込みすぎず、1図解＝1メッセージを原則とする
  └─ output/articles/images/<slug>_fig1.png 等に保存
  └─ 記事MDの該当箇所に挿入

STEP 5: サムネイル作成（/nanobanana2）
  └─ 記事タイトルと内容に合ったサムネイルを生成
  └─ output/articles/images/<slug>_thumbnail.png に保存

STEP 6: noteに下書き作成（publish-hybrid.js）
  └─ browser-use で note-login セッションを起動
  └─ publish-hybrid.js で記事・図解・サムネイルを一括アップロード
  └─ note.com のエディタで確認 → 問題なければ公開
```

---

## STEP 2: リサーチ詳細

### 使用スキル

```
/mega-research <テーマ>
```

複数のAPIを統合した高精度リサーチ。以下を重点的に収集する：

| 収集対象 | 目的 |
|---------|------|
| バズっている記事・投稿 | 読まれるネタ・切り口の把握 |
| 高反応のコンテンツ | タイトル・構成パターンの参考 |
| 信頼性の高い情報源 | 記事の根拠・データとして活用 |
| 具体的な数字・事例 | 読者の納得感を高める材料 |

### リサーチ結果の保存先

```
research/<テーマ>_research.md
```

---

## STEP 3: 記事作成詳細

### 使用ナレッジ

`skill/note投稿ナレッジ/` の以下を必ず参照：

| ファイル | 用途 |
|---------|------|
| `最強コラム執筆システム.txt` | 記事構成の骨格 |
| `冒頭フック事例集.txt` | 最初の3行で読者を引き込む |
| `読者心理操作テクニック集.txt` | エンゲージメント向上 |
| `コラム作成絶対禁止事項.txt` | AI臭を消す・禁止ワード一覧 |

### 記事フォーマット

```markdown
---
title: 記事タイトル
tags:
  - タグ1
  - タグ2
---

本文...

![図解の説明](images/<slug>_fig1.png)

---
```

### 太字の注意事項

note.com では特殊文字を含む太字は正常に表示されない：

```
❌ **① 「インフォグラフィック」と明記する**
✅ ### インフォグラフィックと明記する
```

**ルール**: `**bold**` は純粋な日本語・英語のみに使用。①②③や「」❌などはH3見出しで代用。

### 保存先

```
output/articles/<slug>.md
```

---

## STEP 4 & 5: 図解・サムネイル作成詳細

### 使用スキル

```
/nanobanana2
```

### 図解の作成原則

| 原則 | 内容 |
|------|------|
| 1図解＝1メッセージ | 伝えたいことを1つに絞る |
| テキスト最小化 | 文字は最低限、視覚で伝える |
| 余白を確保 | 詰め込みすぎない |
| 日本語ゴシック体 | 読みやすいフォント指定 |

### 図解の種類と使い分け

| 種類 | 使う場面 |
|------|---------|
| フローチャート | 手順・プロセスの説明 |
| 比較表 | Before/After、選択肢の違い |
| 階層図 | 概念の構造・関係性 |
| 強調カード | 重要な数字・一言メッセージ |

### サムネイルの条件

- サイズ：1280×670px 推奨
- 内容：タイトルの核心を一言で表現
- デザイン：背景色＋大きなテキスト＋アイコン or イラスト
- AI生成感を排除：シンプルで清潔なデザインにする

### 保存先

```
output/articles/images/<slug>_fig1.png       # 図解
output/articles/images/<slug>_thumbnail.png  # サムネイル
```

---

## STEP 1: リサーチ（旧セクション・参考）

### コマンド

```
/research-free <トピック>
```

APIキー不要。Claude Code組み込みのWebSearch + WebFetchで動作。

```
/mega-research <トピック>
```

複数APIを使った高精度リサーチ（APIキーが必要）。

### 参考ナレッジ

- `skill/note投稿ナレッジ/` に17ファイルのコピーライティングノウハウを収録
  - `最強コラム執筆システム.txt` → 記事構成の骨格
  - `冒頭フック事例集.txt` → 読まれるリード文
  - `読者心理操作テクニック集.txt` → エンゲージメント向上
  - `コラム作成絶対禁止事項.txt` → AI臭を消す禁止ワード

---

## STEP 2: 記事作成

### マークダウン形式

記事は以下のフォーマットで `output/articles/` に作成：

```markdown
---
title: 記事タイトル
tags:
  - タグ1
  - タグ2
---

本文...

![](images/diagram_fig1.png)

---

#タグ1 #タグ2
```

### 画像の挿入ルール

- 画像は `output/articles/images/` に配置
- マークダウン内は `![](images/ファイル名.png)` の形式で参照
- 投稿スクリプトが自動でnote.comにアップロードする

### 太字の注意事項

note.comでは特殊文字を含む太字は正常に表示されない：

```
❌ **① 「インフォグラフィック」と明記する**
✅ ### インフォグラフィックと明記する
```

**ルール**: `**bold**` は純粋な日本語・英語のみに使用。①②③や「」❌などはH3見出しで代用。

---

## STEP 3: 図解生成

### 基本コマンド

```bash
cd "プロジェクトルート/skill/nanobanana2"

# 図解を1枚生成（スキルの SKILL.md 参照）
```

または Claude Code から：

```
/nanobanana-pro
```

### 認証（初回のみ）

`skill/nanobanana2/SKILL.md` を参照してください。Googleアカウントでの認証が必要です。

### タイムアウト対策

複雑なプロンプトは180秒でタイムアウトすることがある。対策：

1. `--timeout 300` を追加
2. プロンプトを短く・シンプルにする
3. 複雑な構造（大量テキスト含む比較表など）は内容を絞る

### プロンプトのコツ（図解で安定生成するパターン）

| 目的 | 安定するパターン | タイムアウトしやすいパターン |
|------|-----------------|--------------------------|
| フローチャート | 手順を箇条書きで渡す | 長い説明文を入れる |
| 比較表 | 列タイトルをシンプルに | 「悪い例 vs 良い例」など評価的な表現 |
| 階層図 | ルート→ブランチを矢印で表現 | 詳細な説明を各ノードに追加 |

---

## STEP 4: 自動投稿

### コマンド

```bash
cd "C:/Users/Tatsu/Desktop/ツール開発/Note投稿くん"

node scripts/publish-hybrid.js \
  <記事MDパス> \
  <サムネイル画像パス> \
  <draft|publish> \
  <画像ベースディレクトリ>
```

### 実行例

```bash
# 下書き保存（確認してから公開）
node scripts/publish-hybrid.js \
  output/articles/20260319_nanobana_diagram.md \
  output/articles/images/diagram_thumbnail.png \
  draft \
  output/articles

# 直接公開
node scripts/publish-hybrid.js \
  output/articles/20260319_nanobana_diagram.md \
  output/articles/images/diagram_thumbnail.png \
  publish \
  output/articles
```

### 引数の説明

| 引数 | 説明 | 例 |
|------|------|----|
| 記事MDパス | Markdownファイルのパス | `output/articles/xxx.md` |
| サムネイル | サムネイル画像（省略可） | `output/articles/images/thumb.png` |
| モード | `draft` or `publish` | `draft` |
| 画像ベースDir | 画像の基準ディレクトリ（必須） | `output/articles` |

**重要**: 画像ベースDirを省略すると画像が0枚になる。記事MDがある階層（`output/articles`）を渡す。

### 認証セットアップ（初回のみ）

**Phase 1 のブラウザログイン手順**（上記参照）で `note-login` セッションを起動してからスクリプトを実行してください。

または、Cookie方式を使う場合：

```bash
# Chrome で note.com にログイン後、Cookie拡張でエクスポート
# ファイル名 note.com_cookies.txt としてプロジェクトルートに配置

node scripts/cookies-to-state.js note.com_cookies.txt
# → ~/.note-state.json にセッション保存
```

---

## フォルダ構成

```
Note投稿くん/
├── .env                          # 認証情報（NOTE_ID / NOTE_PASSWORD）※Gitignore対象
├── data/
│   └── browser_profile_note/     # browser-use セッション保存先
│
├── scripts/                      # 自動投稿スクリプト
│   ├── publish-hybrid.js         # メイン投稿スクリプト（v5）
│   ├── login-note.js             # 手動ログイン + セッション保存
│   ├── cookies-to-state.js       # Cookie → セッション変換
│   ├── note-api.js               # API操作
│   ├── publish-api.js            # API投稿
│   ├── publish-article.js        # 記事投稿
│   ├── generate-thumbnail.js     # サムネイル生成
│   └── debug/                    # デバッグ・調査用スクリプト
│
├── skill/                        # 自己完結スキル群
│   ├── nanobanana2/              # Gemini画像生成スキル
│   └── note投稿ナレッジ/         # コピーライティングナレッジ17ファイル
│       ├── 最強コラム執筆システム.txt
│       ├── 冒頭フック事例集.txt
│       ├── 読者心理操作テクニック集.txt
│       └── ...
│
├── output/                       # 生成物（Gitignore）
│   └── articles/
│       ├── <slug>.md             # 記事本文
│       └── images/               # 図解・サムネイル
│
├── templates/                    # 記事テンプレート
├── research/                     # リサーチ結果
└── README.md                     # このファイル
```

---

## Tips

### 記事ファイルの命名規則

```
output/articles/<YYYYMMDD>_<英語スラッグ>.md
output/articles/images/<YYYYMMDD>_<スラッグ>_thumbnail.png
```

### 図解命名規則

| ファイル名 | 用途 |
|-----------|------|
| `diagram_fig1.png` | 記事の説明・構造図（記事内任意の位置） |
| `ex_fig1_flowchart.png` | プロンプト1の生成例（コードブロック直後） |
| `thumbnail.png` | サムネイル（publish-hybrid.js第2引数） |

### 品質チェックリスト（投稿前）

- [ ] 太字に特殊文字（①「」❌）が含まれていないか
- [ ] 各プロンプトの直後に「▼ 実際に生成してみた」+ 生成例画像があるか
- [ ] サムネイル画像が設定されているか
- [ ] 画像ベースDirを引数に渡しているか（画像: 0枚 になっていないか）
- [ ] 下書きをブラウザで確認してから公開

---

## Requirements

- **Node.js** 18+
- **Python** 3.11+
- **browser-use CLI**（`pip install browser-use` + `playwright install chromium`）
- **note.com アカウント**
- **Googleアカウント**（NanoBanana2の画像生成）

## Security

- Cookie・セッション状態ファイルはGitにコミットされません
- `.gitignore` で `output/`, `data/browser_profile/`, `*.json` を除外済み
- セッションは1〜2週間で期限切れ → Cookie再取得 or Googleログイン再認証

## License

MIT
