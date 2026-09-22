import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface Props {
  knowledge: Knowledge;
}

export function DetailKnowledgeFeature({ knowledge }: Props) {
  return (
    <Layout title="ナレッジ詳細表示">
      <p>テスト</p>
      <h1>{knowledge.content}</h1>
    </Layout>
  );
}
