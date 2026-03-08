\# file: mission.yaml  
\# 目的: あなた(Claude Code)が「世界一レベルのシステム構築提案」を出すための、調査〜設計〜実装計画までの指示仕様

meta:  
  mission\_name: "Global Skill & MCP Intelligence System — Deep Research \+ Build Proposal"  
  language: "ja"  
  output\_language: "ja"  
  priority: "precision\_over\_speed"  
  context\_management:  
    \# Claude Code はコンテキストが大きくなると自動 compact を使う。手動 /compact も推奨。:contentReference\[oaicite:2\]{index=2}  
    auto\_compact\_expected: true  
    manual\_compact\_rules:  
      \- trigger: "各フェーズ終了時"  
        command: "/compact Focus on: key findings, decisions, artifacts created, next actions; drop raw logs"  
      \- trigger: "長いログ/大量URL/大量テキストを扱った直後"  
        command: "/compact Keep: dataset schema, keyword universe, source index, architecture decisions, open questions"  
      \- trigger: "2回目(深掘り)開始前"  
        command: "/compact Preserve: pass1 summary, gaps list, hypotheses, prioritized keywords"

inputs:  
  \# ここはあなた(Claude Code)が実際に確認する。リンク先にさらにURLがあれば漏れなく追跡する。  
  seed\_urls:  
    \- "https://skillsmp.com/ja"  
    \- "https://mcpmarket.com/ja"  
    \- "https://console.apify.com/store-search?category=OPEN\_SOURCE"  
    \- "https://www.reddit.com/"  
    \- "https://mcp.so/"  
    \- "https://smithery.ai/"  
    \- "https://rapidapi.com/"  
    \- "https://huggingface.co/"  
    \- "https://libraries.io/"  
    \- "https://github.com/public-apis/public-apis"  
    \- "https://composio.dev/"  
    \- "https://github.com/sindresorhus/awesome"  
  extension\_marketplaces\_top10\_urls:  
    \- "https://chromewebstore.google.com/"  
    \- "https://addons.mozilla.org/"  
    \- "https://wordpress.org/plugins/"  
    \- "https://marketplace.visualstudio.com/vscode"  
    \- "https://apps.shopify.com/"  
    \- "https://microsoftedge.microsoft.com/addons/"  
    \- "https://appexchange.salesforce.com/"  
    \- "https://marketplace.atlassian.com/"  
    \- "https://marketplace.zoom.us/"  
    \- "https://www.notion.com/integrations"

  \# ★必須: 対象リポジトリ（ユーザーが指定する）  
  \# 例: ローカルパス、Git URL、あるいは Claude Code に追加済みのプロジェクトディレクトリ  
  target\_repo:  
    url\_or\_path: "\<REPO\_URL\_OR\_PATH\_OR\_LOCAL\_DIR\>"  
    required\_actions:  
      \- "全ディレクトリ構造の把握（重要ファイルの特定）"  
      \- "既存機能/プラグイン/コマンド/設定の棚卸し"  
      \- "このリポジトリ前提で実現可能なシステム構築案へ落とし込み"

scope:  
  research\_domains:  
    \- "国内/海外/全世界（日本語・英語を軸に、多言語キーワードも必要に応じて展開）"  
    \- "公式ドキュメント/FAQ/ブログ/コミュニティ/ニュース/論文/ハッカソン"  
    \- "SNS: X, note, YouTube, Reddit, Hacker News, Facebook, Instagram, Threads など（公開情報に限定）"  
  emphasis:  
    \- "MCP（Model Context Protocol）サーバー/マーケット/運用"  
    \- "Claude/Claude Code/スキル（Skills）エコシステム"  
    \- "APIマーケットプレイス/拡張機能マーケット/OSSパッケージ"  
    \- "“システム構築”に必要な実装可能情報（API, 規約, 取得方法, データモデル, 監視, 運用）"

