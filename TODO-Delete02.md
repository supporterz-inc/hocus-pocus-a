`TODO-Delete02.md` を作成しました。以下に、ナレッジ削除機能を実装するためのコードを示します。

### 1. `src/models/knowledge.repository.ts` の更新

`deleteByKnowledgeId` 関数を実装し、`fs/promises` から `rm` をインポートします。

```typescript
import { glob, readFile, writeFile, rm } from 'node:fs/promises';
import type { Knowledge } from './knowledge.model.js';

async function getAll(): Promise<Knowledge[]> {
  const files = await Array.fromAsync(glob('./storage/**/*.json'));

  const knowledges = await Promise.all(files.map((file) => readFile(file, 'utf-8').then(JSON.parse)));

  return knowledges;
}

// TODO: エントリが存在すれば更新、なければ作成の処理をする
async function upsert(knowledge: Knowledge): Promise<void> {
  const filePath = `./storage/${knowledge.knowledgeId}.json`;
  await writeFile(filePath, JSON.stringify(knowledge, null, 2), 'utf-8');
}

/**
 * knowledgeId から Knowledge を取得する
 * @param knowledgeId
 * @returns Knowledge or null (not found)
 */
async function getByKnowledgeId(knowledgeId: string): Promise<Knowledge | null> {
  const filePath = `./storage/${knowledgeId}.json`;
  const rawData = await readFile(filePath, 'utf-8').catch(() => null);

  if (!rawData) {
    return null;
  }

  const knowledge: Knowledge = JSON.parse(rawData);
  return knowledge;
}

async function deleteByKnowledgeId(knowledgeId: string): Promise<void> {
  const filePath = `./storage/${knowledgeId}.json`;
  await rm(filePath).catch((err) => {
    // ファイルが存在しない場合はエラーを無視する
    if (err.code !== 'ENOENT') {
      throw err;
    }
  });
}

export const KnowledgeRepository = {
  getByKnowledgeId,

  // biome-ignore lint/suspicious/noExplicitAny: TODO: (学生向け) 実装する
  getByAuthorId: (_: string): Promise<Knowledge[]> => undefined as any,

  getAll,

  upsert,

  deleteByKnowledgeId,
};
```

### 2. `src/models/knowledge.model.test.ts` の更新

`deleteByKnowledgeId` のテストを追記します。

```typescript
import { describe, expect, it } from 'vitest';
import { Knowledge } from './knowledge.model.js';
import { KnowledgeRepository } from './knowledge.repository.js';
import { access } from 'node:fs/promises';

describe('Create Knowledge', () => {
  it('Knowledge が作成できる', () => {
    const content = 'This is a test content.';
    const authorId = 'test-author';
    const title = 'test-title';
    const knowledge = Knowledge.create(content, authorId, title);

    expect(knowledge.content).toBe(content);
    expect(knowledge.authorId).toBe(authorId);
    expect(knowledge.title).toBe(title);
    expect(knowledge.createdAt).toEqual(knowledge.updatedAt);
  });
});

describe('Update Knowledge', () => {
  it('Knowledge が更新できる', () => {
    const original = Knowledge.create('This is an original content', 'test-author', 'test-title');
    const content = 'This is an updated content.';

    setTimeout(() => {
      const updated = Knowledge.update(original, content);

      expect(updated.knowledgeId).toBe(original.knowledgeId);
      expect(updated.content).toBe(content);
      expect(updated.authorId).toBe(original.authorId);
      expect(updated.createdAt).toEqual(original.createdAt);
      expect(updated.updatedAt).toBeGreaterThan(original.updatedAt);
    }, 100);
  });
});

describe('deleteByKnowledgeId', () => {
  it('ナレッジが削除できる', async () => {
    // 1. テスト用のナレッジを作成・保存
    const knowledge = Knowledge.create('delete test', 'test-author', 'delete test title');
    await KnowledgeRepository.upsert(knowledge);

    // 2. ファイルが存在することを確認
    await expect(access(`./storage/${knowledge.knowledgeId}.json`)).resolves.toBeUndefined();

    // 3. ナレッジを削除
    await KnowledgeRepository.deleteByKnowledgeId(knowledge.knowledgeId);

    // 4. ファイルが存在しないことを確認
    await expect(access(`./storage/${knowledge.knowledgeId}.json`)).rejects.toThrow();
  });
});
```

### 3. `src/features/KnowledgeDetailFeature.tsx` の更新

