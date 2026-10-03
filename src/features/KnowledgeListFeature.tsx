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
        こんにちは <span class="text-red-500 font-bold">{userName}</span> さん
      </p>

      <form action="/knowledges" class="my-4" method="post">
        <textarea
          class="w-full border rounded p-2"
          name="content"
          placeholder="Markdown でナレッジを記述"
          required
          rows={6}
        />
        <button class="mt-2 px-4 py-2 rounded bg-blue-500 text-white" type="submit">
          投稿する
        </button>
      </form>

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
    </Layout>
  );
}
