import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface Props {
  userId: string;
  knowledges: Knowledge[];
}

export function KnowledgeListFeature({ userId, knowledges }: Props) {
  return (
    <Layout title="ナレッジ一覧">
      <p>
        こんにちは <span class="text-blue-500 font-bold">{userId}</span> さん
      </p>
      <form action="/" method="post">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700" for="content">
            本文
          </label>
          <textarea
            aria-label="ナレッジ本文"
            class="w-full border border-gray-300 rounded-md p-3 mt-1 bg-white text-sm resize-y min-h-[10rem] focus:outline-none focus:ring-2 focus:ring-blue-300"
            id="content"
            name="content"
            placeholder="Markdownでナレッジを記述してください。例: 見出し、コードブロック、箇条書きなど"
            rows={8}
          />
        </div>
        <button class="px-4 py-2 bg-blue-500 text-white rounded" type="submit">
          ナレッジを投稿する
        </button>
      </form>
      <section class="mt-8 p-4 border border-gray-200 rounded-md bg-slate-50">
        <p class="text-sm text-gray-600 mb-4">編集したいナレッジの ID を入力して、編集ページに移動してください。</p>
        <form action="/edit" class="flex flex-col gap-3" method="get">
          <input
            aria-label="編集する knowledgeId"
            class="w-full border border-gray-300 rounded-md px-4 py-3 bg-white text-base focus:outline-none focus:ring-2 focus:ring-yellow-300"
            name="knowledgeId"
            placeholder="編集したいナレッジの ID を入力"
            type="text"
          />
          <button
            class="w-full px-5 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors duration-150"
            type="submit"
          >
            ナレッジを編集する
          </button>
        </form>
      </section>
      {knowledges.length ? (
        <ul>
          {knowledges.map((knowledge) => (
            <li key={knowledge.knowledgeId}>
              <a class="text-blue-600 underline" href={`/${knowledge.knowledgeId}`}>
                {knowledge.knowledgeId}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <ul>
          <li>投稿済みのナレッジは 0 件です</li>
        </ul>
      )}
    </Layout>
  );
}
