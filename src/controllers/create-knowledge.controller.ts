import { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function createKnowledgeController(content: string, authorId: string, title: string): Promise<void> {
  // 1. ドメインモデルを生成する
  const knowledge = Knowledge.create(content, authorId, title);

  // 2. リポジトリに永続化する
  await KnowledgeRepository.upsert(knowledge);
}
