import { KnowledgeDetailFeature, KnowledgeListFeature } from '../features/KnowledgeFeature.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function getAllKnowledgesController(userId: string, userName: string) {
  const knowledges = await KnowledgeRepository.getAll();

  return <KnowledgeListFeature knowledges={knowledges} userId={userId} userName={userName} />;
}

export async function getKnowledgeDetailController(knowledgeId: string, userId: string) {
  const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);

  return knowledge && <KnowledgeDetailFeature knowledge={knowledge} userId={userId} />;
}