constraints:  
  compliance:  
    \- "各サイトの利用規約/robots.txt/レート制限を尊重"  
    \- "ペイウォール回避には踏み込まない"  
    \- "SNSは公開情報の範囲で、必要最小限を取得し、個人の特定情報は保存しない"  
  copyright:  
    \- "YouTube/note/X などの全文転載は避ける（要点抽出・引用は最小限、短く）"  
  evidence:  
    \- "重要主張には出典（URL/日時/発言元）を残す"  
    \- "推測と事実を明確に分離し、推測は根拠も記す"  
  execution:  
    \- "同じ調査を2回実施（2回目はギャップ補完・反証・見落とし潰しに集中）"  
    \- "“漏れがない”は工学的に難しいため、代替として「カバレッジ保証の方法（探索戦略・ログ・深さ）」を提示する"

methodology:  
  keyword\_mining:  
    \# ユーザー要望: “キーワードのskill”を使って関連/複合/急上昇/ニッチを抽出  
    steps:  
      \- "seed\_urlsのカテゴリ/タグ/検索クエリ候補を抽出"  
      \- "skillベースのタクソノミ（能力/入力/出力/依存/実行環境）にマッピング"  
      \- "関連: 同義語/上位下位/用途別"  
      \- "複合: 2〜4語フレーズ（例: 'MCP \+ RAG \+ workflow', 'Claude skill \+ marketplace \+ ranking')"  
      \- "急上昇: GitHub stars増加/投稿頻度/議論量/リリース頻度/検索トレンド代理指標"  
      \- "ニッチ: 高専門性・低競合・高価値（例: 特定業界向けMCP、監査/法務/医療など）"  
    outputs:  
      \- "keywords/keyword\_universe.csv（列: keyword, lang, type\[related|compound|rising|niche\], rationale, sources, metrics\_proxy）"  
      \- "keywords/taxonomy.yaml（能力分類ツリー）"

  deep\_research\_pass1:  
    steps:  
      \- "seed\_urlsを起点にサイト構造を把握し、リンクを収集（サイト内優先、深さ2〜3）"  
      \- "各サイトごとに: 取得できるメタデータ項目/検索UI/カテゴリ体系/API有無/規約/更新頻度 を表形式で整理"  
      \- "上位キーワード50〜200件を確定し、各キーワードで国内/海外検索（日本語+英語）"  
      \- "YouTube: 代表的/高シグナル動画を選定し、字幕/文字起こし（可能な範囲）→論点・需要・ペインを抽出"  
      \- "X/note/Reddit/HNなど: 代表スレ/代表投稿を抽出し、主張のクラスタリング（賛否/課題/ユースケース）"  
    artifacts:  
      \- "research/source\_index.md（収集ソース一覧・URL・要点・日付）"  
      \- "research/market\_maps.md（各マーケットの仕様比較表）"  
      \- "research/social\_signals.md（SNS論点クラスタ）"  
      \- "research/youtube\_insights.md（動画→論点/ユースケース/キーワード）"

  deep\_research\_pass2:  
    goal: "pass1 の穴埋め \+ 反証 \+ 見落とし確認 \+ 新規発見"  
    steps:  
      \- "pass1 の『未確定事項』『不明点』『矛盾』をリスト化"  
      \- "上位20〜40キーワードを再度深掘り（別ソース・別言語・別コミュニティ）"  
      \- "論文/技術ブログ/実装例/OSS を重点調査"  
      \- "新たな発見（差分）だけを抽出して追記"  
    artifacts:  
      \- "research/pass2\_deltas.md（pass1からの差分・追加発見）"  
      \- "research/gaps\_closed.md（ギャップ潰しの証跡）"

repo\_analysis:  
  steps:  
    \- "target\_repo を全体俯瞰（entrypoints, config, plugin拡張点, データ層, UI層, CI/CD）"  
    \- "“このリポジトリで実現できる最大の提案”を現実的制約付きで設計"  
    \- "実装に必要な追加モジュール/ディレクトリ/依存/運用（監視・テスト・セキュリティ）を具体化"

