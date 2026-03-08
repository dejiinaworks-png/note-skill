# /note-post コマンド

noteでバズる記事を自動生成します。

## 使い方

```
/note-post テーマ:"[テーマ]" ターゲット:"[読者層]" 文体:"[文体]"
```

## 処理内容

`.claude/skills/note-buzz-post.md` のスキルを実行します。

1. ディープリサーチ（Pass1 → Pass2）
2. タイトル3案 + 記事構成の設計・提示
3. 本文執筆（Claude）
4. NanoBanana2用 図解プロンプト生成
5. 完成記事のレイアウト組み立て
6. バズスコア評価（100点満点）
7. output/articles/ に保存 + GitHub issue記録
