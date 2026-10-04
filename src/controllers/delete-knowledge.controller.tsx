import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function deleteKnowledgeController(knowledgeId: string, userId: string) {
  const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);

  if (knowledge.authorId !== userId) {
    throw new Error('自分が投稿したナレッジのみ削除できます');
  }

  await KnowledgeRepository.deleteByKnowledgeId(knowledgeId);
}
