import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface Props {
  knowledge: Knowledge;
}

export function EditKnowledgeFeature({ knowledge }: Props) {
  return (
    <Layout title="ナレッジ編集">
      <h1 class="text-2xl font-bold mb-4">ナレッジを編集</h1>
      <form action="/edit" method="post">
        <input name="knowledgeId" type="hidden" value={knowledge.knowledgeId} />

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700" for="content">
            本文
          </label>
          <textarea
            aria-label="編集するナレッジ本文"
            class="w-full border border-gray-300 rounded-md p-3 mt-1 bg-white text-sm resize-y min-h-[10rem] focus:outline-none focus:ring-2 focus:ring-blue-300"
            id="content"
            name="content"
            rows={12}
          >
            {knowledge.content}
          </textarea>
        </div>

        <button class="px-4 py-2 bg-blue-500 text-white rounded" type="submit">
          保存する
        </button>
      </form>
    </Layout>
  );
}
