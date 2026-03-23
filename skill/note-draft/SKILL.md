---
name: note-draft
description: >
  テーマを渡すだけでnote.com下書きまで全自動完結。
  リサーチ→記事執筆→画像生成（可変枚数）→投稿をエージェント協調で実行する完全自動ワークフロー。
  24時間連続稼働・量産対応設計。
---

# Note記事作成スキル v2.0 — エージェント協調型完全自動ワークフロー

## 概要

```
テーマ入力
  → [Phase 1] リサーチ（researcher エージェント）
  → [Phase 2] 記事構造設計 + 画像計画（sub-planner + qa-lead）
  → [Phase 3] 記事執筆（sub-implementer）
  → [Phase 4] 画像生成（nanobanana2 × 可変枚数）
  → [Phase 5] 品質ゲート（qa-lead）
  → [Phase 6] 下書き投稿（publish-hybrid.js）
```

## 必須入力

| 項目 | 必須 | 例 |
|------|------|----|
| テーマ | ✅ | 「CursorでClaude Codeを使う方法」 |
| ターゲット読者 | ✅ | 「AIツール初心者・非エンジニア」 |
| ハッシュタグ（5個） | ✅ | ClaudeCode, Cursor, AI活用, etc. |
| マガジン名 | ❌ | 「AI活用術」（省略可） |

---

## Phase 1: リサーチ（researcher エージェント）

### 実行指示

```
researcher エージェントを run_in_background: true で起動し、以下を調査：
1. [テーマ] の公式URL・最新情報
2. 初心者がつまずくポイント（インストール手順・登録手順など）
3. 競合note記事の構成パターン
4. データ・統計・出典（信頼性の高いソース）
5. 関連する公式ドキュメントURL

出力: data/research_[slug].md に保存
結果は500文字以内で要約して返してください
```

### チェックポイント

- [ ] 公式URLが3個以上取得できた
- [ ] 初心者向けの前提知識（インストール先・登録手順）が含まれている
- [ ] データに出典がある

---

## Phase 2: 記事構造設計 + 画像計画

### 2-A: sub-planner エージェントで骨格設計

```
sub-planner エージェントで以下を設計（結果は500文字以内）：

テーマ: [テーマ]
リサーチ結果: [Phase 1 の要約]

設計内容:
1. H2 大見出し（3〜5個）とその配下のH3を一覧化
2. 各H2に対して「図解が必要か否か」を判定
3. 図解が必要な箇所に使うべきDIAGRAM_PATTERNS.mdのパターン番号を指定
4. サムネイルのコンセプトを1行で説明
5. 記事の総文字数目安（2000〜4000字）
```

### 2-B: 画像計画（ルール）

図解枚数は **記事の複雑さに応じて可変**（2〜5枚 + サムネイル1枚）。

```
図解が必要な判定基準（以下のいずれかに該当するH2/セクション）:
  ✅ インストール・セットアップ手順がある → フローチャート
  ✅ 2つ以上のツール/概念を比較する → 比較図 or マトリクス
  ✅ 複数ステップのワークフローがある → ステップ図
  ✅ 構成・アーキテクチャを説明している → 構成図
  ✅ まとめ・チェックリストがある → インフォグラフィック

図解が不要な判定:
  ❌ テキスト説明で十分な箇条書きリスト
  ❌ 短い定義・用語説明
  ❌ 参考リンクのみのセクション
```

**出力フォーマット（必須）:**

```yaml
images:
  - id: fig1
    section: "## [該当H2]"
    type: フローチャート  # 比較図/ステップ図/構成図/マトリクス/インフォグラフィック
    pattern: P002         # DIAGRAM_PATTERNS.md のパターン番号
    prompt_en: "..."      # 英語プロンプト（後工程でそのまま使用）
  - id: fig2
    ...
  - id: thumbnail
    type: サムネイル
    concept: "..."        # ユーザーの痛みポイントを英語で表現
```

### 2-C: qa-lead エージェントで要件チェック

```
qa-lead エージェントで骨格設計をレビュー（結果は300文字以内）:
  - 初心者向け必須情報の漏れをチェック
    ✅ ソフトウェアのDLリンク・手順
    ✅ アカウント登録手順
    ✅ 公式URLの掲載
  - 抜けがあれば追加H3として指摘
```

---

## Phase 3: 記事執筆（sub-implementer エージェント）

### 実行指示

```
sub-implementer エージェントで記事MDを執筆:
  - 保存先: output/articles/[YYYYMMDD_slug].md
  - 使用エージェントの出力: Phase 1 のリサーチ + Phase 2 の骨格
  - 結果は「完了: [ファイルパス]」の1行のみ返してください
```

### Frontmatter（必須）

```markdown
---
title: [タイトル]
tags:
  - [タグ1]
  - [タグ2]
  - [タグ3]
  - [タグ4]
  - [タグ5]
---
```

### 記事品質ルール（ARTICLE_CHECKLIST.md 参照）

**必須要素:**
- 冒頭フック: 個人体験・共感（「〜という声をよく聞く」等）で始める
- `## ` 大見出し: 3〜5個
- `### ` 小見出し: 各H2に2〜3個（Step 1/2/3 形式推奨）
- `` - `` 箇条書き: 機能リスト・要件・比較
- ` ``` ` コードブロック: コマンド・設定値（背景付き表示）
- `> ` 引用ブロック: **要件リスト・URLまとめ・重要ポイント**（グレー背景）
- 図解プレースホルダー: `![説明](images/[slug]_fig1.png)` を適切な位置に配置
- 個人体験・感情: 1箇所以上
- データ出典: 「〇〇によると」「〇〇公式より」

**禁止事項（AI臭除去）:**
- 体験談ゼロの一般論のみ
- 出典なしの統計・数値
- 「〜でしょう」「〜と思います」の多用
- 初心者向け前提情報の省略

---

## Phase 4: 画像生成（nanobanana2）

### 実行手順（必ず1枚ずつ順番に実行）

```bash
BASE="C:/Users/Tatsu/Desktop/ツール開発/Note投稿くん"
cd "$BASE/skill/nanobanana2"

