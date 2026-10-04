import { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function createKnowledgeController(title: string, content: string, authorId: string) {
  const knowledge = Knowledge.create(title, content, authorId);

  await KnowledgeRepository.upsert(knowledge);
}
