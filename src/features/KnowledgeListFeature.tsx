import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface Props {
  userId: string;
  knowledges: Knowledge[];
}

export function KnowledgeListFeature({ userId, knowledges }: Props) {
  return (
    <Layout title="ナレッジ一覧">
      <section class="space-y-4">
        <div class="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
          <p class="text-sm text-gray-700">
            こんにちは <span class="text-blue-500 font-bold">{userId}</span> さん
          </p>
        </div>

        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold">ナレッジ一覧</h1>
          <a class="btn btn-primary" href="/knowledges/new">
            新規作成
          </a>
        </div>

        {knowledges.length ? (
          <ul class="grid grid-cols-1 gap-3">
            {knowledges.map((knowledge) => (
              <li key={knowledge.knowledgeId}>
                <a
                  class="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  href={`/knowledges/${knowledge.knowledgeId}`}
                >
                  <div class="flex items-start justify-between gap-3">
                    <h2 class="font-semibold text-gray-900 line-clamp-2">{knowledge.title}</h2>
                    <span class="shrink-0 text-blue-500">→</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div class="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-600">
            投稿済みのナレッジは 0 件です。右上の「新規作成」から投稿しましょう。
          </div>
        )}
      </section>
    </Layout>
  );
}
