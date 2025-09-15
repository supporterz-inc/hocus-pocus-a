import { KnowledgeDetailFeature } from '../features/KnowledgeDetailFeature.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function getKnowledgeByIdController(knowledgeId: string) {
  console.log('b');

  const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);
  if (knowledge !== null) {
    return <KnowledgeDetailFeature knowledge={knowledge} />;
  } else {
    // TODO: エラーページを返す
    return <div>Not Found</div>;
  }
}
