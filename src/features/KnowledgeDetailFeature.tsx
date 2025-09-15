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
