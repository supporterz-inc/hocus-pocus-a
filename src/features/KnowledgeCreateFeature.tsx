import { Layout } from './Layout.js';

interface Props {
  content?: string;
  errorMessage?: string;
}

export function KnowledgeCreateFeature({ errorMessage, content = '' }: Props) {
  return (
    <Layout title="ナレッジ作成">
      <h1>ナレッジ作成</h1>
      {errorMessage && <p>{errorMessage}</p>}
      <form action="/knowledges" method="post">
        <label for="content">本文 (Markdown)</label>
        <textarea id="content" name="content" required>
          {content}
        </textarea>
        <button type="submit">作成する</button>
      </form>
      <p class="mt-4">
        <a href="/">一覧へ戻る</a>
      </p>
    </Layout>
  );
}
