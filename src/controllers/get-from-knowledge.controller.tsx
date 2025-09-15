import { KnowledgeFormFeature } from '../features/KnowledgeFormFeature.js';
import type { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function getNewKnowledgeController() {
  return <KnowledgeFormFeature />;
}

export async function getUpdateKnowledgeController(knowledgeId: Knowledge['knowledgeId']) {
  const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);
  if (knowledge === null) {
    // TODO: エラーページを返す
    return <div>{knowledgeId} Not Found</div>;
  }

  return <KnowledgeFormFeature content={knowledge.content} knowledgeId={knowledgeId} title={knowledge.title} />;
}
