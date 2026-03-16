# Note投稿くん v1.0

note.com でバズる記事を **リサーチ → 企画 → 文章生成 → 図解作成 → 自動投稿** まで一気通貫で実行するスキルです。

## Overview

| フェーズ | 内容 | ステータス |
|---------|------|-----------|
| Phase 1 | ディープリサーチ（2段階方式） | Ready |
| Phase 2 | 企画・構成設計 | Ready |
| Phase 3 | 文章生成（Claude） | Ready |
| Phase 4 | 図解生成（NanoBanana2 / Gemini） | Ready |
| Phase 5 | レイアウト組み立て | Ready |
| Phase 6 | 品質チェック | Ready |
| Phase 7 | **note.com 自動投稿** | **v1.0 NEW** |

## Features

### コンテンツ戦略（Phase 1-6）
- バズる記事パターン分析・テンプレート
- ディープリサーチスキル（note/X/YouTube/Reddit）
- NanoBanana2 対応の図解・バナー生成プロンプト
- 記事構成テンプレート（ノウハウ型 / ストーリー型 / リスト型）
- 96種のエージェント + 110+ スキル

### 自動投稿（Phase 7）
- Cookie ベース認証（Chrome 拡張から書き出し）
- Playwright でブラウザ自動操作
- タイトル・本文入力 → 下書き保存 → 公開まで全自動
- Gemini API によるサムネイル画像の自動生成

---

## Requirements

- **Node.js** 18+
- **Chrome 拡張**: [Get cookies.txt locally](https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc)
- **note.com アカウント**（ログイン済み）
- **Gemini API Key**（サムネイル生成を使う場合）

## Quick Start

### 1. セットアップ

```bash
git clone https://github.com/dejiinaworks-png/note-skill.git
cd note-skill
npm install
npx playwright install chromium
cp .env.example .env
# .env に Gemini API Key を設定
```

### 2. note.com の認証

```bash
# Chrome で note.com にログイン → 拡張で Cookie を Export
# ダウンロードした cookies.txt をプロジェクトルートに配置

node scripts/cookies-to-state.js note.com_cookies.txt
# → ~/.note-state.json にセッション状態が保存される
```

### 3. 投稿テスト

```bash
# サムネイル画像を生成
node scripts/generate-thumbnail.js

# 下書きとして保存
node scripts/test-draft.js test/thumbnail.png draft

# 公開投稿
node scripts/test-draft.js test/thumbnail.png publish
```

---

## Project Structure

```
note-skill/
├── .claude/                    # Claude Code スキル・エージェント群
│   ├── skills/
│   │   ├── note-buzz-post.md       # バズ投稿スキル（メイン）
│   │   ├── note-marketing/         # noteマーケティングスキル
│   │   ├── note-research/          # noteリサーチスキル
│   │   ├── nanobanana-pro/         # NanoBanana2 画像生成
│   │   └── ... (110+ skills)
│   ├── agents/                     # 96種のエージェント
│   └── commands/
│       └── post-note.md            # /post-note コマンド
├── scripts/                    # 自動投稿スクリプト群（Phase 7）
│   ├── cookies-to-state.js         # Cookie → Playwright State 変換
│   ├── generate-thumbnail.js       # Gemini でサムネイル生成
│   ├── login-note.js               # ブラウザログイン（代替手段）
│   ├── test-draft.js               # 自動投稿メインスクリプト
│   └── check-post.js               # 投稿確認
├── templates/                  # 記事テンプレート集
│   ├── article-structure.md        # 構成テンプレート
│   ├── title-patterns.md           # タイトルパターン
│   └── nanobana-prompts.md         # NanoBanana2 プロンプト
├── research/                   # リサーチ結果
│   ├── pass1_market_research.md    # Pass1 マーケットリサーチ
│   └── pass2_deepdive.md           # Pass2 深掘りリサーチ
├── test/
│   └── sample-article.md           # テスト記事テンプレート
├── 要件定義書.md                # システム全体の要件定義
├── .env.example                # 環境変数テンプレート
├── .gitignore
├── package.json
└── README.md
```

## Security

- **Cookie ファイル、.env、セッション状態ファイルは Git にコミットされません**
- `.gitignore` で除外済み
- Cookie はパスワードと同等の機密情報として扱ってください
- セッションは 1〜2 週間で期限切れ → Cookie の再取得が必要

## Limitations

- note.com に公式 API は存在しません（ブラウザ自動操作で動作）
- note.com の UI 変更により動作しなくなる可能性があります
- サムネイル画像の自動アップロードは今後対応予定
- 短時間での大量投稿はアカウント制限の原因になる可能性があります

## License

MIT

## Disclaimer

本ツールは個人利用を想定しています。note.com の利用規約を遵守してご利用ください。
