import { KnowledgeRepository } from '../models/knowledge.repository.js';
import type { HonoContext } from '../router.js';

export async function deleteKnowledgeController(c: HonoContext) {
  const { knowledgeId } = c.req.param();
  const userId = c.get('userId'); // 現在ログインしているユーザーのIDを取得

  if (!knowledgeId) {
    return c.text('Knowledge ID is required', 400);
  }

  if (!userId) {
    return c.text('Unauthorized', 401); // ユーザーが認証されていない場合
  }

  try {
    const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);

    if (!knowledge) {
      return c.text('Knowledge not found', 404);
    }

    if (knowledge.authorId !== userId) {
      return c.text('Forbidden: You are not the author of this knowledge', 403);
    }

    await KnowledgeRepository.deleteByKnowledgeId(knowledgeId);
    return c.redirect('/'); // 削除後、トップページにリダイレクト
  } catch (error) {
    console.error('Failed to delete knowledge:', error);
    return c.text('Failed to delete knowledge', 500);
  }
}
