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
8. **自動投稿**（Phase 7）— Playwright で note.com に自動投稿

## Phase 7: 自動投稿（オプション）

記事完成後、以下で note.com に自動投稿できます:

### 前提条件
- `~/.note-state.json` が存在すること（Cookie認証済み）
- 未設定の場合: Chrome拡張でCookie取得 → `node scripts/cookies-to-state.js cookies.txt`

### 投稿コマンド
```bash
# サムネイル生成
node scripts/generate-thumbnail.js "[記事タイトル]" test/thumbnail.png

# 下書き保存
node scripts/test-draft.js test/thumbnail.png draft

# 公開投稿
node scripts/test-draft.js test/thumbnail.png publish
```

### 注意
- 初回は下書き（draft）でテストすることを推奨
- セッション期限切れ時は Cookie の再取得が必要（1-2週間）
