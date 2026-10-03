import { KnowledgeDetailFeature, KnowledgeListFeature } from '../features/KnowledgeFeature.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function getAllKnowledgesController(userName: string) {
  const knowledges = await KnowledgeRepository.getAll();

  return <KnowledgeListFeature knowledges={knowledges} userName={userName} />;
}

export async function getKnowledgeDetailController(shortId: string) {
  const knowledge = await KnowledgeRepository.getByShortId(shortId);

  return knowledge && <KnowledgeDetailFeature knowledge={knowledge} />;
}
