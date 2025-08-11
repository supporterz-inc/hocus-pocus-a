import { HTTPException } from 'hono/http-exception';
import { EditKnowledgeFeature } from '../features/EditKnowledgeFeature.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';
import type { HonoContext } from '../router.js';

export const getEditKnowledgePageController = async (c: HonoContext) => {
  const { knowledgeId } = c.req.param();
  const userId = c.get('userId'); // 現在ログインしているユーザーのIDを取得

  if (!knowledgeId) {
    // knowledgeId が取得できなければ 400 Bad Request エラーを返す
    throw new HTTPException(400, { message: 'knowledgeId is required' });
  }

  if (!userId) {
    return c.text('Unauthorized', 401); // ユーザーが認証されていない場合
  }

  const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);

  if (!knowledge) {
    throw new HTTPException(404, { message: 'Not Found' });
  }

  if (knowledge.authorId !== userId) {
    return c.text('Forbidden: You are not the author of this knowledge', 403);
  }

  return c.html(<EditKnowledgeFeature knowledge={knowledge} />);
};
