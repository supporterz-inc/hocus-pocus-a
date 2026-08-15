# ナレッジ作成機能 TODO（初心者向け）

## 何を作るのか

ログイン中のユーザーが、画面の入力欄に Markdown を書いて保存できる機能を作ります。

完成後の操作は次のようになります。

1. ナレッジ一覧で「ナレッジを作成」を押す
2. 作成画面の入力欄に Markdown を書く
3. 「作成する」を押す
4. 入力内容が `storage` フォルダーに JSON ファイルとして保存される
5. ナレッジ一覧へ戻る

今回は Markdown の生文字列を保存するところまで実装します。HTML への変換やプレビューは、今後「ナレッジ詳細表示」を作るときに実装します。

## このアプリの処理の流れ

このアプリでは、処理を役割ごとに4つの場所へ分けています。

```text
ブラウザー
   ↓ リクエストを受け取る
router.ts
   ↓ 作成処理を依頼する
controllers
   ↓ ナレッジを作成・保存する
models

features で作った画面
   ↓
ブラウザーへ表示
```

- `src/models`: ナレッジのデータと保存ルールを置く場所
- `src/features`: ユーザーが見る画面を置く場所
- `src/controllers`: モデルと画面を順番につなぐ場所
- `src/router.ts`: URLやGET・POSTなどのHTTP通信を扱う場所

Step 1から順番に進めます。各Stepのテストが通ってから次へ進むと、問題が起きた場所を見つけやすくなります。

## 今回は作らないもの

- Markdown のプレビューやHTML変換
- タイトル、タグ、画像
- 下書き保存
- ナレッジの詳細表示、編集、削除

---

## Step 1: 空のナレッジを作れないようにする

### なぜ必要か

画面の入力欄に `required` を付けても、別のツールから直接リクエストを送れば空の本文を送信できます。そのため、データを作る `Knowledge.create` 自体でも入力を確認します。

### 変更するファイル

- `src/models/knowledge.model.ts`
- `src/models/knowledge.model.test.ts`

### やること

- [ ] `Knowledge.create(content, authorId)` の先頭で本文が空でないか確認する
- [ ] `content.trim()` が空文字なら、専用のエラーを投げる
- [ ] 確認にだけ `trim()` を使い、保存する `content` は加工しない
- [ ] 通常の Markdown を渡すと作成できるテストを書く
- [ ] `''`、`'   '`、改行だけを渡すと作成できないテストを書く
- [ ] UUID形式の `knowledgeId` が作られることもテストする
- [ ] 日時のテストには必要に応じて Vitest の fake timer を使い、`setTimeout` は使わない

入力を加工しない理由は、Markdownでは行頭の空白や改行にも意味があるためです。

### 確認方法

```sh
npm test -- src/models/knowledge.model.test.ts
```

正常な本文のテストと、空の本文を拒否するテストが両方通れば完了です。

---

## Step 2: ナレッジをファイルへ保存する

### なぜ必要か

現在の `KnowledgeRepository.upsert` は未実装です。`Knowledge.create` で作ったデータはメモリ上にしかないため、アプリを終了しても残るようファイルへ書き込みます。

`upsert` は「同じIDのデータがなければ作成し、あれば上書きする」という意味です。

### 変更するファイル

- `src/models/knowledge.repository.ts`
- `src/models/knowledge.repository.test.ts`（新規）

### やること

- [ ] Node.js の `mkdir` と `writeFile` を `node:fs/promises` から読み込む
- [ ] 保存前に `mkdir('./storage', { recursive: true })` を呼ぶ
- [ ] 保存先を `storage/<knowledgeId>.json` にする
- [ ] `Knowledge` を `JSON.stringify` でJSON文字列に変換する
- [ ] `writeFile` でUTF-8のファイルとして保存する
- [ ] 保存したファイルを読み戻し、元の `Knowledge` と同じ内容かテストする
- [ ] テストで作ったファイルだけをテスト終了時に削除する

保存されるデータの例です。

```json
{
  "__tag": "Knowledge",
  "knowledgeId": "自動生成されたUUID",
  "content": "# Markdownの本文",
  "authorId": "ログイン中のユーザーID",
  "createdAt": 1234567890,
  "updatedAt": 1234567890
}
```

### 注意点

- `storage/.gitignore` は削除しない
- テスト時に `storage` フォルダー全体を削除しない
- 書き込み失敗を成功扱いにせず、エラーを呼び出し元へ返す

### 確認方法

```sh
npm test -- src/models/knowledge.repository.test.ts
```

テスト後に不要なJSONファイルが残っていないことも確認します。

---

## Step 3: Markdown を入力する画面を作る

### なぜ必要か

ユーザーがブラウザーから本文を入力して送信できるフォームが必要です。

### 変更するファイル

- `src/features/KnowledgeCreateFeature.tsx`（新規）

### やること

- [ ] 既存の `Layout` を使って作成画面を作る
- [ ] `<form method="post" action="/knowledges">` を置く
- [ ] Markdown用の `<textarea>` を置き、`name="content"` と `required` を付ける
- [ ] `label` の `for` と `textarea` の `id` を同じ値にする
- [ ] 「作成する」ボタンと、一覧へ戻るリンクを置く
- [ ] エラー文と入力済み本文を受け取れる Props を用意する
- [ ] エラー後に同じ本文を `textarea` へ再表示する
- [ ] 既存の Tailwind CSS を使い、375px幅で操作しやすい画面にする

フォームのおおまかな形は次のとおりです。