deliverables:  
  final\_report: "proposal/MASTER\_PROPOSAL.md"  
  must\_include\_sections:  
    \- "1. Executive Summary（狙い/価値/差別化）"  
    \- "2. 市場地図（Skills/MCP/API/拡張機能の全体像）"  
    \- "3. Keyword Universe（関連/複合/急上昇/ニッチの根拠付き）"  
    \- "4. データ取得戦略（API/スクレイピング/更新検知/規約順守）"  
    \- "5. 正規化データモデル（Skill/Tool/MCP/Extension/API Package の統一スキーマ）"  
    \- "6. トレンド検知アルゴリズム（代理指標/評価指標/ランキング）"  
    \- "7. システムアーキテクチャ（図 \+ コンポーネント責務）"  
    \- "8. 実装計画（MVP→拡張、リポジトリ変更案、タスク分解）"  
    \- "9. セキュリティ/法務/運用（監査ログ、PII、レート制限、SLA）"  
    \- "10. リスクと代替案（取得不能ソース時の設計）"  
    \- "11. 次にユーザーが判断できる意思決定ポイント（Go/No-Go項目）"  
  quality\_bar:  
    \- "主観でなく、収集データと根拠に基づいた提案"  
    \- "“作れる”粒度（API/DB/キュー/ジョブ/画面/権限）まで落とす"  
    \- "抽象論だけで終わらせず、具体的なリポジトリ変更案・ファイル案・データスキーマを提示"

run\_instructions\_for\_claude\_code:  
  \# Claude Code の system prompt は \--append-system-prompt 等で追加が推奨される。:contentReference\[oaicite:3\]{index=3}  
  recommended\_cli:  
    \- 'claude \--append-system-prompt "Follow mission.yaml. Produce artifacts in ./proposal and ./research. Use /compact at phase boundaries."'  
  note:  
    \- "サブエージェント分担は別途 agents.json を \--agents で渡す（下のJSONを使用）"

