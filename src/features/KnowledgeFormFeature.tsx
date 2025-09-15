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
      <div class="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
        <form action={postPath} class="space-y-4" method="post">
          <div>
            <label class="block text-sm font-medium text-gray-700" for="title">
              タイトル
            </label>
            <div class="mt-1">
              <input
                class="block w-full rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              本文（Markdown）
            </label>
            <div class="mt-1">
              <textarea
                class="block w-full rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

          <div class="flex items-center gap-2">
            <button class="btn btn-primary" type="submit">
              {isUpdate ? '更新する' : '投稿する'}
            </button>
            <a class="btn btn-ghost" href={isUpdate ? `/knowledges/${knowledgeId}` : '/'}>
              キャンセル
            </a>
          </div>
        </form>
      </div>
    </Layout>
  );
}
