# nanobanana2 図解パターン集 — 実例ベース版

**モデル固定**: `gemini-3.1-flash-image-preview`
**調査元**: 実際のX投稿・note記事・公式ガイドから収集（2026年3月）

## 出典一覧

| ID | 出典 | URL |
|----|------|-----|
| SRC-A | SHIFT AI TIMES（図解9種） | https://shift-ai.co.jp/blog/46357/ |
| SRC-B | SHIFT AI TIMES（汎用10選） | https://shift-ai.co.jp/blog/39671/ |
| SRC-C | Zenn / Google公式テンプレート | https://zenn.dev/ml_bear/articles/b58004bf5a3e6c |
| SRC-D | nanobanana.io 公式プロンプトガイド | https://nanobanana.io/ja/prompt-guide |
| SRC-E | muku-group.jp（蒼図スタイル） | https://muku-group.jp/nano-banana-souzu/ |
| SRC-F | taskhub.jp プロンプト完全ガイド | https://taskhub.jp/useful/nanobanana-prompt/ |
| SRC-G | @midori_tatsuta（X） | https://x.com/midori_tatsuta |
| SRC-H | aiblewmymind.substack.com（58種） | https://aiblewmymind.substack.com/p/58-infographic-prompts-nano-banana-2 |
| SRC-I | momo-gpt.com（30選） | https://momo-gpt.com/column/nano-banana-pro-prompt/ |
| SRC-J | controlaltachieve.com（教育インフォグラフィック） | https://controlaltachieve.com/2024/ai-infographic-prompts/ |
| SRC-K | invideo.io（図解・インフォグラフィック10選） | https://invideo.io/blog/infographic-prompts/ |
| SRC-L | plusai.com（プレゼン・スライド系） | https://www.plusai.com/blog/ai-infographic-prompts |
| SRC-M | WEEL（weel.co.jp）AI画像生成実例集 | https://weel.co.jp/media/nano-banana/ |
| SRC-N | DeepDreamGenerator プロンプト事例 | https://deepdreamgenerator.com/blog/ai-art-prompts |

---

## カテゴリ1: 図解・インフォグラフィック系（SRC-A ベース）

SHIFT AIが公開した実際のプロンプト。note.com記事・ブログの図解に最適。

### P001: ベン図（横長・手描き風）
```
可愛い手描き風イラストのポップなベン図インフォグラフィックを1枚の横長画像で作成してください。画像比率は横1600px × 縦900px程度、SNSやブログヘッダーに最適な形。中央に2つの大きな円が重なるクラシックなベン図を配置してください。
```
出典: SRC-A | `--aspect landscape`

---

### P002: フローチャート（横長・フラットデザイン）
```
クリーンでプロフェッショナルなモダンフラットデザインのフローチャートインフォグラフィックを1枚の横長画像で作成してください。画像比率は横1600px × 縦900px程度、ブログやSNSに最適な形。全体レイアウト：左から右へ流れる明確なプロセス図。
```
出典: SRC-A | `--aspect landscape`

---

### P003: 2×2マトリクス（横長）
```
クリーンでプロフェッショナルなフラットデザインの2×2マトリクスインフォグラフィックを1枚の横長画像で作成してください。画像比率は横1600px × 縦900px程度、ブログ記事やSNS投稿に最適な形。中央に大きな2×2のマトリクス表を配置してください。
```
出典: SRC-A | `--aspect landscape`

---

### P004: 組織図（縦長）
```
クリーンでモダンなフラットデザインの組織図インフォグラフィックを1枚の縦長画像で作成してください。画像比率は横1000px × 縦1400px程度、プレゼン資料や会社案内、採用ページに最適な形。
```
出典: SRC-A | `--aspect portrait`

---

### P005: 縦長インフォグラフィック（カラフル手描き風）
```
ポップでカラフルな手描き風イラスト満載のインフォグラフィックを1枚の縦長画像で作成してください。画像比率は横1000px × 縦1800px程度、SNS投稿やブログ記事に最適な形。全体テーマ：生成AIの日常活用ガイド
```
出典: SRC-A | `--aspect portrait`

---

### P006: 対比構造（上下分割・線画）
```
スタイリッシュでシンプルな線画イラスト満載のインフォグラフィックを1枚の縦長画像で作成してください。全体レイアウトは上半分と下半分に分かれ、中央で統合される対比構造です。
```
出典: SRC-A | `--aspect portrait`

---

### P007: 黒板風図解（大学セミナー）
```
黒板に手書きしたような超詳細な図解を1枚の画像で作成してください。画面のほとんどを黒板が占め、大学セミナーの教室の黒板だけが正面に大きく写る構図にしてください。
```
出典: SRC-A | `--aspect landscape`

---

### P008: ホワイトボード風プロセス図
```
ホワイトボードにマーカーで手書きしたようなプロセス図を1枚の横長画像で作成してください。画像比率は横1600px × 縦900px程度、会議室のホワイトボードを正面から撮影したような構図にしてください。
```
出典: SRC-A | `--aspect landscape`

---

### P009: UI風マトリクス（デザイン性重視）
```
デザイン性の高い洗練されたUI風の2×2マトリクス図を1枚の横長画像で作成してください。画像比率は横1600px × 縦1000px程度、PowerPointやKeynoteのスライドにそのまま挿入できる高品質な仕上がり。
```
出典: SRC-A | `--aspect landscape`

---

## カテゴリ2: 写実・フォトリアル系（SRC-C / SRC-D ベース）

Google公式テンプレートとnanobanana.io公式ガイドからの実例。

### P010: 写実的シーン（Google公式テンプレート）
```
[撮影手法]による[被写体]のフォトリアリスティックな描写。[動作/表情]を見せるシーンで、[環境設定]の中に配置されています。[照明描写]によって[雰囲気]が演出されています。[カメラ/レンズ詳細]で撮影され、[主要な質感/ディテール]が強調されています。[アスペクト比]形式で出力すること。
```
出典: SRC-C | 変数を置き換えて使用

---

