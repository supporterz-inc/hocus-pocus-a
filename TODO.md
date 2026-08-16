# ナレッジ詳細表示・更新・削除 実装 TODO

この TODO は、次の 3 機能を小さな単位に分けて実装するための手順書です。

- ナレッジ詳細表示：指定したナレッジを 1 件表示する
- ナレッジ更新：自分が投稿したナレッジの本文を編集する
- ナレッジ削除：自分が投稿したナレッジを削除する

上から順に進め、各段階でテストを実行してください。最初からすべてを同時に作るより、問題が起きた場所を見つけやすくなります。

## 0. 最初に全体の流れを理解する

このプロジェクトでは、処理を次の順番で受け渡します。

```text
ブラウザ
  ↓ HTTP リクエスト
src/router.ts
  ↓ 必要な値だけを渡す
src/controllers
  ↓ データの取得・更新を依頼する
src/models
  ↓ 表示に必要な値を渡す
src/features
  ↓ HTML
ブラウザ
```

今回使用する URL と役割は次のようにします。

| HTTP メソッド | URL | 役割 |
| --- | --- | --- |
| `GET` | `/knowledges/:knowledgeId` | 詳細画面を表示する |
| `GET` | `/knowledges/:knowledgeId/edit` | 編集画面を表示する |
| `POST` | `/knowledges/:knowledgeId` | 編集内容を保存する |
| `POST` | `/knowledges/:knowledgeId/delete` | ナレッジを削除する |

`DELETE` メソッドを使わないのは、通常の HTML の `<form>` が `GET` と `POST` だけを送信できるためです。

## 1. 作業を始める準備

- [ ] 作業用ブランチを作る

  ```sh
  git switch -c feature/knowledge-detail-update-delete
  ```

- [ ] 現在のテストが成功することを確認する

  ```sh
  npm test
  ```

- [ ] ビルドできることを確認する

  ```sh
  npm run build
  ```

テストやビルドが最初から失敗する場合は、今回の変更を始める前に原因をメモしてチームへ共有します。

## 2. リポジトリに「1 件取得」と「削除」を実装する

対象ファイル：

- `src/models/knowledge.repository.ts`
- `src/models/knowledge.repository.test.ts`

### 2-1. 存在しないナレッジを表すエラーを決める

- [ ] `KnowledgeNotFoundError` のような専用エラーを用意する
- [ ] エラーには、探した `knowledgeId` を保持させる

専用エラーがあると、`router.ts` で「見つからない場合だけ 404 にする」という判断ができます。ファイル読み込みで起きるすべてのエラーを 404 にしてはいけません。権限不足や壊れた JSON など、別の問題を隠してしまうためです。

### 2-2. `getByKnowledgeId` を実装する

- [ ] `./storage/${knowledgeId}.json` を `readFile` で読む
- [ ] 読み込み前に ID が UUID 形式か検証し、不正な形式は `KnowledgeNotFoundError` にする
- [ ] 読み込んだ JSON を `JSON.parse` して `Knowledge` として返す
- [ ] 対象ファイルが存在しない `ENOENT` の場合だけ `KnowledgeNotFoundError` を投げる
- [ ] それ以外のエラーは、そのまま投げ直す
- [ ] 現在の仮実装と `noExplicitAny` の無視コメントを削除する

### 2-3. `deleteByKnowledgeId` を実装する

- [ ] `node:fs/promises` の `unlink` で対象の JSON ファイルを削除する
- [ ] 対象が存在しない場合は `KnowledgeNotFoundError` を投げる
- [ ] 現在の仮実装と `noExplicitAny` の無視コメントを削除する

URL の ID は利用者が自由に変更できます。ID が UUID 形式であることを確認してからパスへ入れ、`../` などを使って `storage` の外を読み書きできないようにします。取得と削除で同じ検証関数を利用してください。

### 2-4. リポジトリの単体テストを追加する

- [ ] 保存したナレッジを ID で取得できる
- [ ] 存在しない ID を取得すると `KnowledgeNotFoundError` になる
- [ ] 保存したナレッジを削除できる
- [ ] 存在しない ID を削除すると `KnowledgeNotFoundError` になる
- [ ] テストで作成した JSON は `try` / `finally` で必ず片付ける

確認コマンド：

```sh
npx vitest run src/models/knowledge.repository.test.ts
```

## 3. ナレッジ詳細表示を実装する

### 3-1. 詳細画面を作る

新規ファイル：`src/features/KnowledgeDetailFeature.tsx`

- [ ] Props として `knowledge` と、ログイン中の `userId` を受け取る
- [ ] 本文、作成者 ID、作成日時、更新日時を表示する
- [ ] 一覧へ戻るリンクを置く
- [ ] `knowledge.authorId === userId` の場合だけ「編集」「削除」を表示する
- [ ] 375px 固定幅は既存の `Layout` に任せる

