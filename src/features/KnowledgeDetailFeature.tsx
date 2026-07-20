import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface Props {
  userId: string;
  knowledge: Knowledge | null;
}

function renderInlineContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code class="rounded bg-gray-100 px-1 py-0.5 text-sm text-red-600" key={`${part}-${index}`}>
          {part.slice(1, -1)}
        </code>
      );
    }

    return <>{part}</>;
  });
}

function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function renderMarkdownContent(content: string) {
  const lines = content.split(/\r?\n/);
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const currentLine = lines[index];
    const line = currentLine?.trim() ?? '';

    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith('```')) {
      const codeLines = [];
      index += 1;

      while (index < lines.length && !(lines[index]?.trim() ?? '').startsWith('```')) {
        codeLines.push(lines[index] ?? '');
        index += 1;
      }

      blocks.push(
        <pre class="mt-4 overflow-x-auto rounded-md bg-gray-900 p-4 text-sm text-gray-100">
          <code>{codeLines.join('\n')}</code>
        </pre>,
      );
      index += 1;
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const headingMarker = headingMatch[1] ?? '';
      const level = headingMarker.length;
      const text = headingMatch[2] ?? '';
      const headingClass =
        level === 1
          ? 'mt-6 text-2xl font-bold'
          : level === 2
            ? 'mt-5 text-xl font-semibold'
            : 'mt-4 text-lg font-semibold';
      const headingText = text ?? '';

      blocks.push(<h1 class={headingClass}>{renderInlineContent(headingText)}</h1>);
      index += 1;
      continue;
    }

    const unorderedMatch = line.match(/^([-*])\s+(.*)$/);
    if (unorderedMatch) {
      const items = [];
      while (index < lines.length && (lines[index]?.trim() ?? '').match(/^[-*]\s+/)) {
        items.push((lines[index]?.trim() ?? '').replace(/^[-*]\s+/, ''));
        index += 1;
      }

      blocks.push(
        <ul class="mt-4 ml-6 list-disc space-y-2">
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderInlineContent(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    const orderedMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (orderedMatch) {
      const items = [];
      while (index < lines.length && (lines[index]?.trim() ?? '').match(/^\d+\.\s+/)) {
        items.push((lines[index]?.trim() ?? '').replace(/^\d+\.\s+/, ''));
        index += 1;
      }

      blocks.push(
        <ol class="mt-4 ml-6 list-decimal space-y-2">
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderInlineContent(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    const paragraphLines = [];
    while (
      index < lines.length &&
      (lines[index]?.trim() ?? '') !== '' &&
      !(lines[index]?.trim() ?? '').startsWith('```') &&
      !(lines[index]?.trim() ?? '').match(/^(#{1,6})\s+/) &&
      !(lines[index]?.trim() ?? '').match(/^[-*]\s+/) &&
      !(lines[index]?.trim() ?? '').match(/^\d+\.\s+/)
    ) {
      paragraphLines.push(lines[index]?.trim() ?? '');
      index += 1;
    }

    if (paragraphLines.length) {
      blocks.push(<p class="mt-4 leading-7">{renderInlineContent(paragraphLines.join(' '))}</p>);
    }
  }

  return blocks;
}

export function KnowledgeDetailFeature({ userId, knowledge }: Props) {
  return (
    <Layout title={knowledge ? 'ナレッジ詳細' : 'ナレッジが見つかりません'}>
      <p>
        こんにちは <span class="text-blue-500 font-bold">{userId}</span> さん
      </p>

      {knowledge ? (
        <>
          <p class="mt-4 text-sm text-gray-500">作成者: {knowledge.authorId}</p>
          <p class="mt-1 text-sm text-gray-500">作成日時: {formatTimestamp(knowledge.createdAt)}</p>
          <article class="mt-6 rounded-md border border-gray-200 bg-white p-4">
            {renderMarkdownContent(knowledge.content)}
          </article>
          <a class="mt-6 inline-block text-blue-600 underline" href="/">
            一覧に戻る
          </a>
        </>
      ) : (
        <>
          <p class="mt-4">指定されたナレッジは見つかりませんでした。</p>
          <a class="mt-6 inline-block text-blue-600 underline" href="/">
            一覧に戻る
          </a>
        </>
      )}
    </Layout>
  );
}