### P011: 写実・陶芸家（Google公式具体例）
```
自然光ポートレート撮影による高齢の日本人陶芸家のフォトリアリスティックな描写。新しく釉薬をかけた茶碗を両手で点検し穏やかに微笑むを見せるシーンで、木の作業台と棚がある素朴な工房の中に配置されています。西向きの窓から差すゴールデンアワーの柔らかな光が肌と陶器の質感を際立たせるによって静謐で熟練の技を感じさせる雰囲気が演出されています。85mm f/1.8のポートレートレンズ／浅い被写界深度／背景は大きなボケで撮影され、手指の質感と茶碗の縁の微細な反射が強調されています。4:5の縦構図形式で出力すること。
```
出典: SRC-C | `--aspect portrait`

---

### P012: 雨の東京・ネオン反射（写実）
```
雨上がりの東京の路地裏。濡れたアスファルトにネオンサインが反射している。85mmレンズ、絞りf/1.8で撮影した写実的な写真。背景は柔らかくぼけている。
```
出典: SRC-F | `--aspect landscape`

---

### P013: 雨の都会の女性（nanobanana.io公式）
```
雨の降る都会の通りに立つ、薄手のトレンチコートを着た女性。濡れた路面の反射、遠くで柔らかくぼやけたネオンサイン。リアルな写真、35mmレンズ、ミディアムショット、浅い被写界深度、夜、寒色系のカラーパレット、詳細な肌の質感、きれいなフレーム。テキストなし、透かしなし、余分な人物なし。
```
出典: SRC-D | `--aspect portrait`

---

### P014: シネマティック風景（山小屋）
```
雪山の麓にある木造のキャビン。前景には湯気の立つコーヒーカップ、背景にはぼやけた松の木と朝霧。シネマティックな外観、明確な焦点を持つワイドな構図、黄金色の日の出の逆光、空気遠近法、わずかなフィルムグレイン。穏やかな雰囲気。彩度は高すぎない。漫画ではない。
```
出典: SRC-D | `--aspect wide`

---

### P015: 英語プロンプト・写実ポートレート
```
A photorealistic close-up portrait of an elderly Japanese ceramicist with deep, sun-etched wrinkles and a warm, knowing smile. He is carefully inspecting a freshly glazed tea bowl. The setting is his rustic, sun-drenched workshop. The scene is illuminated by soft, golden hour light streaming through a window, highlighting the fine texture of the clay. Captured with an 85mm portrait lens, resulting in a soft, blurred background (bokeh). The overall mood is serene and masterful. Vertical portrait orientation.
```
出典: SRC-C | `--aspect portrait`

---

## カテゴリ3: イラスト・キャラクター系（SRC-C / SRC-D / SRC-F ベース）

### P016: ステッカー（Google公式テンプレート）
```
[スタイル]調の[被写体]ステッカー。[主要な特徴]を備え、[カラーパレット]を採用。[線画スタイル]と[陰影スタイル]を採用。背景は必ず白色にしてください。
```
出典: SRC-C | `--aspect square`

---

### P017: レッサーパンダステッカー（Google公式具体例）
```
かわいいデフォルメ調のレッサーパンダステッカー。小さな竹笠／ふわふわの太い尾／丸い頬を備え、緑（竹）・オレンジ（毛並み）・クリーム（ハイライト）中心の鮮やかな配色を採用。太めでクリーンなアウトラインとシンプルなセルシェーディングを採用。背景は必ず白色にしてください。
```
出典: SRC-C | `--aspect square`

---

### P018: フラットイラスト（猫・水槽）
```
水泳用ゴーグルをつけたオレンジ色の猫が、泡と小魚の入った透明な水槽の横で片足を上げている。きれいな日本のフラットイラスト、新鮮なカラーパレット、一貫した線の太さ、十分な余白（ネガティブスペース）、中央配置の構図、高いコントラストだがきつくない。写実的ではない。テキストなし。
```
出典: SRC-D | `--aspect square`

---

### P019: 1990年代アニメ風イラスト
```
1990年代の日本のアニメセル画スタイル。紫色の髪で大きな緑色の目を持つ魔法少女のキャラクター。
```
出典: SRC-F | `--aspect portrait`

---

### P020: LINEスタンプセット（4種）
```
『ありがとう』『OK』『泣』『怒』の4つの感情を表す、白いうさぎのキャラクターのLINEスタンプセットを生成。シンプルでかわいいデフォルメスタイルで。
```
出典: SRC-F | `--aspect square`

---

## カテゴリ4: テキスト入り画像・ロゴ系（SRC-C / SRC-F ベース）

### P021: テキスト入り画像（Google公式テンプレート）
```
[画像タイプ]を作成し、[ブランド/コンセプト]向けに「[表示テキスト]」を[フォントスタイル]で配置。[デザインスタイル]を採用し、[カラースキーム]を設定してください。
```
出典: SRC-C

---

### P022: コーヒーショップロゴ
```
『Ocean Breeze Coffee』というテキストが入ったコーヒーショップのロゴ。モダンでミニマルなデザイン。
```
出典: SRC-F | `--aspect square`

---

### P023: コミックパネル（Google公式テンプレート）
```
[アートスタイル]スタイルによる単一のコミックブックパネル。前景には[キャラクター説明とアクション]が配置されています。背景には[設定詳細]が描かれています。パネルには[セリフ/キャプションボックス]が設けられ、テキストは「[テキスト]」と表示されています。照明は[ムード]な雰囲気を作り出しています。[アスペクト比]。
```
出典: SRC-C

---

### P024: 4コマ漫画
```
4コマ漫画を生成してください。1コマ目：少年が道でバナナの皮を見つける。2コマ目：少年がバナナの皮を踏んで滑る。3コマ目：少年が驚いた顔でソファに座っている老人の前に転んだ。4コマ目：老人と少年が共に笑っているシーン。
```
出典: SRC-F | `--aspect portrait`

---

## カテゴリ5: 建築図面・テクニカルアート系（SRC-E ベース）

muku-group.jpが公開した「蒼図（SOUZU）スタイル」の完全プロンプト。

