import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface Props {
  userName: string;
  knowledges: Knowledge[];
}

export function KnowledgeListFeature({ userName, knowledges }: Props) {
  return (
    <Layout title="ナレッジ一覧">
      <p>
        こんにちは <span class="text-blue-500 font-bold">{userName}</span> さん
      </p>
      {knowledges.length ? (
        <ul>
          {knowledges.map((knowledge) => (
            <li key={knowledge.knowledgeId}>
              <a class="hover:text-blue-600 hover:underline" href={`/knowledges/${knowledge.knowledgeId}`}>
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
