# ナレッジ作成機能 実装タスク(サンプル用)

## 1. ルーティングの追加 (`src/router.ts`)

- `GET /knowledges/new` のルートを追加し、新規作成フォーム画面を表示するコントローラーに接続する。
- `POST /knowledges` のルートを追加し、ナレッジを新規作成するコントローラーに接続する。

## 2. コントローラーの作成

- `src/controllers/get-new-knowledge.controller.tsx` を作成する。
    - 新規作成フォームのUI (Feature) を呼び出し、レスポンスとして返す。
- `src/controllers/create-knowledge.controller.ts` を作成する。
    - リクエストボディから本文 (content) を取得する。
    - `Knowledge.create()` を呼び出し、新しいナレッジインスタンスを生成する。
    - `KnowledgeRepository.upsert()` を使って、新しいナレッジを永続化する。
    - 作成後はナレッジ一覧ページ (`/`) にリダイレクトする。

## 3. UI (Feature) の作成

- `src/features/NewKnowledgeFeature.tsx` を作成する。
    - 本文を Markdown 形式で入力する `<textarea>` を持つフォームを作成する。
    - フォームの `action` は `/knowledges`、`method` は `post` に設定する。

## 4. リポジトリの更新 (`src/models/knowledge.repository.ts`)

- `upsert(knowledge: Knowledge): Promise<void>` メソッドを実装する。
    - このメソッドは、新しいナレッジをストレージ (ファイルシステム) に `storage/{knowledge.knowledgeId}.json` という命名規則で保存する。
    - 保存する内容は、引数で受け取った `knowledge` オブジェクトをそのまま JSON 文字列化したものとする。

## 5. テストの作成

- `src/models/knowledge.repository.test.ts` を作成、または追記する。
    - `upsert` メソッドの単体テストを作成する。
    - モックファイルシステムを使い、指定したパスにファイルが正しく書き込まれることを確認する。