最初は本文を `<pre class="whitespace-pre-wrap">` などで表示すれば、改行を保った安全な詳細画面を作れます。Markdown を HTML に変換する処理は別の課題として切り出せます。ユーザー入力をそのまま HTML として埋め込むと XSS の危険があるため、安易に raw HTML を使わないでください。

### 3-2. 詳細表示コントローラーを作る

新規ファイル：`src/controllers/get-knowledge-detail.controller.tsx`

- [ ] 引数として `knowledgeId` と `userId` を受け取る
- [ ] `KnowledgeRepository.getByKnowledgeId(knowledgeId)` で 1 件取得する
- [ ] 取得結果を `KnowledgeDetailFeature` に渡して返す

Controller に Hono の `Context` を渡さず、必要な文字列だけを渡す点は既存コードに合わせます。

### 3-3. 詳細表示ルートを追加する

対象ファイル：`src/router.ts`

- [ ] `GET /knowledges/:knowledgeId` を追加する
- [ ] `ctx.req.param('knowledgeId')` から ID を取得する
- [ ] `ctx.get('userId')` からログイン中のユーザー ID を取得する
- [ ] 詳細表示コントローラーの結果を `ctx.html(...)` で返す
- [ ] `KnowledgeNotFoundError` の場合はステータス `404` を返す

ルートの登録順に注意します。`/knowledges/new` を `/knowledges/:knowledgeId` より先に登録しないと、`new` がナレッジ ID として扱われる可能性があります。同様に `/edit` ルートも詳細ルートとの関係を確認します。

### 3-4. 一覧から詳細へ移動できるようにする

対象ファイル：`src/features/KnowledgeListFeature.tsx`

- [ ] 各ナレッジを `/knowledges/${knowledge.knowledgeId}` へのリンクにする
- [ ] ID だけでなく、本文の先頭部分など内容が分かる文字も表示する

### 3-5. テストを追加する

- [ ] Controller のテストで、指定 ID のナレッジが画面へ渡されることを確認する
- [ ] Router のテストで、詳細ページが `200` になることを確認する
- [ ] Router のテストで、存在しない ID が `404` になることを確認する
- [ ] UUID ではない ID が `404` になり、`storage` の外を参照しないことを確認する
- [ ] 作成者には編集・削除操作が表示されることを確認する
- [ ] 作成者以外には編集・削除操作が表示されないことを確認する

## 4. ナレッジ更新を実装する

`Knowledge.update` と、空白を拒否するモデルのテストはすでにあります。ここでは、それを画面から呼び出せるようにします。

### 4-1. 編集画面を作る

新規ファイル：`src/features/KnowledgeEditFeature.tsx`

- [ ] Props として `knowledge`、任意の `content`、任意の `errorMessage` を受け取る
- [ ] `<textarea name="content">` に、`content` があればその値を、なければ現在の本文を入れる
- [ ] form の送信先を `/knowledges/${knowledge.knowledgeId}` にする
- [ ] form の `method` を `post` にする
- [ ] 「保存する」ボタンと詳細へ戻るリンクを置く
- [ ] エラー時にも入力した本文を残せる Props の形にする

### 4-2. 編集画面表示コントローラーを作る

新規ファイル：`src/controllers/get-edit-knowledge.controller.tsx`

- [ ] `knowledgeId` を使って対象を取得する
- [ ] `knowledge.authorId` とログイン中の `userId` を比較する
- [ ] 作成者でなければ `ForbiddenKnowledgeOperationError` のような専用エラーを投げる
- [ ] 作成者なら `KnowledgeEditFeature` を返す

画面上で編集リンクを隠すだけでは不十分です。URL を直接入力できるため、必ず Controller 側でも作成者を確認します。

### 4-3. 更新コントローラーを作る

新規ファイル：`src/controllers/update-knowledge.controller.ts`

- [ ] `knowledgeId`、新しい `content`、ログイン中の `userId` を受け取る
- [ ] 対象ナレッジを取得する
- [ ] 作成者 ID を照合し、本人でなければ専用エラーを投げる
- [ ] `Knowledge.update(knowledge, content)` で更新後のモデルを作る
- [ ] `KnowledgeRepository.upsert(updatedKnowledge)` で保存する
- [ ] 更新後の `Knowledge` を返す

作成者 ID はブラウザから送信された値を信用せず、保存済みナレッジと `ctx.get('userId')` を比較します。

### 4-4. 更新ルートを追加する

対象ファイル：`src/router.ts`

- [ ] `GET /knowledges/:knowledgeId/edit` で編集画面を返す
- [ ] `POST /knowledges/:knowledgeId` でフォームを受け取る
- [ ] `content` が文字列か確認する
- [ ] 更新成功後は詳細画面へ `303` でリダイレクトする
- [ ] `InvalidKnowledgeContentError` の場合は、入力内容とエラー文を付けた編集画面を `400` で返す
- [ ] 対象がなければ `404`、本人でなければ `403` を返す

### 4-5. 更新のテストを追加する

