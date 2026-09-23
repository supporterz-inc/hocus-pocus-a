import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface Props {
  userName: string;
  knowledges: Knowledge[];
}

export function KnowledgeListFeature({ userName, knowledges }: Props) {
  return (
    <Layout title="ナレッジ一覧">
      <div class="flex flex-col gap-m p-s">
        <header class="flex items-baseline justify-between">
          <h1 class="text-xl font-bold text-gray-900">ナレッジ一覧</h1>
          <a class="text-xs text-blue-500 hover:text-blue-600" href="/new">
            ナレッジ作成
          </a>
        </header>
        <p>
          こんにちは <span class="text-blue-500 font-bold">{userName}</span> さん
        </p>
        {knowledges.length ? (
          <ul>
            {knowledges.map((knowledge) => (
              <li key={knowledge.knowledgeId}>{knowledge.knowledgeId}</li>
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
