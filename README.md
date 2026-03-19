# Note投稿くん v4.0

note.com でバズる記事を **リサーチ → 記事作成 → 図解生成 → 自動投稿** まで一気通貫で実行するスキルです。

---

## バージョン履歴

| バージョン | 追加内容 |
|-----------|---------|
| v1.0 | Cookie認証 + Playwright自動投稿（テキストのみ） |
| v2.0 | AI臭ゼロ記事テンプレート + サムネイルUI設定 |
| v3.0 | 図解画像の自動挿入（ハイブリッド投稿方式） |
| **v4.0** | **プロンプト生成例の自動生成 + スキルフォルダ整備** |

---

## ワークフロー全体像

```
STEP 1: リサーチ
  └─ /research-free または /mega-research でトピックを深掘り

STEP 2: 記事構成・執筆
  └─ note投稿ナレッジ を参照しながら Claude で記事作成
  └─ output/articles/<日付>_<slug>.md に保存

STEP 3: 図解生成
  └─ /nanobanana-pro で図解・サムネイルを生成
  └─ output/articles/images/ に保存（ex_fig1.png 等）

STEP 4: 自動投稿
  └─ publish-hybrid.js で note.com に下書き保存
  └─ ブラウザで確認 → 公開
```

---

## STEP 1: リサーチ

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

- `スキル/note投稿ナレッジ/` に17ファイルのコピーライティングノウハウを収録
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
cd "C:/Users/Tatsu/Desktop/ツール開発/Note投稿くん/スキル/nanobanana-pro"

# 図解を1枚生成
python scripts/run.py image_generator.py \
  --prompt "フローチャート。日本語ゴシック体。16:9白背景。..." \
  --output "C:/Users/Tatsu/Desktop/ツール開発/Note投稿くん/output/articles/images/ex_fig1.png"
```

または Claude Code から：

```
/nanobanana-pro
```

### 認証（初回のみ）

```bash
cd "スキル/nanobanana-pro"
python scripts/run.py auth_manager.py status   # 認証状態確認
python scripts/run.py auth_manager.py setup    # ブラウザ起動でGoogleログイン
```

認証は約7日間有効。セッションは `スキル/nanobanana-pro/data/browser_profile/` に保存。

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
├── scripts/                      # 自動投稿スクリプト
│   └── publish-hybrid.js         # メイン投稿スクリプト（v4）
│
├── スキル/                       # 自己完結スキル群
│   ├── nanobanana-pro/           # Gemini画像生成スキル
│   │   ├── scripts/              # Pythonスクリプト群
│   │   ├── data/browser_profile/ # Googleログインセッション
│   │   └── SKILL.md              # スキル使い方ガイド
│   │
│   └── note投稿ナレッジ/         # コピーライティングナレッジ17ファイル
│       ├── 最強コラム執筆システム.txt
│       ├── 冒頭フック事例集.txt
│       ├── 読者心理操作テクニック集.txt
│       └── ...
│
├── output/                       # 生成物（Gitignore）
│   └── articles/
│       ├── <日付>_<slug>.md      # 記事本文
│       └── images/               # 図解・サムネイル
│           ├── diagram_fig1.png  # 記事構造用図解
│           ├── ex_fig1_xxx.png   # プロンプト生成例
│           └── thumbnail.png     # サムネイル
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
- **Python** 3.9+（nanobanana-pro用）
- **Chrome / Chromium**（Playwright用）
- **note.com アカウント**（Cookieで認証）
- **Googleアカウント**（NanoBanana2の画像生成）

## Security

- Cookie・セッション状態ファイルはGitにコミットされません
- `.gitignore` で `output/`, `data/browser_profile/`, `*.json` を除外済み
- セッションは1〜2週間で期限切れ → Cookie再取得 or Googleログイン再認証

## License

MIT