```tsx
<form method="post" action="/knowledges">
  <label for="content">本文（Markdown）</label>
  <textarea id="content" name="content" required />
  <button type="submit">作成する</button>
</form>
```

実装時には、エラー表示と入力値の再表示も追加します。

### 確認方法

- ラベルを押すと入力欄にカーソルが移動する
- 空のまま送信しようとすると必須入力チェックが働く
- 横幅375pxでもボタンや入力欄がはみ出さない

---

## Step 4: Controller で作成と保存をつなぐ

### なぜ必要か

画面から受け取った本文をモデルでナレッジに変換し、Repositoryで保存する処理をひとまとめにします。

### 変更するファイル

- `src/controllers/get-create-knowledge.controller.tsx`（新規）
- `src/controllers/create-knowledge.controller.ts`（新規）
- 必要に応じて各Controllerのテストファイル

### やること

- [ ] GET用Controllerで、Step 3の空の作成画面を返す
- [ ] POST用Controllerは `content` と `userId` を引数で受け取る
- [ ] `Knowledge.create(content, userId)` でナレッジを作る
- [ ] 作ったナレッジを `KnowledgeRepository.upsert` へ渡す
- [ ] 保存できたナレッジを呼び出し元へ返す
- [ ] 空の本文では保存処理が呼ばれないことをテストする
- [ ] 正常時は本文とユーザーIDが保存処理へ渡ることをテストする

```text
本文とユーザーIDを受け取る
    ↓
Knowledge.create でデータを作る
    ↓
KnowledgeRepository.upsert で保存する
```

### 重要な注意点

作成者の `userId` はフォームから受け取ってはいけません。フォーム値はユーザーが書き換えられるためです。ログイン処理が `Context` に設定した `userId` をRouterからControllerへ渡します。

ControllerはHonoの `Context` を直接受け取りません。HTTP処理は次のStepの `router.ts` が担当します。

---

## Step 5: URL と作成処理を Router でつなぐ

### なぜ必要か

ここまでに作った画面と保存処理を、ブラウザーからアクセスできるURLへ割り当てます。

### 変更するファイル

- `src/router.ts`
- `src/features/KnowledgeListFeature.tsx`

### やること

#### 作成画面を表示するGET処理

- [ ] `GET /knowledges/new` を追加する
- [ ] GET用Controllerが返した作成画面を `ctx.html(...)` で返す

#### フォームを受け取るPOST処理

- [ ] `POST /knowledges` を追加する
- [ ] `await ctx.req.parseBody()` でフォームデータを読む
- [ ] `content` が文字列か確認する
- [ ] `ctx.get('userId')` でログイン中のユーザーIDを得る
- [ ] `content` と `userId` をPOST用Controllerへ渡す
- [ ] 保存成功後は `303 See Other` で `/` へリダイレクトする
- [ ] 本文がない、または空白だけなら、入力値とエラー文付きのフォームを `400 Bad Request` で返す

#### 一覧から作成画面へのリンク

- [ ] `KnowledgeListFeature` に「ナレッジを作成」リンクを追加する
- [ ] リンク先を `/knowledges/new` にする

### 用語の説明

- `GET`: 画面やデータを取得するときの通信
- `POST`: 入力データを送るときの通信
- `400 Bad Request`: 入力内容に問題があることを示すHTTPステータス
- `303 See Other`: POST完了後に別画面へ移動させるHTTPステータス
- リダイレクト: サーバーがブラウザーへ別のURLを開くよう指示すること

POST後に一覧へリダイレクトすることで、再読み込み時の二重投稿を防ぎます。この方法を Post/Redirect/Get と呼びます。

---

## Step 6: 機能全体をテストする

### 自動テスト

- [ ] 必要に応じて `src/router.test.ts` を新しく作る
- [ ] `GET /knowledges/new` が `200 OK` と作成フォームを返すことを確認する
- [ ] 正常な本文をPOSTすると `303 See Other` を返すことを確認する
- [ ] 保存されたJSONの `content` と `authorId` を確認する
- [ ] 空の本文をPOSTすると `400 Bad Request` を返し、保存しないことを確認する
- [ ] すべてのテストを実行する

```sh
npm test
```

### コード品質とビルドの確認

```sh
npm run build
```

このコマンドで、コード書式、TypeScriptの型、CSS生成をまとめて確認できます。

### ブラウザーでの確認

```sh
npm start -- "test-user"
```

`http://localhost:8080` を開き、次を確認します。

- [ ] 一覧に「ナレッジを作成」リンクがある
- [ ] リンクから作成画面へ移動できる
- [ ] Markdownを入力して作成できる
- [ ] 作成後に一覧へ戻る
- [ ] `storage` にJSONファイルが作られている
- [ ] JSONの `authorId` が `test-user` になっている
- [ ] 空白だけの本文は保存されない
- [ ] エラー時も入力した本文が画面に残る

確認用のJSONはそのファイルだけを削除します。`storage` フォルダー全体や `.gitignore` は削除しません。

---

## 完了チェックリスト

- [ ] Markdown本文を入力する画面がある
- [ ] ログイン中のユーザーIDでナレッジを作成できる
- [ ] `storage/<knowledgeId>.json` にデータが保存される
- [ ] 空または空白だけの本文は保存されない
- [ ] 入力エラー時に本文が消えない
- [ ] 保存後は303リダイレクトで一覧へ戻る
- [ ] モデル、Repository、Controller、Routerのテストが通る
- [ ] `npm test` が成功する
- [ ] `npm run build` が成功する
