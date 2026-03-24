# Note投稿くん — フォルダ構成

最終更新：2026-03-23

---

## プロジェクトルート

```
Note投稿くん/
│
├── CLAUDE.md              ← Claudeへの全体指示（コミット対象）
├── WORKFLOW.md            ← 記事作成の手順早見表
├── README.md              ← プロジェクト説明書
├── 要件定義書.md           ← 設計ドキュメント
├── .env                   ← APIキー類（gitignore対象）
├── .mcp.json              ← MCPサーバー設定
├── package.json           ← Node.js依存パッケージ
│
├── scripts/               ← 実行スクリプト
│   ├── publish-hybrid.js  ★ note.com自動投稿メイン
│   ├── login-note.js      ← ログイン・セッション管理
│   ├── note-api.js        ← note APIラッパー
│   └── debug/             ← デバッグ用スクリプト
│
├── skill/                 ← ツール本体（実行ファイル）
│   ├── nanobanana2/       ★ Gemini画像生成ツール
│   │   ├── scripts/generate.py  ← 画像生成スクリプト
│   │   └── scripts/run.py       ← venv管理ラッパー
│   ├── note-draft/        ← 記事作成ワークフロー定義
│   └── note投稿ナレッジ/  ← note攻略ナレッジ集
│
├── output/                ← 生成物置き場
│   └── articles/          ★ 作成した記事MD
│       └── images/        ★ 生成した画像ファイル
│
├── research/              ← リサーチ資料・メモ
├── docs/                  ← ドキュメント（このファイル等）
├── templates/             ← 記事テンプレート
└── test/                  ← テストファイル
```

---

## .claude/ フォルダ（Claude Code設定）

```
.claude/
│
├── CLAUDE.md              ← Claudeシステム設定（TAISUN v2）
├── settings.json          ← 権限・フック設定（コミット対象）
├── router-config.json     ← LLM自動切替設定
├── README.md              ← .claudeフォルダの説明
│
├── rules/                 ← 動作ルール集（役割別の指示）
│   ├── auto-model-switch.md   ← タスク複雑度でモデルを自動切替
│   ├── context-management.md  ← コンテキスト効率化ガイド
│   ├── url-learning-pipeline.md ← URL分析→スキル化パイプライン
│   └── memory.md              ← 長期ルール
│
├── skills/               （115個）← スキル定義（/コマンド呼び出し用）
│   ├── note-research/     ★ note.comリサーチ
│   ├── gem-research/      ★ 9層マーケティングリサーチ
│   ├── mega-research-plus/ ★ 8ソース統合リサーチ
│   ├── nanobanana-pro/    ← 画像生成スキル
│   ├── taiyo-style/ 他    ← コピーライティングスキル群
│   └── note-buzz-post.md  ← note記事作成ワークフロー定義
│
├── agents/               （96個）← サブエージェント定義
│   └── ait42-***.md       ← 各専門エージェント
│
├── commands/             （113個）← /スラッシュコマンド定義
│   ├── note-post.md       ← /note-post
│   ├── learn.md           ← /learn
│   └── ...
│
├── hooks/                （50個）← 自動実行フック（自動化の核）
│   ├── stop-activity-logger.js    ★ レスポンスごとに活動ログ記録
│   ├── model-auto-switch.js       ★ タスク複雑度でモデル切替
│   ├── auto-memory-saver.js       ← 重要情報を自動メモリ保存
│   ├── unified-guard.js           ← 危険コマンドブロック
│   └── ...
│
├── references/            ← 詳細リファレンス（CLAUDE.mdが参照）
│   ├── CLAUDE-L2.md       ← 詳細ルール集
│   └── CLAUDE-L3.md       ← 専門ワークフロー
│
├── reports/               ← 検証・監査レポート
├── temp/                  ← 一時ファイル（タスク契約・ピン等）
├── memory/                ← システムメモリ（自動生成）
└── agent-memory/          ← エージェント作業メモリ
```

---

## 主要ファイルの役割早見表

| ファイル | 役割 | 更新頻度 |
|---------|------|---------|
| `CLAUDE.md` | Claudeへの全体指示 | 設計変更時 |
| `.claude/settings.json` | フック・権限設定 | フック追加時 |
| `.claude/rules/auto-model-switch.md` | モデル自動切替ルール | 変更時 |
| `.claude/skills/note-buzz-post.md` | 記事作成ワークフロー | 改善時 |
| `scripts/publish-hybrid.js` | note.com自動投稿 | バグ修正時 |
| `skill/nanobanana2/scripts/generate.py` | 画像生成 | モデル変更時 |
| `output/articles/` | 生成済み記事 | 記事作成のたび |
| `WORKFLOW.md` | 手順早見表 | フロー変更時 |
| `docs/WORKFLOW_DETAIL.md` | フロー詳細説明 | フロー変更時 |

---

## gitignore 対象（コミットしないもの）

```
.env                        ← APIキー
data/                       ← ブラウザプロファイル等
.agent_usage_state.json
.claude/hooks/data/activity-log.jsonl
.claude/hooks/data/agent-guard-detail.json
**/__pycache__/
*.pyc
```
