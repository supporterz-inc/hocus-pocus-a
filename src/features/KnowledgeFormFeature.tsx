import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

export interface KnowledgeFormFeatureProps {
  title?: Knowledge['title'];
  content?: Knowledge['content'];
  knowledgeId?: Knowledge['knowledgeId'];
}

export function KnowledgeFormFeature(props: KnowledgeFormFeatureProps) {
  const { title = '', content = '', knowledgeId } = props;
  const isUpdate = knowledgeId !== undefined;

  const postPath = isUpdate ? `/knowledges/${knowledgeId}` : '/knowledges';

  return (
    <Layout title={isUpdate ? 'ナレッジ編集' : 'ナレッジ投稿'}>
      <form action={postPath} method="post">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700" for="title">
              Title
            </label>
            <div class="mt-1">
              <input
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                id="title"
                name="title"
                placeholder="記事のタイトル"
                required
                type="text"
                value={title}
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700" for="content">
              Markdown
            </label>
            <div class="mt-1">
              <textarea
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                id="content"
                name="content"
                placeholder="記事の内容を Markdown 形式で記述してください"
                required
                rows={15}
              >
                {content}
              </textarea>
            </div>
          </div>

          <div>
            <button
              class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              type="submit"
            >
              {isUpdate ? '更新する' : '投稿する'}
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
