import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function deleteKnowledgeController(knowledgeId: string) {
  await KnowledgeRepository.deleteByKnowledgeId(knowledgeId);
}