### P025: 蒼図スタイル（建築図面風・完全版）
```
■全体デザイン設定
・トーン: 理知的、構造的、プロフェッショナル、深淵な思考
・ビジュアル・アイデンティティ:
  - 背景色: #003366 (ダークネイビー・シアノタイプ・トーン)。時間の経過を感じさせる微細な紙の質感を付与。
  - 文字・線画色: #F0F0F0 (オフホワイト)。インクのわずかなにじみを感じさせる質感。
  - アクセント: #4682B4 (スチールブルー)による補助線。
・画像スタイル: テクニカル・ドラフティング・アート。精密な製図技法を用いた情報の可視化。
・構成: 中央にメインとなるアイソメトリックな構造体。その周囲を囲む補助的な断面図と、厳格なグリッドに基づく寸法線の配置。

■画像に含める具体的なテキスト内容
・メインタイトル: 知的創造の設計図
・セクションA: 基盤構築（FOUNDATION）
・セクションB: 論理の骨組み（STRUCTURE）
・セクションC: 価値の最大化（OPTIMIZE）
・注釈: 「すべてのアイデアは正確な設計から始まる」「整合性チェック済み」
・図面番号: No. 2024-ORIGIN

■レイアウトと構成の指示
・特徴: 0.2mmの製図ペンによる極細の線画。幾何学的な円、四角、三角が調和して配置されている。
・イメージャリ: 平面図と透視図を組み合わせたハイブリッドな図解。矢印は定規で引かれたような直線的なデザイン。
・タイポグラフィ: 製図用レタリングを模した、読みやすく整然とした日本語フォント。

■画像サイズ: 横幅720px、縦幅460px（固定）
```
出典: SRC-E | `--aspect landscape`

---

## カテゴリ6: 編集・加工系（SRC-D ベース）

### P026: 背景変更（人物そのまま）
```
人物の顔の特徴、髪型、ポーズ、服装は変更せず、元の構図と光の方向を維持する。背景を夕暮れの海辺の遊歩道に置き換える。暖かい夕日の色調、わずかな逆光、遠くの海面の柔らかい反射。表情は変えない。テキストや透かしなし。
```
出典: SRC-D

---

### P027: フィギュア化（SHIFT AI公式）
```
[アップロードした画像] を、リアルなプラスチック製フィギュアにしてください。フィギュアは白い台座の上に立たせて、背景は無地のスタジオグレーに設定してください。照明は柔らかいボックスライトでお願いします。
```
出典: SRC-B | `--aspect square`

---

### P028: キャラクター一貫性（シーン変更）
```
[アップロードした画像] の特徴を維持したまま、今度は「カフェでコーヒーを飲んでいる」シーンを生成してください。
```
出典: SRC-B

---

## カテゴリ7: サムネイル・アイキャッチ系

note.com記事のサムネイル・アイキャッチに特化したパターン。実際のX投稿事例ベース。

### P029: テックブログサムネイル（ダーク系）
```
dark navy blue background, large bold Japanese title text in center, small glowing tech icon in upper left, clean professional blog thumbnail, 16:9 format, subtle grid pattern, cyan accent color
```
出典: X投稿事例ベース | `--aspect landscape`

---

### P030: ビジネス記事サムネイル（ホワイト系）
```
clean white background with bold geometric shapes in corner, large Japanese headline text dark color, minimal professional design, 16:9 format, modern typography, single accent color stripe
```
出典: X投稿事例ベース | `--aspect landscape`

---

### P031: AI活用記事サムネイル
```
gradient background from deep purple to blue, robot or AI brain icon prominently displayed center, Japanese title text with subtle glow, futuristic tech aesthetic, 16:9 blog thumbnail format
```
出典: X投稿事例ベース | `--aspect landscape`

---

## カテゴリ8: @midori_tatsuta 紹介アングル系（SRC-G ベース）

@midori_tatsutaが「保存版」として公開したアングル指定プロンプト集。

### P032: 正面アングル
```
front-facing portrait, subject looking directly at camera, symmetrical composition, neutral background, studio lighting, sharp focus on face
```
出典: SRC-G（@midori_tatsuta アングル指定プロンプト集）

---

### P033: 斜め45度アングル
```
three-quarter angle view, subject facing 45 degrees from camera, dynamic composition, soft side lighting, professional portrait style
```
出典: SRC-G

---

### P034: クローズアップ表情
```
extreme close-up facial portrait, fill frame with face, emphasis on eye expression and skin texture, shallow depth of field, soft natural lighting
```
出典: SRC-G

---

### P035: ダイナミックアングル
```
dynamic low angle shot looking up at subject, dramatic perspective, wide angle lens effect, powerful and imposing composition, cinematic lighting
```
出典: SRC-G

---

### P036: ワイドショット（全身）
```
full body wide shot, subject standing in environment, establishing shot style, environmental context visible, natural proportions, clear silhouette
```
出典: SRC-G

---

### P037: 複数アングル同時生成
```
four-panel image showing same character from different angles: front view, side profile, three-quarter view, and back view. Character sheet style, consistent lighting across all panels, white background
```
出典: SRC-G | `--aspect square`

---

## カテゴリ9: テクニック応用系

X投稿や各種ガイドで紹介されているテクニックを活用したパターン。

### P038: 画質向上（Upscale to 4K）
プロンプトの末尾に追加するだけで画質が上がる：
```
（通常プロンプト）, Upscale to 4K, ultra high resolution, maximum detail
```
出典: SRC-G（X投稿より） | どのプロンプトにも追加可能

---

### P039: シーン描写型（キーワード羅列より効果的）
```
（NG）猫、カフェ、窓際、昼

（OK）午後の柔らかい日差しが差し込む静かなカフェの窓際で、一匹の茶トラ猫が気持ちよさそうに丸まっている。外では人々が行き交い、窓ガラスに木漏れ日のパターンが映っている。
```
出典: SRC-G テクニック集

---

### P040: カラーコード指定（統一感を出す）
```
（背景カラー例を含む書き方）
Background color: #1a1a2e (deep navy), text color: #ffffff (white), accent color: #e94560 (coral red). Apply these exact hex codes consistently throughout the image.
```
出典: SRC-E応用 | ブランドカラー統一に使用