詳細ページに削除ボタンを追加します。

```typescript
import { raw } from 'hono/html';
import { marked } from 'marked';
import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface Props {
  knowledge: Knowledge;
}

export async function KnowledgeDetailFeature({ knowledge }: Props) {
  console.log(knowledge);

  console.log('a');
  if (!knowledge) {
    return <div>ナレッジが見つかりません。</div>;
  }

  if (
    !knowledge.content ||
    typeof knowledge.content !== 'string' ||
    !knowledge.title ||
    typeof knowledge.title !== 'string' ||
    !knowledge.authorId ||
    typeof knowledge.authorId !== 'string' ||
    !knowledge.updatedAt ||
    typeof knowledge.updatedAt !== 'number'
  ) {
    return <div>ナレッジのデータが不正です。</div>;
  }

  const html = await marked.parse(knowledge.content, { gfm: true, breaks: true });

  return (
    <Layout title={knowledge.title}>
      <article class="space-y-4">
        <h1 class="text-2xl font-bold">{knowledge.title}</h1>
        <div class="prose">{raw(html)}</div>
        <p class="text-sm text-gray-500">
          作成者: {knowledge.authorId} | 最終更新: {new Date(knowledge.updatedAt * 1000).toLocaleString()}
        </p>

        <div class="flex items-center space-x-4">
          <a class="text-blue-500 hover:underline" href="/">
            一覧に戻る
          </a>

          <form action={`/knowledges/${knowledge.knowledgeId}/delete`} method="post">
            <button class="text-red-500 hover:underline" type="submit">
              削除する
            </button>
          </form>
        </div>
      </article>
    </Layout>
  );
}
```

### 4. `src/controllers/delete-knowledge.controller.ts` の作成

ナレッジを削除するためのコントローラーを新規に作成します。

```typescript
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function deleteKnowledgeController(knowledgeId: string) {
  await KnowledgeRepository.deleteByKnowledgeId(knowledgeId);
}
```

### 5. `src/router.ts` の更新

削除処理のためのルーティングを追加します。

```typescript
import { Hono } from 'hono';
import { createKnowledgeController } from './controllers/create-knowledge.controller.js';
import { deleteKnowledgeController } from './controllers/delete-knowledge.controller.js';
import { getAllKnowledgesController } from './controllers/get-all-knowledges.controller.js';
import { getKnowledgeByIdController } from './controllers/get-knowledge-by-id.controler.js';
import { getNewKnowledgeController } from './controllers/get-new-knowledge.controller.js';

export interface Variables {
  userId: string;
}

export const router = new Hono<{ Variables: Variables }>();

router.get('/', (ctx) => {
  // MEMO: `ctx.get('userId')` によって、必要に応じて UserID を利用できる
  const userId = ctx.get('userId');
  console.log('Signed-in :', userId);

  // MEMO: Controller は Context を直接受け取らず、必要な情報のみを引数に受け取る
  return ctx.html(getAllKnowledgesController(userId));
});

// ナレッジ作成フォームの表示
router.get('/knowledges/new', (ctx) => {
  // 作成フォームのUIを返すコントローラーを呼び出す
  return ctx.html(getNewKnowledgeController());
});

// ナレッジの作成
router.post('/knowledges', async (ctx) => {
  // フォームデータ (Markdown本文) を取得
  const formData = await ctx.req.formData();
  const content = formData.get('content');

  if (typeof content !== 'string') {
    return ctx.text('Invalid content', 400);
  }

  // 認証ユーザーのIDを取得
  const authorId = ctx.get('userId');

  //ナレッジのタイトルを取得
  const title = formData.get('title');

  if (typeof title !== 'string') {
    return ctx.text('Invalid title', 400);
  }

  // ナレッジを作成するコントローラーを呼び出す
  await createKnowledgeController(content, authorId, title);

  // トップページにリダイレクト
  return ctx.redirect('/');
});

// ナレッジ詳細表示のページを表示する
router.get('/knowledges/:knowledgeId', async (ctx) => {
  const { knowledgeId } = ctx.req.param();
  console.log(knowledgeId);
  return ctx.html(await getKnowledgeByIdController(knowledgeId));
});

// ナレッジの削除
router.post('/knowledges/:knowledgeId/delete', async (ctx) => {
  const { knowledgeId } = ctx.req.param();
  await deleteKnowledgeController(knowledgeId);

  return ctx.redirect('/');
});
```