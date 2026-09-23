import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

const renderScript = `
import { marked } from '/vendor/marked.js';
import DOMPurify from '/vendor/purify.js';

const content = document.getElementById('knowledge-content');
content.innerHTML = DOMPurify.sanitize(marked.parse(content.textContent ?? ''));
content.classList.remove('whitespace-pre-wrap');
`;

const markdownTypography = [
  '[&_h1]:text-xl [&_h1]:font-bold',
  '[&_h2]:text-base [&_h2]:font-bold',
  '[&_p]:my-2xs',
  '[&_ul]:list-disc [&_ul]:pl-s',
  '[&_ol]:list-decimal [&_ol]:pl-s',
  '[&_a]:text-blue-500 [&_a]:underline',
  '[&_code]:rounded-sm [&_code]:bg-gray-200 [&_code]:px-3xs',
].join(' ');

const dateTimeFormatter = new Intl.DateTimeFormat('ja-JP', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Tokyo',
});

function DateTime({ unixSeconds }: { unixSeconds: number }) {
  const date = new Date(unixSeconds * 1000);
  return <time dateTime={date.toISOString()}>{dateTimeFormatter.format(date)}</time>;
}

interface Props {
  knowledge: Knowledge;
  isEditable: boolean;
}

export function DetailKnowledgeFeature({ knowledge, isEditable }: Props) {
  return (
    <Layout title="ナレッジ詳細">
      <div class="flex flex-col gap-m p-s">
        <header class="flex items-baseline justify-between">
          <h1 class="text-xl font-bold text-gray-900">ナレッジ詳細</h1>
          <a class="text-xs text-blue-500 hover:text-blue-600" href="/">
            一覧へ
          </a>
        </header>

        <div class="flex flex-col gap-3xs">
          <p class="text-xs font-bold text-gray-600">本文</p>
          <article
            class={`min-h-[120px] whitespace-pre-wrap rounded-lg border border-gray-300 bg-white p-2xs text-sm text-gray-900 ${markdownTypography}`}
            id="knowledge-content"
          >
            {knowledge.content}
          </article>
        </div>

        <dl class="grid grid-cols-[auto_1fr] gap-x-s gap-y-2xs rounded-lg border border-gray-300 bg-gray-100 p-2xs text-sm">
          <dt class="text-xs font-bold text-gray-600">ナレッジID</dt>
          <dd class="break-all text-gray-900">{knowledge.knowledgeId}</dd>

          <dt class="text-xs font-bold text-gray-600">作成者</dt>
          <dd class="break-all text-gray-900">{knowledge.authorId}</dd>

          <dt class="text-xs font-bold text-gray-600">作成日時</dt>
          <dd class="text-gray-900">
            <DateTime unixSeconds={knowledge.createdAt} />
          </dd>

          <dt class="text-xs font-bold text-gray-600">更新日時</dt>
          <dd class="text-gray-900">
            <DateTime unixSeconds={knowledge.updatedAt} />
          </dd>
        </dl>

        {isEditable && (
          <div class="flex justify-end gap-2xs">
            <a
              class="rounded-md bg-blue-500 px-s py-3xs text-sm font-bold text-white active:bg-blue-500/80 hover:bg-blue-600"
              href={`/knowledges/${knowledge.knowledgeId}/edit`}
            >
              編集
            </a>
          </div>
        )}
      </div>

      <script dangerouslySetInnerHTML={{ __html: renderScript }} type="module" />
    </Layout>
  );
}
