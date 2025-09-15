import { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function updateKnowledgeController(
  content: Knowledge['content'],
  title: Knowledge['title'],
  knowledgeId: Knowledge['knowledgeId'],
): Promise<void> {
  // 1. ドメインモデルを生成する
  const oldKnowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);
  if (oldKnowledge === null) {
    throw new Error(`Knowledge with ID ${knowledgeId} not found`);
  }
  const newKnowledge = Knowledge.update(oldKnowledge, title, content);

  // 2. リポジトリに永続化する
  await KnowledgeRepository.upsert(newKnowledge);
}