---

### P041: 日本語テキスト指定（明示的に）
```
Include Japanese text reading "（ここに日本語テキスト）" in the image. Use clean, modern Japanese font. All text must be in Japanese. Keep text within 10 characters per line.
```
出典: SRC-G テクニック集

---

### P042: アスペクト比とサイズ明示
```
（SNS縦型）: image ratio 9:16, 1080px × 1920px, vertical format optimized for Instagram Stories and TikTok
（ブログ横型）: image ratio 16:9, 1600px × 900px, horizontal format for blog headers and YouTube thumbnails
（正方形）: image ratio 1:1, 1080px × 1080px, square format for Instagram feed posts
```
出典: 複数SRC共通テクニック

---

## カテゴリ10: note記事実例集（各種ジャンル）

X・noteで実際にバズった図解スタイルのプロンプト再現。

### P043: 生産性・習慣化フロー図
```
クリーンでプロフェッショナルなモダンフラットデザインのフローチャートインフォグラフィックを1枚の横長画像で作成してください。画像比率は横1600px × 縦900px程度。全体テーマ：習慣を定着させる5ステップ。左から右へ流れる明確なプロセス図。各ステップに日本語ラベルとアイコン付き。
```
出典: SRC-A応用 | `--aspect landscape`

---

### P044: AI副業解説インフォグラフィック
```
ポップでカラフルな手描き風イラスト満載のインフォグラフィックを1枚の縦長画像で作成してください。画像比率は横1000px × 縦1800px程度。全体テーマ：AIを使って副業で稼ぐ7つの方法。各項目に番号・アイコン・日本語説明付き。明るく前向きな配色。
```
出典: SRC-A応用 | `--aspect portrait`

---

### P045: 比較図（ツール比較）
```
クリーンでプロフェッショナルなフラットデザインの比較表インフォグラフィックを1枚の横長画像で作成してください。画像比率は横1600px × 縦900px程度。左側に「従来の方法」、右側に「新しい方法」を配置。中央に対比を示す矢印。各側に日本語の箇条書き3〜5項目。
```
出典: SRC-A応用 | `--aspect landscape`

---

### P046: ピラミッド型優先度図
```
デザイン性の高い洗練されたUI風のピラミッド図を1枚の横長画像で作成してください。画像比率は横1600px × 縦1000px程度。3層構造で上から「最重要」「重要」「参考」とラベル付き。日本語テキスト使用。グラデーションカラー（上：ゴールド、中：シルバー、下：ブロンズ）。
```
出典: SRC-A応用 | `--aspect landscape`

---

### P047: 時系列タイムライン
```
クリーンでモダンなフラットデザインの横型タイムライン図を1枚の横長画像で作成してください。画像比率は横1600px × 縦900px程度。左から右に時系列で5つのマイルストーンを表示。各マイルストーンに日本語タイトル・年月・アイコン付き。テーマカラー：青系グラデーション。
```
出典: SRC-A応用 | `--aspect landscape`

---

### P048: 概念対比（Before/After）
```
スタイリッシュでシンプルな線画イラスト満載のインフォグラフィックを1枚の横長画像で作成してください。全体レイアウトは左半分「Before（課題）」と右半分「After（解決）」に分かれた対比構造。中央に変化を示す矢印。各側に日本語の特徴3点。背景は白。
```
出典: SRC-A応用 | `--aspect landscape`

---

### P049: マインドマップ風放射図
```
可愛い手描き風イラストのポップな放射型マインドマップインフォグラフィックを1枚の正方形画像で作成してください。中央に主要テーマ、そこから6つのサブテーマが放射状に広がる。各ブランチに日本語テキストとアイコン付き。画像比率は1:1、鮮やかなカラー配色。
```
出典: SRC-A応用 | `--aspect square`

---

### P050: SWOT分析図
```
クリーンでプロフェッショナルなフラットデザインのSWOT分析インフォグラフィックを1枚の横長画像で作成してください。画像比率は横1600px × 縦900px程度。4象限：左上「強み（S）」青、右上「弱み（W）」赤、左下「機会（O）」緑、右下「脅威（T）」オレンジ。各象限に日本語箇条書き。
```
出典: SRC-A応用 | `--aspect landscape`

---

## カテゴリ11: 教育インフォグラフィック系（SRC-J ベース）

controlaltachieve.comが公開した教育現場向けAI生成インフォグラフィックプロンプト集。
実際に学校教育で使われているテーマを基に構成。

### P051: カエルの一生（生物教育）
```
An educational infographic showing the life cycle of a frog. Four stages arranged in a circular diagram with arrows: egg mass in pond water, tadpole with tail, froglet with developing legs, adult frog. Each stage labeled in Japanese with brief description. Clean flat illustration style, light blue and green color palette, white background, suitable for elementary school science class.
```
出典: SRC-J | `--aspect landscape`

---

### P052: 英雄の旅（Hero's Journey）文学教育
```
An educational infographic illustrating the Hero's Journey narrative structure. Circular path with 12 stages starting from "日常世界" (Ordinary World) and returning. Each stage shown as icon + Japanese label. Dark blue outer ring with gold waypoint markers. Center shows hero icon. Clean diagram style for literature class, white background.
```
出典: SRC-J | `--aspect square`

---

### P053: 水の循環図（地理・理科）
```
An educational diagram of the water cycle (水の循環). Shows evaporation from ocean, cloud formation, precipitation as rain and snow, surface runoff, groundwater seepage, and return to ocean. Arrows indicate direction of flow. Japanese labels for each process. Light blue sky background with earth cross-section at bottom. Suitable for middle school geography.
```
出典: SRC-J | `--aspect landscape`

---

### P054: 植物の光合成（理科）
```
An educational infographic explaining photosynthesis (光合成). Central image of a green leaf with cutaway view. Inputs shown on left: sunlight (太陽光) and water (水). Output shown on right: oxygen (酸素) and glucose (グルコース). CO2 arrows entering leaf from air. Chemical equation displayed at bottom: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂. Japanese labels throughout, clean scientific illustration style.
```
出典: SRC-J | `--aspect landscape`

