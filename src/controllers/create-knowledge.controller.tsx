import { CreateKnowledgeFeature } from '../features/CreateKnowledgeFeature.js';
import { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export function createKnowledgeController() {
  return <CreateKnowledgeFeature />;
}

export async function saveKnowledgeController(content: string, authorId: string): Promise<void> {
  const knowledge = Knowledge.create(content, authorId);
  await KnowledgeRepository.upsert(knowledge);
}
