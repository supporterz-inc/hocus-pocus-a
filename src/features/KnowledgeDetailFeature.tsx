import { Knowledge } from "../models/knowledge.model.js";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Layout } from "./Layout.js";

interface Props {
  knowledge: Knowledge;
}



async function ParseAndSanitizeMarkdown(markdown: string) {
  const untrustHtml = await marked.parse(markdown);
  const sanitizedHtml = DOMPurify.sanitize(untrustHtml);
  return <div class="prose" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}

export async function KnowledgeDetailFeature({ knowledge }: Props) {
  // Markdown を HTML に変換してサニタイズ
  const ParsedMarkdown = await ParseAndSanitizeMarkdown(knowledge.content);

  return (
    <Layout title={knowledge.title}>
      <article class="space-y-4">
        <h1 class="text-2xl font-bold">{knowledge.title}</h1>
        {ParsedMarkdown}
        <div class="prose">
          <pre>{knowledge.content}</pre>
        </div>
        <p class="text-sm text-gray-500">
          作成者: {knowledge.authorId} | 最終更新: {new Date(knowledge.updatedAt * 1000).toLocaleString()}
        </p>
        <a href="/" class="text-blue-500 hover:underline">一覧に戻る</a>
      </article>
    </Layout>
  )
}