---

### P055: 食物連鎖ピラミッド（生態系教育）
```
An educational food web pyramid infographic (食物連鎖). Pyramid with 4 tiers: producers (植物) at base, primary consumers (草食動物), secondary consumers (肉食動物), apex predators (頂点捕食者) at top. Representative animal/plant icons at each level. Energy percentage shown decreasing upward (100%→10%→1%→0.1%). Japanese labels, clean infographic style, green-to-orange gradient.
```
出典: SRC-J | `--aspect portrait`

---

### P056: 太陽系の惑星（宇宙教育）
```
An educational infographic of the solar system (太陽系). Horizontal layout with sun on far left, then Mercury, Venus, Earth, Mars, asteroid belt, Jupiter, Saturn (with rings), Uranus, Neptune in order. Size proportional representation. Japanese planet names below each. Brief facts (distance from sun, number of moons) in small text. Dark space background with stars. Scientific illustration style.
```
出典: SRC-J | `--aspect wide`

---

### P057: オレゴントレイル歴史マップ
```
An educational historical infographic about the Oregon Trail (オレゴントレイル). Illustrated map showing the trail route from Missouri to Oregon, with key landmarks: Independence Rock, Fort Laramie, South Pass, Fort Hall, Oregon City. Timeline along bottom showing key years 1840s-1860s. Pioneer wagon icon as journey marker. Sepia/aged paper color scheme with hand-drawn map aesthetic. Japanese annotations.
```
出典: SRC-J | `--aspect landscape`

---

### P058: 三権分立図（公民教育）
```
An educational civics infographic showing the three branches of government (三権分立). Triangle or three-pillar layout: 立法（国会）左, 行政（内閣）中央, 司法（裁判所）右. Bidirectional arrows showing checks and balances between each branch. Icons representing each branch: parliament building, government office, court scales. Clean flat design, Japanese text, blue/red/gray color scheme.
```
出典: SRC-J | `--aspect landscape`

---

### P059: 細胞の構造図（生物）
```
An educational diagram of an animal cell (動物細胞). Detailed cross-section view showing organelles: nucleus (核), mitochondria (ミトコンドリア), endoplasmic reticulum (小胞体), Golgi apparatus (ゴルジ体), ribosomes (リボソーム), cell membrane (細胞膜), lysosomes (リソソーム). Each organelle clearly labeled in Japanese with color-coded identification. Scientific illustration style, white background.
```
出典: SRC-J | `--aspect square`

---

### P060: 江戸時代の身分制度
```
An educational history infographic showing the Edo period social hierarchy (江戸時代の身分制度). Pyramid structure: 将軍 at top, 大名・旗本 second tier, 武士 third tier, 農・工・商 lower section, 穢多・非人 at base. Each tier shows approximate population percentage. Traditional Japanese art style elements, warm earth tones, hand-drawn aesthetic, Japanese text throughout.
```
出典: SRC-J | `--aspect portrait`

---

## カテゴリ12: ビジュアルストーリー系（SRC-K ベース）

invideo.ioが公開したインフォグラフィック・図解プロンプト実例。ビジネス・ブランド系に強み。

### P061: 建築物アーキテクチャ図
```
A detailed architectural diagram infographic of a modern skyscraper. Cross-section cutaway view showing different floor functions: lobby, offices, conference center, rooftop garden. Exterior elevation on left, cross-section on right. Blueprint-style technical drawing with dimension lines and labels. Japanese annotations for each section. Dark navy background, white lines and text, accent in cyan.
```
出典: SRC-K | `--aspect landscape`

---

### P062: ブランドタイムライン（創業から現在）
```
A brand history timeline infographic. Horizontal timeline from founding year to present, with 6-8 key milestones shown as icon+year+description cards. Company logo evolution shown above timeline. Color scheme evolves from sepia (early years) to full brand colors (present). Clean corporate design, Japanese text for milestone descriptions. 16:9 landscape format.
```
出典: SRC-K | `--aspect landscape`

---

### P063: F1レーシングカー進化史
```
An infographic showing the evolution of Formula 1 race cars from 1950 to 2024. Six iconic cars shown in chronological order: 1950s (simple open-wheel), 1970s (wing aerodynamics), 1990s (high-tech composite), 2010s (hybrid power unit), 2022 (ground effect). Each car silhouette labeled with year and key technical innovation in Japanese. Dark background, dramatic lighting, racing red accent color.
```
出典: SRC-K | `--aspect wide`

---

### P064: 不動産物件比較インフォグラフィック
```
A real estate comparison infographic. Three property options shown in column layout: 1LDK, 2LDK, 3LDK. Each column shows: floor plan silhouette, monthly rent, square footage, key features (icons), pros/cons. Color-coded: green for best value, yellow for mid-range, red for premium. Japanese text throughout, clean modern design suitable for property listing.
```
出典: SRC-K | `--aspect portrait`

---

### P065: マーケティングファネル図
```
A marketing funnel infographic (マーケティングファネル). Top-to-bottom funnel shape with 5 stages: 認知 (Awareness) → 興味 (Interest) → 検討 (Consideration) → 購買意向 (Intent) → 購入 (Purchase). Each stage shows: percentage of remaining audience, key marketing actions, recommended channels. Gradient color from light blue (top) to dark blue (bottom). Japanese text, clean B2B style.
```
出典: SRC-K | `--aspect portrait`

---

### P066: 医療・健康インフォグラフィック
```
A health and wellness infographic about the human immune system (免疫システム). Body silhouette in center with callout arrows to key immune organs: bone marrow (骨髄), thymus (胸腺), spleen (脾臓), lymph nodes (リンパ節). Enlarged illustrations of white blood cells (白血球) and antibodies (抗体). Japanese labels, clean medical illustration style, light background, blue/white/orange color scheme.
```
出典: SRC-K | `--aspect portrait`

---

### P067: データビジュアライゼーション（棒グラフ+説明）
```
A data visualization infographic combining bar chart with explanatory callouts. Main chart: horizontal bar graph showing top 10 AI tools by adoption rate (2024). Each bar color-coded by category (LLM, image, code, video). Callout boxes highlight key insights. Japanese axis labels and category names. Clean modern dashboard style, white background with subtle grid.
```
出典: SRC-K | `--aspect landscape`

