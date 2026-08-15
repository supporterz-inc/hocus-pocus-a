import { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function createKnowledgeController(content: string, userId: string) {
  const knowledge = Knowledge.create(content, userId);

  await KnowledgeRepository.upsert(knowledge);

  return knowledge;
}
