import { Layout } from './Layout.js';

export function NewKnowledgeFeature() {
  return (
    <Layout title="ナレッジを新規作成">
      <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
            <div class="mb-6 text-center">
              <h1 class="text-2xl font-bold text-gray-900">ナレッジを新規作成</h1>
            </div>
            <form action="/articles" method="post">
              <div>
                <label class="block text-sm font-medium text-gray-700" for="title">
                  タイトル
                </label>
                <div class="mt-1">
                  <input
                    class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    id="title"
                    name="title"
                    required
                    type="text"
                  />
                </div>
              </div>

              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700" for="content">
                  本文 (Markdown)
                </label>
                <div class="mt-1">
                  <textarea
                    class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    id="content"
                    name="content"
                    required
                    //rows="15"
                  ></textarea>
                </div>
              </div>

              <div class="mt-8">
                <button
                  class="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  type="submit"
                >
                  投稿する
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