---

### P068: サプライチェーン図
```
A supply chain infographic showing product journey from raw materials to consumer. Left-to-right flow: Raw Materials (原材料) → Manufacturing (製造) → Distribution (物流) → Retail (小売) → Consumer (消費者). Each stage shows an icon and key metrics (time, cost, stakeholders). Arrows show forward flow, dotted arrows show reverse logistics. Japanese text, industrial design aesthetic, gray/blue/orange palette.
```
出典: SRC-K | `--aspect landscape`

---

### P069: 歴史年表・縦型
```
A vertical historical timeline infographic. Events from top (oldest) to bottom (most recent). Each event shown as: year on left, icon in center circle, description text on right (alternating). Thin vertical line connects all events. Milestone events highlighted with larger circles. Topic: 日本のAI開発史 1950-2024. Japanese text, clean modern design, blue timeline with accent colors for major events.
```
出典: SRC-K | `--aspect portrait`

---

### P070: 競合比較マトリクス（機能比較表）
```
A competitive comparison matrix infographic. Rows = features (機能), Columns = competitor products (A社, B社, C社, 自社). Cells show: green checkmark (対応), red X (非対応), yellow star (部分対応). Header row uses company logos/colors. "推奨" badge on best column. Japanese feature names in left column. Clean SaaS-style comparison table design, white background.
```
出典: SRC-K | `--aspect landscape`

---

## カテゴリ13: プレゼン・スライド系（SRC-L ベース）

plusai.comが公開したAIプレゼンテーション・スライド向けプロンプト集。コンサル・ビジネス系。

### P071: McKinseyスタイル・コンサルスライド
```
A McKinsey-style consulting presentation slide. Clean white background with dark navy header bar. Main content area shows a 2x2 strategic matrix with company positioning dots. Bottom section has 3 key takeaways in bullet points. Data labels in small sans-serif font. Right margin shows supporting bar chart. Japanese text for all labels and takeaways. Professional B2B consulting aesthetic, minimal decoration.
```
出典: SRC-L | `--aspect landscape`

---

### P072: GLP-1薬のメカニズム図（医療スライド）
```
An educational medical slide explaining the mechanism of GLP-1 receptor agonists (GLP-1受容体作動薬). Human body outline in center. Arrows show: GLP-1 released from intestine → pancreas (increases insulin, decreases glucagon) → brain (reduces appetite) → stomach (slows emptying) → liver (reduces glucose output). Japanese labels for each pathway. Clean medical illustration style, blue/green accent colors, white background.
```
出典: SRC-L | `--aspect landscape`

---

### P073: Saul Bassスタイル・映画ポスター
```
A minimalist graphic design in the style of Saul Bass movie title sequences. Bold geometric shapes: circle, triangle, arrow in primary colors (red, black, white). Abstract human figure composed of simple geometric forms. High contrast, flat design, no gradients. Bold sans-serif Japanese title text integrated into composition. Mid-century modern aesthetic. Vertical poster format.
```
出典: SRC-L | `--aspect portrait`

---

### P074: TED風プレゼン・ビジュアル
```
A TED Talk presentation visual. Dark background (near-black). Single powerful central image or icon, large and bold. Short Japanese headline text below (max 10 characters), white, large font. Minimal supporting text. Red TED logo color accent somewhere in design. High impact, emotional, designed to punctuate a speech point. 16:9 format.
```
出典: SRC-L | `--aspect landscape`

---

### P075: アニュアルレポート・インフォグラフィック
```
An annual report infographic page. Executive summary style layout. Top: large headline year "2024年度". Left column: 3 key performance metrics shown as large numbers with icons (売上高, 顧客数, 従業員数). Center: Donut chart showing revenue breakdown by segment. Right: Bar chart showing YoY growth. Bottom: 3 strategic highlights in icon+text format. Corporate colors, professional design, Japanese text.
```
出典: SRC-L | `--aspect portrait`

---

### P076: ダッシュボードUI風インフォグラフィック
```
A dashboard-style infographic mimicking a modern analytics interface. Dark mode design (#1a1a2e background). Top row: 4 KPI cards (数字+矢印+変化率). Middle: Large line chart showing trend over 12 months. Bottom left: Pie chart. Bottom right: Top 5 ranking list. Interactive-looking but static. Japanese labels, cyan/purple/green accent colors. Tech startup aesthetic.
```
出典: SRC-L | `--aspect landscape`

---

### P077: サイエンスポスター（研究発表）
```
A scientific research poster layout for conference presentation. Portrait orientation. Top banner with Japanese title and author names. Abstract section (200 characters Japanese). Methods section with process flowchart icons. Results section with 2 charts side by side. Conclusion section with 3 bullet points. References at bottom in small text. Clean academic design, university logo placeholder, blue/white color scheme.
```
出典: SRC-L | `--aspect portrait`

---

### P078: スタートアップ・ピッチデッキスライド
```
A startup pitch deck slide showing business model. Lean Canvas format. 9 boxes: Problem (課題), Solution (解決策), Unique Value Proposition (独自の価値提案), Unfair Advantage (優位性), Customer Segments (顧客セグメント), Key Metrics (主要指標), Channels (チャネル), Cost Structure (コスト構造), Revenue Streams (収益源). Each box has icon + Japanese text. Startup aesthetic, bold colors, confident design.
```
出典: SRC-L | `--aspect landscape`

---

### P079: OKRフレームワーク図
```
A business OKR (Objectives and Key Results) framework infographic. Top level: Company Objective (会社目標) in large circle. Below: 3 Key Results (KR1, KR2, KR3) in medium circles connected by lines. Below each KR: 2-3 Team Initiatives in small rectangles. Progress indicators (0-100%) shown as arc gauges. Japanese text throughout. Q4 FY2024 timeframe label. Clean corporate design, blue gradient palette.
```
出典: SRC-L | `--aspect landscape`

---

