---
name: browser-use
description: Browser Use CLI 2.0 — LLMエージェントによるブラウザ自動化。CDP直接接続で2倍速・半額。note.com投稿・Web操作・スクレイピングをAIで自動実行。
argument-hint: "[タスク内容] [--url=URL] [--headless] [--model=claude-sonnet-4-6]"
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
model: sonnet
---

# browser-use — AIブラウザ自動化スキル

Browser Use CLI 2.0 を使い、自然言語でブラウザを操作するスキル。
Claude Code から直接ブラウザを制御し、note投稿・ログイン・フォーム送信などを自動化する。

```
┌──────────────────────────────────────────────────────────────┐
│                  BROWSER USE CLI 2.0                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Claude Code                                                 │
│      │                                                       │
│      ▼                                                       │
│  browser-use (Python)                                        │
│      │  CDP直接接続（v2.0の新機能）                          │
│      ▼                                                       │
│  Chromium / Chrome                                           │
│      │                                                       │
│      ▼                                                       │
│  Webサイト操作（note.com, Google等）                         │
│                                                              │
│  ✅ 2倍速 — CDP直接接続でオーバーヘッド削減                  │
│  ✅ 半額 — Vision不要タスクはテキストのみ処理                │
│  ✅ トークン効率2倍 — DOM抽出最適化                          │
└──────────────────────────────────────────────────────────────┘
```

---

## インストール / アップデート

```bash
# 初回インストール
pip install browser-use

# Playwright ブラウザのインストール（必須）
playwright install chromium

# バージョン確認
pip show browser-use

# アップデート（v2.0以降に更新）
pip install --upgrade browser-use
playwright install chromium  # ブラウザも必ず更新
```

### バージョン確認コマンド

```bash
# 現在のバージョン
pip show browser-use | grep Version

# 最新バージョン確認
pip index versions browser-use 2>/dev/null | head -1
```

---

## 基本的な使い方

### 1. Pythonスクリプトから実行（推奨）

```python
# browser_task.py
import asyncio
from browser_use import Agent
from langchain_anthropic import ChatAnthropic

async def main():
    agent = Agent(
        task="note.comにログインして、下書きの記事を公開する",
        llm=ChatAnthropic(model="claude-sonnet-4-6"),
    )
    result = await agent.run()
    print(result)

asyncio.run(main())
```

```bash
python browser_task.py
```

### 2. CDP直接接続モード（v2.0 — 2倍速）

```python
import asyncio
from browser_use import Agent, BrowserConfig
from browser_use.browser.browser import Browser
from langchain_anthropic import ChatAnthropic

async def main():
    # CDP直接接続でChrome起動
    browser = Browser(
        config=BrowserConfig(
            # 既存Chromeに接続（認証セッション引き継ぎ）
            cdp_url="http://localhost:9222",
        )
    )

    agent = Agent(
        task="タスク内容",
        llm=ChatAnthropic(model="claude-sonnet-4-6"),
        browser=browser,
    )
    result = await agent.run()
    await browser.close()

asyncio.run(main())
```

```bash
# 先にChromeをCDPモードで起動
"C:/Program Files/Google/Chrome/Application/chrome.exe" \
  --remote-debugging-port=9222 \
  --user-data-dir="C:/Users/Tatsu/AppData/Local/Google/Chrome/Profile_agent"
```

### 3. 既存ブラウザプロファイル使用（認証引き継ぎ）

```python
browser = Browser(
    config=BrowserConfig(
        # 既存プロファイルを使用（ログイン状態を引き継ぐ）
        user_data_dir="C:/Users/Tatsu/AppData/Local/Google/Chrome/Profile_agent",
        headless=False,  # 確認しながら実行
    )
)
```

---

## このプロジェクトでの使い方

### note.com 投稿自動化

```python
# note投稿タスクの例
agent = Agent(
    task="""
    note.comにアクセスして以下を実行:
    1. https://editor.note.com/notes/[note_id]/edit/ を開く
    2. 記事内容を確認する
    3. 「公開」ボタンをクリックする
    4. 公開設定を確認して「公開する」を実行
    """,
    llm=ChatAnthropic(model="claude-sonnet-4-6"),
)
```

### Webスクレイピング

```python
agent = Agent(
    task="https://note.com/explore にアクセスして、トレンド記事のタイトルと著者を10件取得してJSONで返して",
    llm=ChatAnthropic(model="claude-sonnet-4-6"),
)
```

---

## v2.0 新機能まとめ

| 機能 | v1.x | v2.0 |
|------|------|------|
| ブラウザ接続 | Playwright経由 | **CDP直接** |
| 速度 | 標準 | **2倍** |
| トークンコスト | 標準 | **50%削減** |
| スクリーンショット | 毎ステップ | 必要時のみ |
| DOM処理 | HTML全体 | **差分最適化** |
| 並列実行 | 非対応 | **対応** |

---

## 依存パッケージ

```bash
# browser-use本体
pip install browser-use

# Claude/Anthropic LLM
pip install langchain-anthropic

# 環境変数設定（.envファイル）
# ANTHROPIC_API_KEY=your_key_here
```

---

## トラブルシューティング

| 問題 | 解決策 |
|------|--------|
| `playwright install` 必要 | `playwright install chromium` を実行 |
| CDP接続失敗 | Chromeが`--remote-debugging-port=9222`で起動しているか確認 |
| 認証切れ | プロファイルパスを確認、または手動でログイン後に実行 |
| タイムアウト | `max_steps=50` などステップ上限を上げる |
| 要素が見つからない | `headless=False` でブラウザを可視化して確認 |

---

## セキュリティ注意

- `ANTHROPIC_API_KEY` は `.env` ファイルに保存（`.gitignore` 必須）
- CDPポート（9222）はローカルのみ（外部公開禁止）
- note.comの利用規約に従った範囲で使用すること

---

## 関連スキル

- `nanobanana-pro` — Gemini画像生成（ブラウザ自動化ベース）
- `note-post` — note.com投稿パイプライン

---

## アップデート方法

```bash
# 最新版に更新
pip install --upgrade browser-use

# Playwrightも更新（ブラウザのバイナリ更新）
playwright install chromium

# 変更内容の確認
pip show browser-use
# または
python -c "import browser_use; print(browser_use.__version__)"
```