# Phase 2 で計画した全図解を1枚ずつ生成
# （例: 計画が fig1, fig2, fig3 の場合は3回実行）

python scripts/run.py generate.py \
  --prompt "[Phase 2 で生成した prompt_en]" \
  --output "$BASE/output/articles/images/[slug]_[id].png" \
  --aspect landscape
# ↑ 次の1枚は前の生成完了を確認してから実行（レート制限対策）
```

### サムネイル品質ルール（THUMBNAIL_GUIDE.md 参照）

**訴求力の高いサムネイルの条件:**
1. ユーザーの痛みポイントを視覚化する（問題→解決の対比）
2. 高コントラスト（暗背景 × 明るいアクセントカラー）
3. 日本語テキストを使わない（英語のみ、または文字なし）
4. 中央1つの焦点（散漫にしない）
5. ビフォーアフター or 数字（3 Steps, 5 Tips等）で即座に価値が伝わる

**サムネイルプロンプトテンプレート:**

```
[問題を表すビジュアル] person [問題の状況 in English].
Split layout: left half dark red background showing the problem,
right half bright blue background showing the solution.
Center: bold white arrow pointing right.
Top banner text: "[記事の価値提案 in English]"
Clean modern flat design, high contrast, professional blog thumbnail, 16:9
```

**使えるサムネイルパターン:**

| パターン | 用途 | プロンプト要素 |
|---------|------|--------------|
| 問題→解決 | ハウツー・解説 | split layout, before/after, arrow |
| 数字強調 | まとめ・比較 | large number "5", bold typography, icon grid |
| ツール対決 | 比較記事 | two logos facing each other, VS text |
| スクリーン + 結果 | ツール紹介 | laptop screen, output result, glow effect |
| キャラクター+吹き出し | 初心者向け | friendly character, speech bubble, simple icons |

---

## Phase 5: 品質ゲート（qa-lead エージェント）

```
qa-lead エージェントで記事MDを最終チェック（結果は400文字以内）:
  1. ARTICLE_CHECKLIST の全項目を確認
  2. 初心者向け必須情報（DLリンク・登録URL）が揃っているか
  3. 図解プレースホルダーが記事内の適切な位置にあるか
  4. 引用ブロック（> ）が要件リスト・URLまとめに使われているか
  5. OK/NG を明確に返答 → NGの場合は修正箇所を指摘
```

NG の場合: sub-implementer で該当箇所を修正してから Phase 6 へ。

---

## Phase 6: 下書き投稿

```bash
cd "C:/Users/Tatsu/Desktop/ツール開発/Note投稿くん"

"/c/Program Files/nodejs/node.exe" scripts/publish-hybrid.js \
  "output/articles/[article].md" \
  "output/articles/images/[slug]_thumbnail.png" \
  "draft" \
  "output/articles" \
  "[マガジン名（省略時は空文字列 '' を渡す）]"
```

**エラー時のリトライ（新規ノートを作らない）:**

```bash
# 既存ノートIDを7番目の引数に渡す（URLの末尾ID）
"/c/Program Files/nodejs/node.exe" scripts/publish-hybrid.js \
  "output/articles/[article].md" \
  "output/articles/images/[slug]_thumbnail.png" \
  "draft" \
  "output/articles" \
  "" \
  "[既存ノートID]"
```

---

## Phase 7: 完了チェック

エディター（https://editor.note.com/）で確認:

- [ ] 大見出し・小見出しが正しく反映されている
- [ ] 箇条書きがリストブロックになっている
- [ ] コードブロックに灰色背景がついている
- [ ] 引用ブロックがグレー背景ボックスになっている
- [ ] 図解が適切な位置に挿入されている（上下の余白なし）
- [ ] サムネイルが設定されている
- [ ] ハッシュタグ5個が設定されている
- [ ] 公式URLリンクが全て機能している

---

## 量産モード（24時間連続稼働）

複数テーマをまとめて処理する場合:

```markdown
# テーマリスト（data/topics.md に保存）
1. CursorでClaude Codeを使う方法
2. ChatGPTとClaude の使い分け術
3. ...

# 実行
topics.md の各テーマに対して本スキルを順番に実行
→ 各記事の下書きを output/articles/ に蓄積
```

**量産時の注意:**
- 画像生成はレート制限あり（1枚ずつ、連続不可）
- nanobanana2 の API制限に引っかかった場合は5分待機して再実行
- 1記事あたりの処理時間目安: 10〜20分（画像枚数による）

---

## エラー対応リファレンス

| エラー | 原因 | 対処 |
|-------|------|------|
| AssistantsConfirmationModal が出た | note.com AIアシスタント確認ダイアログ | dismissModals で自動キャンセル済み |
| 図解挿入がSKIPされた | + ボタン到達失敗 | 既存ノートIDでリトライ |
| タグ設定されていない | 公開設定ページへの遷移失敗 | 再実行時に NOTE_ID を指定 |
| 画像生成でレート制限 | Gemini API連続呼び出し | 5分待機して1枚ずつ再実行 |
| nanobanana2 日本語文字化け | プロンプトに日本語含む | 英語のみに書き直す |
