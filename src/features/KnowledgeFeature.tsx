import { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface ListProps {
  userName: string;
  knowledges: Knowledge[];
}

export function KnowledgeListFeature({ userName, knowledges }: ListProps) {
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
            <li key={knowledge.knowledgeId}>
              <a class="text-blue-600 underline" href={`/knowledges/${Knowledge.toShortId(knowledge)}`}>
                {Knowledge.toShortId(knowledge)}
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

interface DetailProps {
  knowledge: Knowledge;
}

function formatDate(unixTime: number): string {
  return new Date(unixTime * 1000).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
}

export function KnowledgeDetailFeature({ knowledge }: DetailProps) {
  return (
    <Layout title="ナレッジ詳細">
      <a class="text-blue-600 underline" href="/">
        ← 一覧に戻る
      </a>

      <dl class="my-4 text-sm text-gray-600">
        <dt>作成者</dt>
        <dd>{knowledge.authorId}</dd>
        <dt>作成日時</dt>
        <dd>{formatDate(knowledge.createdAt)}</dd>
        <dt>更新日時</dt>
        <dd>{formatDate(knowledge.updatedAt)}</dd>
      </dl>

      <div class="whitespace-pre-wrap wrap-break-word border rounded p-2">{knowledge.content}</div>
    </Layout>
  );
}
