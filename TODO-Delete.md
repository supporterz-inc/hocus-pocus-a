# ナレッジ削除機能 実装タスク

## 1. ルーティングの追加 (`src/router.ts`)

- `POST /knowledges/:id/delete` のルートを追加し、ナレッジを削除するコントローラーに接続する。

## 2. コントローラーの作成

- `src/controllers/delete-knowledge.controller.ts` を作成する。
    - リクエストのパスパラメータから `id` を取得する。
    - `KnowledgeRepository.delete()` を呼び出し、ナレッジを削除する。
    - 削除後はナレッジ一覧ページ (`/`) にリダイレクトする。

## 3. UI (Feature) の更新

- `src/features/KnowledgeDetailFeature.tsx` を更新する。
    - ナレッジ詳細ページに「削除」ボタンを追加する。
    - このボタンはフォーム (`<form>`) の中に配置し、`action` は `/knowledges/{knowledge.knowledgeId}/delete`、`method` は `post` に設定する。

## 4. リポジトリの更新 (`src/models/knowledge.repository.ts`)

- `delete(knowledgeId: string): Promise<void>` メソッドを実装する。
    - このメソッドは、`storage/{knowledgeId}.json` ファイルをファイルシステムから削除する。

## 5. テストの作成

- `src/models/knowledge.repository.test.ts` を更新する。
    - `delete` メソッドの単体テストを作成する。
    - `upsert` で一度ファイルを作成した後、`delete` を呼び出し、ファイルが削除されることを確認する。
