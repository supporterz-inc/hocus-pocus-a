import { HTTPException } from 'hono/http-exception';
import { UpdateKnowledgeFeature } from '../features/UpdateKnowledgeFeature.js';
import { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

async function getEditableKnowledge(knowledgeId: string, userId: string): Promise<Knowledge> {
  const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);
  if (!Knowledge.isAuthoredBy(knowledge, userId)) {
    throw new HTTPException(403, { message: '自分が投稿したナレッジのみ編集できます' });
  }

  return knowledge;
}

export async function updateKnowledgeController(knowledgeId: string, userId: string) {
  const knowledge = await getEditableKnowledge(knowledgeId, userId);
  return <UpdateKnowledgeFeature knowledge={knowledge} />;
}

export async function saveUpdatedKnowledgeController(
  knowledgeId: string,
  content: string,
  userId: string,
): Promise<void> {
  const knowledge = await getEditableKnowledge(knowledgeId, userId);
  const updatedKnowledge = Knowledge.update(knowledge, content);
  await KnowledgeRepository.upsert(updatedKnowledge);
}
