import { KnowledgeDetailFeature } from '../features/KnowledgeDetailFeature.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function getKnowledgeByIdController(knowledgeId: string) {
  const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);
  if (knowledge == null) return <div>Not Found</div>;
  return <KnowledgeDetailFeature knowledge={knowledge} />;
}
