import { DetailKnowledgeFeature } from '../features/DetailKnowledgeFeature.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function detailKnowledgeController(knowledgeId: string) {
  const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);
  return <DetailKnowledgeFeature knowledge={knowledge} />;
}
