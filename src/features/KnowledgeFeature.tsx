import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface ListProps {
  userId: string;
  userName: string;
  knowledges: Knowledge[];
}

export function KnowledgeListFeature({ userId, userName, knowledges }: ListProps) {
  return (
    <Layout title="ナレッジ一覧">
      <p>
        こんにちは <span class="text-red-500 font-bold">{userName}</span> さん
      </p>

      <form action="/knowledges" class="my-4" method="post">
        <input class="w-full border rounded p-2 mb-2" name="title" placeholder="タイトル" required type="text" />
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
        <ul class="space-y-3">
          {knowledges
            .toSorted((a, b) => a.createdAt - b.createdAt)
            .map((knowledge) => (
              <li class="flex items-center justify-between gap-2 border rounded p-3" key={knowledge.knowledgeId}>
                <a
                  class="min-w-0 flex-1 truncate text-blue-600 underline"
                  href={`/knowledges/${knowledge.knowledgeId}`}
                >
                  {knowledge.title}
                </a>

                {knowledge.authorId === userId && (
                  <a
                    class="px-3 py-1 rounded bg-green-600 text-white text-sm"
                    href={`/knowledges/${knowledge.knowledgeId}`}
                  >
                    更新
                  </a>
                )}
                {knowledge.authorId === userId ? (
                  <form action={`/knowledges/${knowledge.knowledgeId}/delete`} method="post">
                    <button
                      class="px-3 py-1 rounded bg-red-500 text-white text-sm"
                      onclick="return confirm('このナレッジを削除しますか？');"
                      type="submit"
                    >
                      削除
                    </button>
                  </form>
                ) : null}
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
  userId: string;
}

function formatDate(unixTime: number): string {
  return new Date(unixTime * 1000).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
}

export function KnowledgeDetailFeature({ knowledge, userId }: DetailProps) {
  return (
    <Layout title={knowledge.title}>
      <a class="text-blue-600 underline" href="/">
        ← 一覧に戻る
      </a>

      <h1 class="mt-4 text-xl font-bold wrap-break-word">{knowledge.title}</h1>

      <dl class="my-4 text-sm text-gray-600">
        <dt>ID</dt>
        <dd class="font-mono text-gray-800">{knowledge.knowledgeId}</dd>
        <dt>作成者</dt>
        <dd>{knowledge.authorId}</dd>
        <dt>作成日時</dt>
        <dd>{formatDate(knowledge.createdAt)}</dd>
        <dt>更新日時</dt>
        <dd>{formatDate(knowledge.updatedAt)}</dd>
      </dl>

      <div class="whitespace-pre-wrap wrap-break-word border rounded p-2">
        {knowledge.authorId === userId ? (
          <form action={`/knowledges/${knowledge.knowledgeId}/update`} method="post">
            <input
              class="w-full border rounded p-2 mb-2"
              name="title"
              placeholder="タイトル"
              required
              type="text"
              value={knowledge.title}
            />
            <textarea class="w-full border rounded p-2" name="content" required rows={12}>
              {knowledge.content}
            </textarea>
            <button class="mt-2 px-4 py-2 rounded bg-green-600 text-white" type="submit">
              更新する
            </button>
          </form>
        ) : (
          knowledge.content
        )}
      </div>
    </Layout>
  );
}