// file: agents.json  
// Claude Code の \--agents は JSON で subagents を定義できる :contentReference\[oaicite:4\]{index=4}  
{  
  "marketplace-scanner": {  
    "description": "Seed URLs を起点に、マーケット/ディレクトリの情報構造・取得方法・規約・更新頻度・主要カテゴリ/タグを棚卸しする。",  
    "prompt": "あなたはOSINTとプロダクトリサーチの専門家。seed\_urlsをサイト別に調査し、(1)カテゴリ体系 (2)検索/フィルタ (3)取得できるメタデータ (4)API有無 (5)利用規約/robots/レート制限 (6)更新頻度 (7)差別化点 を表形式でまとめる。出典URLと確認日を必ず残す。全文転載は禁止、要点のみ。成果物: research/market\_maps.md と research/source\_index.md を更新。",  
    "tools": \["Read", "Edit", "Bash", "Grep", "Glob"\],  
    "model": "sonnet"  
  },  
  "keyword-miner": {  
    "description": "Skillベースで関連/複合/急上昇/ニッチキーワードを抽出し、タクソノミと keyword\_universe を作る。",  
    "prompt": "あなたは情報検索(IR)とSEO/トレンド分析の専門家。marketplace-scannerが集めたカテゴリ/タグ/クエリ例と、追加検索から、(related|compound|rising|niche)に分類したキーワード宇宙を作る。risingは代理指標(投稿増/スター増/新リリース等)を添える。出典URL/日付を残す。成果物: keywords/keyword\_universe.csv と keywords/taxonomy.yaml。",  
    "tools": \["Read", "Edit", "Bash", "Grep", "Glob"\],  
    "model": "sonnet"  
  },  
  "social-signal-analyst": {  
    "description": "X/Reddit/HN/note/YouTube 等の公開情報から議論・需要・ペインをクラスタリングして抽出する。",  
    "prompt": "あなたはコミュニティ分析の専門家。キーワード上位群から、X/Reddit/Hacker News/note/YouTubeの公開情報を収集し、(1)ユースケース (2)課題/不満 (3)成功事例 (4)未解決ニーズ (5)用語の揺れ をクラスタリングしてまとめる。YouTubeは可能なら字幕/文字起こしを参照し、要点を抽出する（全文転載禁止、短い引用のみ）。成果物: research/social\_signals.md と research/youtube\_insights.md、source\_index.md を更新。",  
    "tools": \["Read", "Edit", "Bash", "Grep", "Glob"\],  
    "model": "sonnet"  
  },  
  "repo-auditor": {  
    "description": "target\_repo を読んで、拡張点/不足/実装可能範囲を特定し、提案をリポジトリ前提に落とし込む。",  
    "prompt": "あなたはシニアソフトウェアアーキテクト。target\_repoを全体把握し、(1)構成 (2)エントリポイント (3)設定/プラグイン/コマンド (4)データ層 (5)CI/CD (6)既存の制約 を棚卸し。新規に追加すべきモジュール/ディレクトリ/設定/テストを具体案として列挙し、proposalに反映できる形で整理する。成果物: proposal/repo\_findings.md を作成/更新。",  
    "tools": \["Read", "Edit", "Bash", "Grep", "Glob"\],  
    "model": "sonnet"  
  },  
  "system-architect": {  
    "description": "全成果を統合し、“作れる粒度”のシステム構築提案（MVP→拡張）を完成させる。",  
    "prompt": "あなたはPrincipal Architect。market\_maps、keyword\_universe、social\_signals、repo\_findingsを統合し、MASTER\_PROPOSAL.md を完成させる。必ず: データモデル、パイプライン、更新検知、ランキング/トレンド、検索UI、API、運用(監視/監査/PII/レート制限)まで落とす。抽象論禁止。必要ならMermaidでアーキ図を出す。成果物: proposal/MASTER\_PROPOSAL.md。",  
    "tools": \["Read", "Edit", "Bash", "Grep", "Glob"\],  
    "model": "opus"  
  },  
  "compliance-checker": {  
    "description": "規約・著作権・プライバシー・運用リスクをチェックし、取得手法の代替案を提示する。",  
    "prompt": "あなたはプロダクト法務/セキュリティ担当。提案のデータ取得・保存・配布が規約/著作権/プライバシー/PII観点で危険でないか確認し、危険箇所は具体的に修正案(代替ソース、API利用、サンプリング、メタデータのみ、キャッシュ期限など)を提示する。成果物: proposal/risk\_register.md と proposal/compliance\_notes.md。",  
    "tools": \["Read", "Edit", "Bash", "Grep", "Glob"\],  
    "model": "sonnet"  
  }  
}

あなたは「グローバル・スキル/MCP/拡張機能/APIマーケットの統合リサーチ」と「システム構築提案」の主任アーキテクトです。  
このディレクトリに mission.yaml と agents.json がある前提で進めてください。

1\) mission.yaml の手順どおりに、調査→キーワード抽出→Pass1→Pass2→repo分析→提案作成を実行。  
2\) 成果物は ./research, ./keywords, ./proposal 配下にファイルとして保存。  
3\) フェーズ境界で必ず /compact を実行し、重要事項だけを保持。  
4\) 重要な主張には出典URLと確認日を併記（全文転載は禁止、要点抽出）。  
5\) 最終成果物は proposal/MASTER\_PROPOSAL.md に統合し、ユーザーが判断できる意思決定ポイントを明確にする。

まずは:  
\- seed\_urls のサイトマップ/カテゴリ体系/取得可能メタデータ/規約/更新頻度 を research/market\_maps.md にまとめ、  
\- keyword\_universe の初版を keywords/keyword\_universe.csv に作り、  
\- 次に deep\_research\_pass1 に進んでください。  
