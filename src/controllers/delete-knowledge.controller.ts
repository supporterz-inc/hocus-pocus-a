import { KnowledgeRepository } from '../models/knowledge.repository.js';
import type { HonoContext } from '../router.js';

export async function deleteKnowledgeController(c: HonoContext) {
  const { knowledgeId } = c.req.param();

  if (!knowledgeId) {
    return c.text('Knowledge ID is required', 400);
  }

  try {
    await KnowledgeRepository.deleteByKnowledgeId(knowledgeId);
    return c.redirect('/'); // 削除後、トップページにリダイレクト
  } catch (error) {
    console.error('Failed to delete knowledge:', error);
    return c.text('Failed to delete knowledge', 500);
  }
}
