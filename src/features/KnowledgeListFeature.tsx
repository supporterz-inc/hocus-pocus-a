import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface Props {
  knowledges: Knowledge[];
}

export function KnowledgeListFeature({ knowledges }: Props) {
  return (
    <Layout title="ナレッジ一覧">
      <div class="p-4">
        <div class="mb-4 flex justify-end">
          <a
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            href="/articles"
          >
            新しく作る
          </a>
        </div>
        {knowledges.length ? (
          <ul>
            {knowledges.map((knowledge) => (
              <li class="border-b border-gray-200 py-4" key={knowledge.knowledgeId}>
                <p class="text-sm text-black-800">{knowledge.content}</p>
                <p class="mt-1 text-gray-400">作成者: {knowledge.authorId}</p>
                <p class="mt-1 text-gray-400">作成日時: {new Date(knowledge.createdAt * 1000).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <ul>
            <li>投稿済みのナレッジは 0 件です</li>
          </ul>
        )}
      </div>
    </Layout>
  );
}
