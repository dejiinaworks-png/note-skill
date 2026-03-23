# サムネイル設計ガイド v2.0

note.com のクリック率を最大化するサムネイル設計。
**目標: 一目でターゲット読者が「自分ごと」と感じるデザイン**

---

## 設計原則

1. **痛みポイントを見せる** — ユーザーの悩みを視覚化（検索から来た人に刺さる）
2. **解決を約束する** — 1秒で「これが答えだ」と伝わるビジュアル
3. **日本語テキスト禁止** — Geminiは日本語テキストが不安定。英語のみ or 文字なし
4. **1焦点の法則** — 中央に1つの主役を置く。情報を詰め込まない
5. **高コントラスト** — 暗背景 × 明るい前景。スマホの小さい画面でも見える

---

## パターン別プロンプト

### パターン1: 問題→解決 スプリット（ハウツー・解説記事）

**用途:** セットアップ手順・使い方・解説系

```
Split layout thumbnail, left half dark charcoal background showing frustration:
person with question marks and error icons, messy tangled cables.
Right half bright cyan background showing success:
clean workflow icons, checkmarks, person looking satisfied.
Center: bold white arrow pointing right from problem to solution.
Top banner: "[TOPIC] Setup Guide" in bold white sans-serif.
Clean modern flat illustration style, 16:9 format, professional.
No Japanese characters.
```

---

### パターン2: 数字強調（まとめ・比較記事）

**用途:** 〇選・〇つのコツ・ランキング系

```
Dark navy blue background, large bold number "[N]" in bright yellow taking up 40% of image.
Right side: vertical list of [N] small icons representing each item.
Top: "[TOPIC]" in white bold uppercase text.
Bottom: subtitle "[subtopic]" in smaller white text.
Clean minimal design, high contrast, modern sans-serif typography.
No Japanese characters, 16:9 format.
```

---

### パターン3: ツール対決（比較記事）

**用途:** AとBを比較する記事

```
Dark background, center dividing line.
Left side: "[Tool A]" logo or icon with blue glow effect.
Right side: "[Tool B]" logo or icon with orange glow effect.
Center top: "VS" in large bold white text.
Bottom center: "Which is Better?" in white.
Clean dramatic lighting, professional tech comparison style, 16:9.
No Japanese characters.
```

---

### パターン4: スクリーン + 結果（ツール紹介）

**用途:** ツール・アプリ・サービスの使い方紹介

```
Dark background, laptop or monitor screen in center showing [tool/app] interface.
Glowing screen effect, lines of code or UI visible on screen.
Bottom left corner: green checkmark badge with "Works!" text.
Top: "[TOOL NAME]" in bold white text with accent color underline.
Modern tech aesthetic, clean flat design, 16:9 format.
No Japanese characters.
```

---

### パターン5: ビフォーアフター（改善・効率化記事）

**用途:** 効率化・改善・生産性UP系

```
Two-panel horizontal layout.
Left panel: crumpled paper, cluttered desk, red X marks, label "BEFORE" in red.
Right panel: clean organized workspace, green checkmarks, label "AFTER" in green.
Center dividing element: vertical line with clock/timer icon showing time saved.
White background, bright accent colors, flat vector illustration style, 16:9.
No Japanese characters.
```

---

## 記事タイプ × パターン対応表

| 記事タイプ | 推奨パターン | 理由 |
|-----------|------------|------|
| インストール・セットアップ | パターン1（問題→解決） | 手順を踏んで解決するイメージ |
| 〇選・まとめ | パターン2（数字強調） | 数字で情報量が伝わる |
| ツール比較 | パターン3（ツール対決） | 対立構図で興味を引く |
| ツール紹介 | パターン4（スクリーン） | 実際の使用感が伝わる |
| 効率化・改善 | パターン5（ビフォーアフター） | 変化量がひと目でわかる |

---

## プロンプトに必ず含める要素

```
+ 16:9 format（アスペクト比固定）
+ No Japanese characters（日本語テキスト排除）
+ flat design or vector illustration（クオリティが安定）
+ high contrast（視認性確保）
+ professional / modern（クオリティの底上げ）
```

## 避けるべき要素

```
- realistic photo style（品質が不安定）
- many text elements（日本語文字化けのリスク）
- complex detailed background（散漫になる）
- neon/cyberpunk（古くなりやすい）
```

---

## 生成コマンド

```bash
cd "C:/Users/Tatsu/Desktop/ツール開発/Note投稿くん/skill/nanobanana2"

python scripts/run.py generate.py \
  --prompt "[上記パターンから選んだプロンプト]" \
  --output "../../output/articles/images/[slug]_thumbnail.png" \
  --aspect landscape
```

---

## 品質チェック（生成後）

- [ ] 日本語文字が含まれていない（または自然に見える）
- [ ] 背景と前景のコントラストが十分高い
- [ ] 中央に明確な焦点がある
- [ ] 記事の内容を一目で表している
- [ ] スマホ画面サイズ（サムネイル表示）でも認識できる
