import { Layout } from './Layout.js';

const previewScript = `
import { marked } from '/vendor/marked.js';
import DOMPurify from '/vendor/purify.js';

const source = document.getElementById('markdown-content');
const preview = document.getElementById('preview');

source.addEventListener('input', () => {
  preview.innerHTML = DOMPurify.sanitize(marked.parse(source.value),);
});
`;

const previewTypography = [
  '[&_h1]:text-xl [&_h1]:font-bold',
  '[&_h2]:text-base [&_h2]:font-bold',
  '[&_p]:my-2xs',
  '[&_ul]:list-disc [&_ul]:pl-s',
  '[&_ol]:list-decimal [&_ol]:pl-s',
  '[&_a]:text-blue-500 [&_a]:underline',
  '[&_code]:rounded-sm [&_code]:bg-gray-200 [&_code]:px-3xs',
].join(' ');

export function CreateKnowledgeFeature() {
  return (
    <Layout title="ナレッジ作成">
      <div class="flex flex-col gap-m p-s">
        <header class="flex items-baseline justify-between">
          <h1 class="text-xl font-bold text-gray-900">ナレッジ作成</h1>
          <a class="text-xs text-blue-500" href="/">
            一覧へ
          </a>
        </header>

        <form action="/new" class="flex flex-col gap-m" method="post">
          <div class="flex flex-col gap-3xs">
            <label class="text-xs font-bold text-gray-600" htmlFor="markdown-content">
              Markdown
            </label>
            <textarea
              class="w-full resize-y rounded-lg border border-gray-300 bg-white p-2xs text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
              id="markdown-content"
              name="content"
              rows={10}
            />
          </div>

          <div class="flex flex-col gap-3xs">
            <p class="text-xs font-bold text-gray-600">プレビュー</p>
            <div
              class={`min-h-[120px] rounded-lg border border-gray-300 bg-gray-100 p-2xs text-sm text-gray-900 ${previewTypography}`}
              id="preview"
            />
          </div>

          <button
            class="w-full rounded-lg bg-blue-500 py-2xs text-base font-bold text-white active:bg-blue-500/80 hover:text-amber-50"
            type="submit"
          >
            投稿する
          </button>
        </form>
      </div>

      <script dangerouslySetInnerHTML={{ __html: previewScript }} type="module" />
    </Layout>
  );
}
