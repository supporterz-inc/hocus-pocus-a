# ナレッジ詳細表示機能 実装方針

`TODO-detail.md` のタスクに基づき、ナレッジ詳細表示機能の実装を以下のステップで進めます。各ステップには具体的なコード例を記載します。


---

## 1. ルーティングの追加 (`src/router.ts`)

最初に、特定のナレッジIDへのリクエストを処理するためのルーティングを定義します。

- **ファイル:** `src/router.ts`
- **やること:**
    - `/knowledges/:id` のGETリクエストを処理するルートを追加する。

```typescript
// src/router.ts

import { Hono } from 'hono';
import { createKnowledgeController } from './controllers/create-knowledge.controller.js';
import { getAllKnowledgesController } from './controllers/get-all-knowledges.controller.js';
import { getNewKnowledgeController } from './controllers/get-new-knowledge.controller.js';
import { getKnowledgeByIdController } from './controllers/get-knowledge-by-id.controller.js'; // new

export interface Variables {
  userId: string;
}

export const router = new Hono<{ Variables: Variables }>();

// ... (既存のルートは省略)

// ナレッジ詳細の表示
router.get('/knowledges/:id', async (ctx) => {
  const { id } = ctx.req.param();
  const view = await getKnowledgeByIdController(id);

  // TODO: コントローラーがNotFoundを返した場合に404ステータスを返す
  return ctx.html(view);
});

// ... (既存のルートは省略)
```

---

## 2. コントローラーの作成 (`src/controllers/get-knowledge-by-id.controller.tsx`)

次に、リポジトリとUIを連携させるコントローラーを作成します。

- **ファイル:** `src/controllers/get-knowledge-by-id.controller.tsx` (新規作成)
- **やること:**
    - `knowledgeId` でナレッジを取得し、結果に応じて適切なUIを返す。
    - ナレッジが見つからない場合は404ページを表示する。

```typescript
// src/controllers/get-knowledge-by-id.controller.tsx

import { KnowledgeRepository } from '../models/knowledge.repository.js';
import { KnowledgeDetailFeature } from '../features/KnowledgeDetailFeature.js';
import { Layout } from '../features/Layout.js';

function NotFoundFeature() {
  return (
    <Layout title="Not Found">
      <h1>404 - Not Found</h1>
      <p>お探しのナレッジは見つかりませんでした。</p>
      <a href="/" class="text-blue-500 hover:underline">一覧に戻る</a>
    </Layout>
  );
}

export async function getKnowledgeByIdController(knowledgeId: string) {
  const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);

  if (!knowledge) {
    // TODO: HTTPステータスコードを404に設定する
    return <NotFoundFeature />;
  }

  return <KnowledgeDetailFeature knowledge={knowledge} />;
}
```

---

## 3. UI (Feature) の作成

ナレッジの詳細情報を表示するためのUIコンポーネントを作成し、一覧画面からリンクを設定します。

### 3.1. 詳細表示UIの新規作成 (`src/features/KnowledgeDetailFeature.tsx`)

- **ファイル:** `src/features/KnowledgeDetailFeature.tsx` (新規作成)
- **やること:**
    - ナレッジデータを props として受け取り、タイトルと本文を表示するコンポーネントを作成する。

```typescript
// src/features/KnowledgeDetailFeature.tsx

import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface Props {
  knowledge: Knowledge;
}

export function KnowledgeDetailFeature({ knowledge }: Props) {
  return (
    <Layout title={knowledge.title}>
      <article class="space-y-4">
        <h1 class="text-2xl font-bold">{knowledge.title}</h1>
        {/* TODO: Markdown を HTML に変換して表示する */}
        <div class="prose">
          <pre>{knowledge.content}</pre>
        </div>
        <p class="text-sm text-gray-500">
          作成者: {knowledge.authorId} | 最終更新: {new Date(knowledge.updatedAt * 1000).toLocaleString()}
        </p>
        <a href="/" class="text-blue-500 hover:underline">一覧に戻る</a>
      </article>
    </Layout>
  );
}
```

