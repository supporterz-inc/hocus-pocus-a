import { EditKnowledgeFeature } from '../features/EditKnowledgeFeature.js';
import type { Knowledge } from '../models/knowledge.model.js';

export function getEditKnowledgeController(knowledge: Knowledge) {
  return <EditKnowledgeFeature knowledge={knowledge} />;
}
