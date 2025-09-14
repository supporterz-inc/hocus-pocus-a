import { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function createKnowledgeController(content: string, authorId: string) {
  // 1. ドメインモデルを生成する
  const knowledge = Knowledge.create(content, authorId);

  // 2. リポジトリに永続化する
  await KnowledgeRepository.upsert(knowledge);
}
