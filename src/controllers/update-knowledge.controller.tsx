import { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function updateKnowledgeController(knowledgeId: string, content: string, userId: string) {
  const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);
  if (!knowledge) {
    throw new Error('ナレッジが見つかりません');
  }
  if (knowledge.authorId !== userId) {
    throw new Error('自分が投稿したナレッジのみ削除できます');
  }

  await KnowledgeRepository.upsert(Knowledge.update(knowledge, content));
}