### 3.2. 一覧表示UIの更新 (`src/features/KnowledgeListFeature.tsx`)

- **ファイル:** `src/features/KnowledgeListFeature.tsx`
- **やること:**
    - 各ナレッジのタイトルに詳細ページへのリンクを追加する。

```typescript
// src/features/KnowledgeListFeature.tsx

// ... (importなどは省略)

export function KnowledgeListFeature({ userId, knowledges }: Props) {
  return (
    <Layout title="ナレッジ一覧">
      {/* ... (pタグなどは省略) */}
      {knowledges.length ? (
        <ul>
          {knowledges.map((knowledge) => (
            <li key={knowledge.knowledgeId}>
              <a href={`/knowledges/${knowledge.knowledgeId}`} class="text-blue-500 hover:underline">
                {knowledge.title}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        // ... (省略)
      )}
    </Layout>
  );
}
```

---

## 4. リポジトリの更新 (`src/models/knowledge.repository.ts`)

次に、`knowledgeId` を使って単一のナレッジを取得するメソッドを `KnowledgeRepository` に実装します。

- **ファイル:** `src/models/knowledge.repository.ts`
- **やること:**
    - `getByKnowledgeId` の実装を、ファイルシステムからデータを読み込む処理に置き換える。
    - ファイルが存在しない場合は `null` を返す。

```typescript
// src/models/knowledge.repository.ts

import { readFile, writeFile, glob } from 'node:fs/promises';
import type { Knowledge } from './knowledge.model.js';

// ... (getAll, upsert は省略)

async function getByKnowledgeId(knowledgeId: string): Promise<Knowledge | null> {
  const filePath = `./storage/${knowledgeId}.json`;
  try {
    const fileContent = await readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // ファイルが存在しないなどのエラーの場合は null を返す
    return null;
  }
}

export const KnowledgeRepository = {
  getByKnowledgeId,
  // ... (他のメソッド)
};
```

---

## 5. テストの作成 (`src/models/knowledge.repository.test.ts`)

最後に、`getByKnowledgeId` メソッドが正しく動作することを保証するための単体テストを作成します。

- **ファイル:** `src/models/knowledge.repository.test.ts`
- **やること:**
    - `fs/promises` をモックし、`getByKnowledgeId` のテストケースを追加する。
    - ナレッジが取得できる場合と、できない場合 (nullが返る) の両方をテストする。

```typescript
// src/models/knowledge.repository.test.ts

import { vi, describe, it, expect, beforeEach } from 'vitest';
import { KnowledgeRepository } from './knowledge.repository.js';
import type { Knowledge } from './knowledge.model.js';

// fs/promises をモックする
vi.mock('node:fs/promises', async (importOriginal) => {
  const original = await importOriginal<typeof import('node:fs/promises')>();
  return {
    ...original,
    readFile: vi.fn(),
  };
});

// モックされた readFile をインポート
import { readFile } from 'node:fs/promises';

describe('KnowledgeRepository', () => {
  // ... (既存のテストは省略)

  describe('getByKnowledgeId', () => {
    it('指定したIDのナレッジが取得できる', async () => {
      const mockKnowledge: Knowledge = {
        __tag: 'Knowledge',
        knowledgeId: 'test-id',
        title: 'Test Title',
        content: 'Test Content',
        authorId: 'test-author',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      vi.mocked(readFile).mockResolvedValue(JSON.stringify(mockKnowledge));

      const knowledge = await KnowledgeRepository.getByKnowledgeId('test-id');
      expect(readFile).toHaveBeenCalledWith('./storage/test-id.json', 'utf-8');
      expect(knowledge).toEqual(mockKnowledge);
    });

    it('ナレッジが存在しない場合は null を返す', async () => {
      vi.mocked(readFile).mockRejectedValue(new Error('File not found'));

      const knowledge = await KnowledgeRepository.getByKnowledgeId('not-found-id');
      expect(knowledge).toBeNull();
    });
  });
});
```