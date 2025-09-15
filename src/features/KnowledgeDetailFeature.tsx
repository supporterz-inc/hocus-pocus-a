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
        <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h1 class="text-2xl font-bold mb-2">{knowledge.title}</h1>
          <p class="text-xs text-gray-600 mb-4">
            作成者: {knowledge.authorId} ・ 最終更新: {new Date(knowledge.updatedAt * 1000).toLocaleString()}
          </p>
          <div class="markdown">{raw(html)}</div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <a class="btn btn-ghost" href="/">
            一覧に戻る
          </a>

          <a class="btn btn-primary" href={`/knowledges/${knowledge.knowledgeId}/edit`}>
            編集する
          </a>

          <form
            action={`/knowledges/${knowledge.knowledgeId}/delete`}
            method="post"
            onsubmit="return window.confirm('本当に削除しますか？');"
          >
            <button class="btn btn-danger" type="submit">
              削除する
            </button>
          </form>
        </div>
      </article>
    </Layout>
  );
}
