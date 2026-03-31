---
name: nanobanana2
description: >
  Gemini API直接呼び出しによる高品質図解・画像生成スキル。
  透かしなし。モデル固定: gemini-3.1-flash-image-preview。
  note.com記事用の図解・サムネイル・インフォグラフィック作成に特化。
---

# nanobanana2 — Gemini API 画像生成スキル

## 重要: モデル固定ルール

**必ず `gemini-3.1-flash-image-preview` を使用すること。他のモデルは絶対に使わない。**

- `imagen-4.0-fast` → 禁止
- `gemini-2.5-flash-image` → 禁止
- `gemini-2.0-flash-exp` → 禁止
- `gemini-3.1-flash-image-preview` → これだけ使う

## ベースディレクトリ

プロジェクトルート（`note-skill/`）からの相対パスで実行してください。

## クイックスタート

```bash
# 基本的な図解生成（プロジェクトルートから実行）
cd skill/nanobanana2
python scripts/run.py generate.py \
  --prompt "horizontal comparison diagram: left side 'Before' with red X marks, right side 'After' with green checkmarks, white background, Japanese text, flat design" \
  --output "../../output/articles/images/my_diagram.png" \
  --aspect landscape

# スタイル指定あり
python scripts/run.py generate.py \
  --prompt "flowchart showing 5 steps from problem to solution" \
  --style "minimal flat design, blue color scheme, Japanese labels" \
  --output "output/articles/images/flowchart.png"

# サムネイル生成（16:9）
python scripts/run.py generate.py \
  --prompt "dark blue background, robot hand touching computer screen, Japanese title text" \
  --aspect landscape \
  --output "output/articles/images/thumbnail.png"
```

## パラメータ

| パラメータ | 必須 | デフォルト | 説明 |
|-----------|------|-----------|------|
| `--prompt` | Yes | - | 画像生成プロンプト（英語推奨） |
| `--output` | No | output/generated.png | 出力先パス |
| `--aspect` | No | landscape | square/landscape/portrait/wide |
| `--style` | No | - | スタイル指定（flat, 3D, infographicなど） |
| `--negative` | No | - | 避けたい要素 |
| `--debug` | No | false | デバッグ出力 |

## 図解パターン

詳細は `DIAGRAM_PATTERNS.md` を参照（100パターン収録）。

### 最頻出パターン（すぐ使えるプロンプト）

#### 比較図（Before/After）
```
horizontal comparison diagram, left panel labeled 'Before' in Japanese with red X marks showing problems,
right panel labeled 'After' in Japanese with green checkmarks showing solutions,
white background, flat design, Japanese text labels, clean minimal style
```

#### フローチャート（5ステップ）
```
vertical flowchart with 5 numbered steps connected by arrows,
each step in a rounded rectangle with icon,
blue gradient color scheme, white background, Japanese text, infographic style
```

#### ピラミッド図（優先度）
```
pyramid diagram with 3 tiers, top tier highlighted in gold,
middle in silver, bottom in bronze,
each tier has Japanese text label, white background, flat design
```

#### アーキテクチャ図（技術構成）
```
system architecture diagram showing components connected by arrows,
boxes with labels in Japanese and English,
clean white background, blue and gray color scheme, technical diagram style
```

#### サムネイル（記事用）
```
dark navy blue background, large Japanese title text centered,
small accent icons around text,
professional blog post thumbnail, 16:9 format, modern design
```

## 環境設定

`.env` ファイル（プロジェクトルート）に以下を設定:
```
GEMINI_API_KEY=your_key_here
GEMINI_IMAGE_MODEL=gemini-3.1-flash-image-preview
```

## アーキテクチャ

```
nanobanana2/
├── SKILL.md              — このファイル（Claudeへの指示）
├── DIAGRAM_PATTERNS.md   — 100の図解パターン集
├── requirements.txt      — google-genai, python-dotenv, Pillow
└── scripts/
    ├── run.py            — venvラッパー（自動セットアップ）
    └── generate.py       — Gemini API直接呼び出し（メインスクリプト）
```

## 注意事項

- **初回実行時**: venv作成とパッケージインストールで1〜2分かかる
- **2回目以降**: 即座に実行
- **透かし**: API経由なのでジェミニの透かし（ダイヤモンドマーク）は入らない
- **プロンプト**: 英語の方が品質が高い。日本語テキストは`Japanese text: "内容"`の形式で指定
- **コンテンツポリシー**: 著作権のあるキャラクター、実在人物は使用不可
