import { KnowledgeRepository } from "../models/knowledge.repository.js";
import { KnowledgeDetailFeature } from "../features/KnowledgeDetailFeature.js";


export async function getKnowledgeByIdController(knowledgeId: string) {
  const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);
  if (knowledge !== null) {
    return <KnowledgeDetailFeature knowledge={knowledge} />;
  } else {
    // TODO: エラーページを返す
    return ""
  }
}