### P080: プロダクトロードマップ（横型）
```
A product roadmap infographic. Horizontal timeline divided into 4 quarters (Q1-Q4). 3 swim lanes: Platform (基盤), Features (機能), Growth (成長). Each initiative shown as a colored pill/bar spanning its duration. Milestone diamonds at key release points. Color-coded by team/priority. Japanese feature names in pills. Clean agile product management style, Jira-like aesthetic, white background.
```
出典: SRC-L | `--aspect wide`

---

## カテゴリ14: WEEL・3D技術系（SRC-M ベース）

WEEL（weel.co.jp）が実際に検証・公開したNanoBanana2高度プロンプト事例集。

### P081: 3D建築設計図（アイソメトリック）
```
A 3D isometric architectural blueprint of a modern minimalist house. Cutaway view showing interior rooms: living room, kitchen, bedroom, bathroom. Furniture shown in 3D isometric style. Structural elements visible: walls, roof, foundation. Dimension lines and Japanese room labels. Blueprint color scheme: dark blue background (#003366), white lines, cyan accent. Technical drafting aesthetic with grid overlay.
```
出典: SRC-M | `--aspect landscape`

---

### P082: キャラクターデザインシート（ターンアラウンド）
```
A professional character design turnaround sheet. Shows same character from 5 angles: front, 3/4 front, side profile, 3/4 back, back. Clean white background. Character: young female office worker in modern Japanese business casual. Consistent lighting across all views. Height reference lines. Japanese annotations for costume details. Anime-adjacent art style, clean lines, flat color fills. Character sheet format.
```
出典: SRC-M | `--aspect landscape`

---

### P083: 線画の自動色塗り風
```
A manga-style line art illustration of a Japanese high school classroom scene, with the aesthetic of a colorized version of a black and white sketch. Clear ink lines visible. Soft, cel-shaded colors applied: wooden desks in warm brown, uniforms in navy/white, sky blue through windows. Visible linework beneath colors. Nostalgic 2000s shounen manga aesthetic. No text.
```
出典: SRC-M | `--aspect landscape`

---

### P084: 製品3Dレンダリング（ガジェット）
```
A photorealistic 3D product rendering of a sleek wireless noise-canceling headphone. Floating on pure white background, slight drop shadow. Shot from 3/4 angle showing both earcups and headband. Surface detail: matte black finish with silver accent trim. Soft studio lighting highlighting product contours. No text, no watermarks. Commercial product photography aesthetic. Ultra-high detail.
```
出典: SRC-M | `--aspect square`

---

### P085: バーチャル試着（ファッション）
```
A fashion lookbook image showing a clothing outfit on a digital mannequin. Front view. Outfit: oversized beige linen blazer + white wide-leg trousers + minimalist white sneakers. Styled with small crossbody bag. Clean white studio background. Product tags visible showing Japanese brand name placeholder. Commercial fashion photography style, bright and airy lighting. No face shown.
```
出典: SRC-M | `--aspect portrait`

---

### P086: コンセプトアート（SF都市）
```
Concept art for a near-future Japanese megacity, circa 2060. Aerial wide shot. Mega-structures with vertical gardens cascade down tiered layers. Flying vehicles weave between buildings. Traditional torii gates integrated into modern architecture. Warm golden hour lighting contrasts with cool LED signage. Painterly digital art style, highly detailed, cinematic widescreen format. Japanese text on some signage.
```
出典: SRC-M | `--aspect wide`

---

### P087: テクニカルイラスト（エンジン断面）
```
A technical cross-section illustration of a modern electric vehicle motor. Cutaway view showing internal components: rotor, stator, cooling channels, shaft, bearings, magnet arrays. Each component labeled in Japanese with callout lines. Color-coded by function: copper windings in orange, steel in gray, coolant channels in blue. Engineering manual style, white background, precise linework. Educational diagram aesthetic.
```
出典: SRC-M | `--aspect landscape`

---

### P088: ファッションスケッチ（コレクション）
```
A fashion design sketch page showing a women's capsule wardrobe collection of 6 items: blazer, wide pants, midi skirt, knit top, trench coat, loafers. Each piece shown on simplified croquis figure in gesture pose. Pencil sketch base with light watercolor wash. Color palette swatches below each piece: cream, camel, olive, rust. Japanese fabric notes. Atelier sketchbook aesthetic.
```
出典: SRC-M | `--aspect portrait`

---

## カテゴリ15: クリエイティブ発展系（SRC-N / SRC-I ベース）

momo-gpt.com・DeepDreamGeneratorが公開したビジネス・芸術系の発展プロンプト集。

### P089: 水彩画風ビジネスポートレート
```
A watercolor portrait of a Japanese businessperson in their 40s. Professional but warm expression. Dressed in classic dark suit with white shirt. Soft watercolor washes define face and clothing. White paper showing through in highlights. Visible brushstroke texture. Slightly desaturated colors with warm skin tones. Painterly, human, approachable. No text. Square format.
```
出典: SRC-N | `--aspect square`

---

### P090: 木版画風（浮世絵テイスト）アイキャッチ
```
A modern topic presented in the style of traditional Japanese woodblock print (ukiyo-e). Flat areas of bold color, visible printing texture, black outlines with characteristic variable width. Subject: a person staring at a glowing smartphone screen at night. Stylized clouds, geometric patterns. Limited color palette: indigo, coral, cream, black. Japanese calligraphic title at top. Vertical format.
```
出典: SRC-N | `--aspect portrait`

---

### P091: ローポリゴン（Low-poly）アート
```
A low-polygon geometric art piece depicting Mount Fuji at sunrise. Subject broken into visible triangular facets. Each facet a distinct flat color. Color palette: dawn sky in pinks/oranges, mountain in blue-purple, snow cap in white. No gradients, only flat color polygons. Modern geometric aesthetic. Clean, decorative, suitable for tech brand imagery. Wide landscape format.
```
出典: SRC-N | `--aspect landscape`

---

