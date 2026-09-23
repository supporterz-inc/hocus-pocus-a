import { DetailKnowledgeFeature } from '../features/DetailKnowledgeFeature.js';
import { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function detailKnowledgeController(knowledgeId: string, userId: string) {
  const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);
  const isEditable = Knowledge.isAuthoredBy(knowledge, userId);
  return <DetailKnowledgeFeature isEditable={isEditable} knowledge={knowledge} />;
}
