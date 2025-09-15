# ナレッジ詳細表示機能 実装タスク

## 1. ルーティングの追加 (`src/router.ts`)

- `GET /knowledges/:id` のルートを追加し、ナレッジ詳細を表示するコントローラーに接続する。
    - `ctx.req.param('id')` を使って URL から `knowledgeId` を取得し、コントローラーに渡す。

## 2. コントローラーの作成

- `src/controllers/get-knowledge-by-id.controller.tsx` を作成する。
    - `knowledgeId` を引数として受け取る。
    - `KnowledgeRepository.getByKnowledgeId()` を呼び出し、ナレッジデータを取得する。
    - 取得したナレッジデータを詳細表示用の UI (Feature) に渡して呼び出す。
    - ナレッジが見つからなかった場合は、404 Not Found を示す UI を返す。

## 3. UI (Feature) の作成

- `src/features/KnowledgeDetailFeature.tsx` を作成する。
    - `Knowledge` オブジェクトを props として受け取る。
    - ナレッジの `title` と `content` を表示する。
    - `Layout.tsx` で全体をラップする。
- `src/features/KnowledgeListFeature.tsx` を更新する。
    - ナレッジ一覧の各項目に、詳細ページへのリンク (`/knowledges/${knowledge.knowledgeId}`) を追加する。

## 4. リポジトリの更新 (`src/models/knowledge.repository.ts`)

- `getByKnowledgeId(knowledgeId: string): Promise<Knowledge | null>` メソッドを実装する。
    - このメソッドは、指定された `knowledgeId` に対応するナレッジをストレージ (ファイルシステム) から取得する。
    - `storage/{knowledgeId}.json` のファイルを読み込み、`Knowledge` オブジェクトとして返す。
    - ファイルが存在しない場合は `null` を返す。

## 5. テストの作成

- `src/models/knowledge.repository.test.ts` を作成、または追記する。
    - `getByKnowledgeId` メソッドの単体テストを作成する。
    - モックファイルシステムを使い、指定した ID のファイルが正しく読み込まれること、および存在しない場合に `null` が返されることを確認する。