### P092: ドット絵（ピクセルアート）アイコン
```
Pixel art style icon sheet. 8x8 grid showing 64 small pixel art icons related to Japanese office work: laptop, coffee, calendar, pen, folder, phone, meeting room, stapler, etc. Each icon in a 16x16 pixel space. Retro game palette: 16 colors max. White background, pixel-perfect rendering, no anti-aliasing. Charming 8-bit aesthetic. Japanese label below each icon.
```
出典: SRC-N | `--aspect square`

---

### P093: グラフィックノベル風（モノクロ）
```
A graphic novel page in black and white ink style. 6 panels showing a brief story: office worker receives late-night email, checks phone with worried expression, types furious response, pauses, deletes text, sends simple "了解です" instead. Dramatic hatching shadows, expressive faces, Japanese speech bubbles. Manga reading direction (right to left). Professional adult josei manga aesthetic.
```
出典: SRC-N | `--aspect portrait`

---

### P094: ヴィンテージ旅行ポスター風
```
A vintage travel poster style illustration promoting Kyoto, Japan. Art Deco influence. Simplified landscape: Kinkaku-ji temple reflected in still pond, cherry blossoms in foreground. Bold flat colors with slight texture. Geometric decorative border. Japanese title "京都" in large stylized calligraphy, "KYOTO, JAPAN" below in Art Deco font. Muted vintage color palette: deep red, gold, forest green, cream.
```
出典: SRC-N | `--aspect portrait`

---

### P095: ストップモーションアニメ風静止画
```
A stop-motion animation style still image. Felt and fabric textures visible on all elements. Scene: small clay/felt figures of a team celebrating around a table with tiny clay cake and paper confetti. Background: miniature felt office set with paper windows. Shallow depth of field. Warm practical lighting. Handmade, tactile aesthetic. Square format, warm color palette. Joyful scene.
```
出典: SRC-N | `--aspect square`

---

### P096: イソメトリック・スマートシティ
```
An isometric smart city illustration. Aerial 45-degree view of a small city block. Buildings with varying heights, green rooftop gardens, solar panels, EV charging stations, bike lanes, parks. Small human figures walking. Connected by visible data stream lines (glowing cyan). Clean flat design with subtle shadows. Japanese street signs. Optimistic, future-forward aesthetic. Warm afternoon lighting.
```
出典: SRC-N | `--aspect square`

---

### P097: 抽象アート（感情表現）
```
Abstract expressionist painting representing the feeling of "Monday morning" (月曜の朝). Dominant colors: heavy grays and dark blues in lower half, barely-emerging warm gold breaking through upper right corner. Thick impasto texture visible. Gestural brush strokes. No figures, pure emotion through color and form. Gallery-quality fine art aesthetic. No text. Square format.
```
出典: SRC-N | `--aspect square`

---

### P098: キネティックタイポグラフィ風静止画
```
A kinetic typography style static image. Japanese text "変われ" displayed in dynamic fragmenting letterforms, as if captured mid-motion. Letters breaking apart and reforming. Motion blur trails. Dark background, high-contrast white and electric blue text. Some letters pixelating, others sharp. Graphic design / motion graphics aesthetic. Horizontal format suitable for video thumbnail.
```
出典: SRC-N | `--aspect landscape`

---

### P099: 切り紙細工風（ペーパーカット）インフォグラフィック
```
A paper-cut art style infographic. Layered paper effect creating depth through shadow. Subject: the four seasons of Japan (四季). Four quadrants each showing a seasonal scene cut from colored paper: spring (sakura, pale pink), summer (fireworks, deep blue), autumn (momiji, burnt orange), winter (snow, white/silver). Each season labeled in Japanese calligraphy style. Overhead lighting creates realistic paper shadows.
```
出典: SRC-N | `--aspect square`

---

### P100: 俯瞰フラットレイ（Instagram風）
```
A flat lay photography style illustration. Overhead top-down view. Subject: "クリエイターの作業デスク" - a creative workspace layout. Items arranged on white desk: MacBook (open, showing colorful design work), iPad with Apple Pencil, coffee in ceramic mug, small plant, wireless earbuds case, notebook with Japanese handwriting, color swatches. Perfect geometric arrangement. Shadows suggest soft window light. Commercial Instagram aesthetic.
```
出典: SRC-N | `--aspect square`

---

## 実用テクニックまとめ（X・各種ガイドより）

### 1. シーン描写型が最強
キーワード羅列より「物語文章」で書く方が品質が高い。
- NG: 「猫、カフェ、窓際」
- OK: 「午後の柔らかい日差しが差し込むカフェの窓際で、一匹の茶トラ猫が…」

### 2. レイアウトを明示する
- 「左から右へ情報が流れる」
- 「上半分と下半分に分かれた対比構造」
- 「中央にメインコンテンツ」

### 3. アスペクト比とピクセル数を指定する
- SNS横型: 横1600px × 縦900px（16:9）
- SNS縦型: 横1000px × 縦1800px（縦長）
- 正方形: 1080px × 1080px（1:1）
- 蒼図スタイル: 720px × 460px（固定）

### 4. 日本語ルールを明記する
- 「すべて日本語で表示」
- 「1行10文字以内のキーワード」
- 「見出しは太字、本文は細字」

### 5. カラーコードで統一感を出す
- 具体的な16進数カラーコードを指定（例: `#003366`）
- ブランドカラーとの一致が可能

### 6. Upscale to 4K で画質向上
プロンプト末尾に追加するだけ。

### 7. 対話型で追い込む
初回で完璧を目指さず、「もっと〇〇にして」と段階的に修正。

---

## 使用コマンド例

```bash
# P002のフローチャートをnote記事用に生成（プロジェクトルートから実行）
cd skill/nanobanana2
python scripts/run.py generate.py \
  --prompt "クリーンでプロフェッショナルなモダンフラットデザインのフローチャートインフォグラフィックを1枚の横長画像で作成してください。画像比率は横1600px × 縦900px程度。全体テーマ：browser-use CLI 2.0の仕組み。左から右へ：入力→AI処理→CDP接続→ブラウザ操作→結果取得の5ステップ。各ステップに日本語ラベルとアイコン付き。" \
  --output "../../output/articles/images/diagram.png" \
  --aspect landscape
```
