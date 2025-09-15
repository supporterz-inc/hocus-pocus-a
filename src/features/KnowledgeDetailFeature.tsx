import { raw } from 'hono/html';
import { marked } from 'marked';
import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface Props {
  knowledge: Knowledge;
}

export async function KnowledgeDetailFeature({ knowledge }: Props) {
  if (!knowledge) {
    return <div>ナレッジが見つかりません。</div>;
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

          <a class="text-blue-500 hover:underline" href={`/knowledges/${knowledge.knowledgeId}/edit`}>
            編集する
          </a>

          <form
            action={`/knowledges/${knowledge.knowledgeId}/delete`}
            method="post"
            onsubmit="return window.confirm('本当に削除しますか？');"
          >
            <button class="text-red-500 hover:underline" type="submit">
              削除する
            </button>
          </form>
        </div>
      </article>
    </Layout>
  );
}