- [ ] 本人なら本文を更新できる
- [ ] 更新後も ID、作成者、作成日時は変わらない
- [ ] 更新日時が新しくなる
- [ ] 空白だけの本文では更新できない
- [ ] 他人のナレッジは更新できない
- [ ] 成功時に詳細 URL へ `303` でリダイレクトされる
- [ ] 不正入力時は `400` になり、入力した本文が再表示される
- [ ] 対象がなければ `404` になる

## 5. ナレッジ削除を実装する

### 5-1. 削除確認 UI を詳細画面に置く

対象ファイル：`src/features/KnowledgeDetailFeature.tsx`

- [ ] 作成者にだけ削除用の `<form>` を表示する
- [ ] 送信先を `/knowledges/${knowledge.knowledgeId}/delete` にする
- [ ] `method="post"` を指定する
- [ ] 誤操作を減らすため、確認画面またはブラウザの確認ダイアログを用意するかチームで決める

JavaScript なしで確実に作る場合は、別の `GET /knowledges/:knowledgeId/delete` 確認画面を追加してから削除する方法があります。

### 5-2. 削除コントローラーを作る

新規ファイル：`src/controllers/delete-knowledge.controller.ts`

- [ ] `knowledgeId` とログイン中の `userId` を受け取る
- [ ] 削除前に対象ナレッジを取得する
- [ ] 作成者 ID を照合し、本人でなければ専用エラーを投げる
- [ ] 本人なら `KnowledgeRepository.deleteByKnowledgeId(knowledgeId)` を呼ぶ

削除の前に取得するのは、存在確認だけでなく所有者確認を行うためです。

### 5-3. 削除ルートを追加する

対象ファイル：`src/router.ts`

- [ ] `POST /knowledges/:knowledgeId/delete` を追加する
- [ ] 削除成功後は一覧画面へ `303` でリダイレクトする
- [ ] 対象がなければ `404`、本人でなければ `403` を返す

### 5-4. 削除のテストを追加する

- [ ] 本人なら削除できる
- [ ] 削除後は ID で取得できない
- [ ] 他人のナレッジは削除できない
- [ ] 成功時に一覧 URL へ `303` でリダイレクトされる
- [ ] 対象がなければ `404` になる

## 6. 重複を整理する

3 機能を動かしてから、分かりやすさを保てる範囲で重複をまとめます。

- [ ] 所有者確認が更新・削除で重複する場合、小さな関数にまとめる
- [ ] `404`、`403`、入力エラーの変換が Router 内で読みにくくなった場合、エラー処理関数にまとめる
- [ ] 日時表示が複数箇所にある場合、表示用関数にまとめる
- [ ] 未使用の import、仮実装、Biome の無視コメントを削除する
- [ ] 各関数が「取得」「権限確認」「更新」など理解しやすい順序になっているか確認する

権限エラーは `src/models` のドメインルールとして置くか、`src/controllers` の共通ファイルに置くかをチームで決めます。今回の「本人だけ更新・削除できる」という要件を一か所で表現できる場所を選びます。

## 7. 全体を確認する

- [ ] すべてのテストを実行する

  ```sh
  npm test
  ```

- [ ] 型チェック、コード整形、CSS ビルドを含む全体ビルドを実行する

  ```sh
  npm run build
  ```

- [ ] 開発用ユーザーを指定して起動する

  ```sh
  npm start -- "test-user"
  ```

- [ ] ブラウザで次の操作を手動確認する

  1. 一覧から詳細画面へ移動できる
  2. 本文と投稿者情報が表示される
  3. 自分の投稿だけ編集できる
  4. 空白だけの本文には更新できない
  5. 更新した本文が詳細画面へ反映される
  6. 自分の投稿だけ削除できる
  7. 削除後に一覧から消える
  8. 存在しない ID の URL は `404` になる

- [ ] 別ユーザーでも起動し、自分以外の投稿を更新・削除できないことを確認する

  ```sh
  npm start -- "another-user"
  ```

起動中のサーバーを一度終了してから、別ユーザーで起動し直します。

## 8. 完了条件

- [ ] 誰でもナレッジ詳細を閲覧できる
- [ ] 投稿者本人だけがナレッジを更新できる
- [ ] 投稿者本人だけがナレッジを削除できる
- [ ] URL の直接入力や手作りしたリクエストでも権限を回避できない
- [ ] 存在しないナレッジに `404` を返す
- [ ] 権限がない操作に `403` を返す
- [ ] 不正な本文に `400` を返し、分かりやすいメッセージを表示する
- [ ] モデルとリポジトリに単体テストがある
- [ ] Controller と Router の主要な成功・失敗パターンにテストがある
- [ ] `npm test` と `npm run build` が成功する

## おすすめのコミット単位

作業を小さく記録すると、レビューと問題の切り分けがしやすくなります。

1. `KnowledgeRepository` の取得・削除とテスト
2. 詳細画面、Controller、Router、テスト
3. 編集画面、更新 Controller、Router、テスト
4. 削除 Controller、Router、テスト
5. 重複整理、見た目調整、全体確認
