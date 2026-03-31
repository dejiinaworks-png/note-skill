export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    const skill = url.searchParams.get('skill');

    if (!key) {
      return new Response(JSON.stringify({ valid: false, reason: 'no_key' }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const expiry = await env.KV.get(key);

    if (!expiry) {
      return new Response(JSON.stringify({ valid: false, reason: 'invalid_key' }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const today = new Date().toISOString().split('T')[0];
    if (today > expiry) {
      return new Response(JSON.stringify({ valid: false, reason: 'expired', expiry }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // スキル内容の取得
    if (skill === 'note-draft') {
      const instructions = "---\nname: note-draft\ndescription: >\n  テーマを渡すだけでnote.com下書きまで全自動完結。\n  リサーチ→記事執筆→画像生成（可変枚数）→投稿をエージェント協調で実行する完全自動ワークフロー。\n  24時間連続稼働・量産対応設計。\n---\n\n# Note記事作成スキル v2.0 — エージェント協調型完全自動ワークフロー\n\n## 概要\n\n```\nテーマ入力\n  → [Phase 1] リサーチ（researcher エージェント）\n  → [Phase 2] 記事構造設計 + 画像計画（sub-planner + qa-lead）\n  → [Phase 3] 記事執筆（sub-implementer）\n  → [Phase 4] 画像生成（nanobanana2 × 可変枚数）\n  → [Phase 5] 品質ゲート（qa-lead）\n  → [Phase 6] 下書き投稿（publish-hybrid.js）\n```\n\n## 必須入力\n\n| 項目 | 必須 | 例 |\n|------|------|----|\n| テーマ | ✅ | 「CursorでClaude Codeを使う方法」 |\n| ターゲット読者 | ✅ | 「AIツール初心者・非エンジニア」 |\n| ハッシュタグ（5個） | ✅ | ClaudeCode, Cursor, AI活用, etc. |\n| マガジン名 | ❌ | 「AI活用術」（省略可） |\n\n---\n\n## Phase 1: リサーチ（researcher エージェント）\n\n### 実行指示\n\n```\nresearcher エージェントを run_in_background: true で起動し、以下を調査：\n1. [テーマ] の公式URL・最新情報\n2. 初心者がつまずくポイント（インストール手順・登録手順など）\n3. 競合note記事の構成パターン\n4. データ・統計・出典（信頼性の高いソース）\n5. 関連する公式ドキュメントURL\n\n出力: data/research_[slug].md に保存\n結果は500文字以内で要約して返してください\n```\n\n### チェックポイント\n\n- [ ] 公式URLが3個以上取得できた\n- [ ] 初心者向けの前提知識（インストール先・登録手順）が含まれている\n- [ ] データに出典がある\n\n---\n\n## Phase 2: 記事構造設計 + 画像計画\n\n### 2-A: sub-planner エージェントで骨格設計\n\n```\nsub-planner エージェントで以下を設計（結果は500文字以内）：\n\nテーマ: [テーマ]\nリサーチ結果: [Phase 1 の要約]\n\n設計内容:\n1. H2 大見出し（3〜5個）とその配下のH3を一覧化\n2. 各H2に対して「図解が必要か否か」を判定\n3. 図解が必要な箇所に使うべきDIAGRAM_PATTERNS.mdのパターン番号を指定\n4. サムネイルのコンセプトを1行で説明\n5. 記事の総文字数目安（2000〜4000字）\n```\n\n### 2-B: 画像計画（ルール）\n\n図解枚数は **記事の複雑さに応じて可変**（2〜5枚 + サムネイル1枚）。\n\n```\n図解が必要な判定基準（以下のいずれかに該当するH2/セクション）:\n  ✅ インストール・セットアップ手順がある → フローチャート\n  ✅ 2つ以上のツール/概念を比較する → 比較図 or マトリクス\n  ✅ 複数ステップのワークフローがある → ステップ図\n  ✅ 構成・アーキテクチャを説明している → 構成図\n  ✅ まとめ・チェックリストがある → インフォグラフィック\n\n図解が不要な判定:\n  ❌ テキスト説明で十分な箇条書きリスト\n  ❌ 短い定義・用語説明\n  ❌ 参考リンクのみのセクション\n```\n\n**出力フォーマット（必須）:**\n\n```yaml\nimages:\n  - id: fig1\n    section: \"## [該当H2]\"\n    type: フローチャート  # 比較図/ステップ図/構成図/マトリクス/インフォグラフィック\n    pattern: P002         # DIAGRAM_PATTERNS.md のパターン番号\n    prompt_en: \"...\"      # 英語プロンプト（後工程でそのまま使用）\n  - id: fig2\n    ...\n  - id: thumbnail\n    type: サムネイル\n    concept: \"...\"        # ユーザーの痛みポイントを英語で表現\n```\n\n### 2-C: qa-lead エージェントで要件チェック\n\n```\nqa-lead エージェントで骨格設計をレビュー（結果は300文字以内）:\n  - 初心者向け必須情報の漏れをチェック\n    ✅ ソフトウェアのDLリンク・手順\n    ✅ アカウント登録手順\n    ✅ 公式URLの掲載\n  - 抜けがあれば追加H3として指摘\n```\n\n---\n\n## Phase 3: 記事執筆（sub-implementer エージェント）\n\n### 実行指示\n\n```\nsub-implementer エージェントで記事MDを執筆:\n  - 保存先: output/articles/[YYYYMMDD_slug].md\n  - 使用エージェントの出力: Phase 1 のリサーチ + Phase 2 の骨格\n  - 結果は「完了: [ファイルパス]」の1行のみ返してください\n```\n\n### Frontmatter（必須）\n\n```markdown\n---\ntitle: [タイトル]\ntags:\n  - [タグ1]\n  - [タグ2]\n  - [タグ3]\n  - [タグ4]\n  - [タグ5]\n---\n```\n\n### 記事品質ルール（ARTICLE_CHECKLIST.md 参照）\n\n**必須要素:**\n- 冒頭フック: 個人体験・共感（「〜という声をよく聞く」等）で始める\n- `## ` 大見出し: 3〜5個\n- `### ` 小見出し: 各H2に2〜3個（Step 1/2/3 形式推奨）\n- `` - `` 箇条書き: 機能リスト・要件・比較\n- ` ``` ` コードブロック: コマンド・設定値（背景付き表示）\n- `> ` 引用ブロック: **要件リスト・URLまとめ・重要ポイント**（グレー背景）\n- 図解プレースホルダー: `![説明](images/[slug]_fig1.png)` を適切な位置に配置\n- 個人体験・感情: 1箇所以上\n- データ出典: 「〇〇によると」「〇〇公式より」\n\n**禁止事項（AI臭除去）:**\n- 体験談ゼロの一般論のみ\n- 出典なしの統計・数値\n- 「〜でしょう」「〜と思います」の多用\n- 初心者向け前提情報の省略\n\n---\n\n## Phase 4: 画像生成（nanobanana2）\n\n### 実行手順（必ず1枚ずつ順番に実行）\n\n```bash\nBASE=\"C:/Users/Tatsu/Desktop/ツール開発/Note投稿くん\"\ncd \"$BASE/skill/nanobanana2\"\n\n# Phase 2 で計画した全図解を1枚ずつ生成\n# （例: 計画が fig1, fig2, fig3 の場合は3回実行）\n\npython scripts/run.py generate.py \\\n  --prompt \"[Phase 2 で生成した prompt_en]\" \\\n  --output \"$BASE/output/articles/images/[slug]_[id].png\" \\\n  --aspect landscape\n# ↑ 次の1枚は前の生成完了を確認してから実行（レート制限対策）\n```\n\n### サムネイル品質ルール（THUMBNAIL_GUIDE.md 参照）\n\n**訴求力の高いサムネイルの条件:**\n1. ユーザーの痛みポイントを視覚化する（問題→解決の対比）\n2. 高コントラスト（暗背景 × 明るいアクセントカラー）\n3. 日本語テキストを使わない（英語のみ、または文字なし）\n4. 中央1つの焦点（散漫にしない）\n5. ビフォーアフター or 数字（3 Steps, 5 Tips等）で即座に価値が伝わる\n\n**サムネイルプロンプトテンプレート:**\n\n```\n[問題を表すビジュアル] person [問題の状況 in English].\nSplit layout: left half dark red background showing the problem,\nright half bright blue background showing the solution.\nCenter: bold white arrow pointing right.\nTop banner text: \"[記事の価値提案 in English]\"\nClean modern flat design, high contrast, professional blog thumbnail, 16:9\n```\n\n**使えるサムネイルパターン:**\n\n| パターン | 用途 | プロンプト要素 |\n|---------|------|--------------|\n| 問題→解決 | ハウツー・解説 | split layout, before/after, arrow |\n| 数字強調 | まとめ・比較 | large number \"5\", bold typography, icon grid |\n| ツール対決 | 比較記事 | two logos facing each other, VS text |\n| スクリーン + 結果 | ツール紹介 | laptop screen, output result, glow effect |\n| キャラクター+吹き出し | 初心者向け | friendly character, speech bubble, simple icons |\n\n---\n\n## Phase 5: 品質ゲート（qa-lead エージェント）\n\n```\nqa-lead エージェントで記事MDを最終チェック（結果は400文字以内）:\n  1. ARTICLE_CHECKLIST の全項目を確認\n  2. 初心者向け必須情報（DLリンク・登録URL）が揃っているか\n  3. 図解プレースホルダーが記事内の適切な位置にあるか\n  4. 引用ブロック（> ）が要件リスト・URLまとめに使われているか\n  5. OK/NG を明確に返答 → NGの場合は修正箇所を指摘\n```\n\nNG の場合: sub-implementer で該当箇所を修正してから Phase 6 へ。\n\n---\n\n## Phase 6: 下書き投稿\n\n```bash\ncd \"C:/Users/Tatsu/Desktop/ツール開発/Note投稿くん\"\n\n\"/c/Program Files/nodejs/node.exe\" scripts/publish-hybrid.js \\\n  \"output/articles/[article].md\" \\\n  \"output/articles/images/[slug]_thumbnail.png\" \\\n  \"draft\" \\\n  \"output/articles\" \\\n  \"[マガジン名（省略時は空文字列 '' を渡す）]\"\n```\n\n**エラー時のリトライ（新規ノートを作らない）:**\n\n```bash\n# 既存ノートIDを7番目の引数に渡す（URLの末尾ID）\n\"/c/Program Files/nodejs/node.exe\" scripts/publish-hybrid.js \\\n  \"output/articles/[article].md\" \\\n  \"output/articles/images/[slug]_thumbnail.png\" \\\n  \"draft\" \\\n  \"output/articles\" \\\n  \"\" \\\n  \"[既存ノートID]\"\n```\n\n---\n\n## Phase 7: 完了チェック\n\nエディター（https://editor.note.com/）で確認:\n\n- [ ] 大見出し・小見出しが正しく反映されている\n- [ ] 箇条書きがリストブロックになっている\n- [ ] コードブロックに灰色背景がついている\n- [ ] 引用ブロックがグレー背景ボックスになっている\n- [ ] 図解が適切な位置に挿入されている（上下の余白なし）\n- [ ] サムネイルが設定されている\n- [ ] ハッシュタグ5個が設定されている\n- [ ] 公式URLリンクが全て機能している\n\n---\n\n## 量産モード（24時間連続稼働）\n\n複数テーマをまとめて処理する場合:\n\n```markdown\n# テーマリスト（data/topics.md に保存）\n1. CursorでClaude Codeを使う方法\n2. ChatGPTとClaude の使い分け術\n3. ...\n\n# 実行\ntopics.md の各テーマに対して本スキルを順番に実行\n→ 各記事の下書きを output/articles/ に蓄積\n```\n\n**量産時の注意:**\n- 画像生成はレート制限あり（1枚ずつ、連続不可）\n- nanobanana2 の API制限に引っかかった場合は5分待機して再実行\n- 1記事あたりの処理時間目安: 10〜20分（画像枚数による）\n\n---\n\n## エラー対応リファレンス\n\n| エラー | 原因 | 対処 |\n|-------|------|------|\n| AssistantsConfirmationModal が出た | note.com AIアシスタント確認ダイアログ | dismissModals で自動キャンセル済み |\n| 図解挿入がSKIPされた | + ボタン到達失敗 | 既存ノートIDでリトライ |\n| タグ設定されていない | 公開設定ページへの遷移失敗 | 再実行時に NOTE_ID を指定 |\n| 画像生成でレート制限 | Gemini API連続呼び出し | 5分待機して1枚ずつ再実行 |\n| nanobanana2 日本語文字化け | プロンプトに日本語含む | 英語のみに書き直す |\n";
      return new Response(JSON.stringify({ valid: true, expiry, instructions }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    return new Response(JSON.stringify({ valid: true, expiry }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
};