import { HTTPException } from 'hono/http-exception';
import { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';
import type { HonoContext } from '../router.js';

export const patchKnowledgeController = async (c: HonoContext) => {
  // 1. パラメータとリクエストボディを取得する
  const { knowledgeId } = c.req.param();
  const body = await c.req.parseBody();
  const content = String(body['content']);

  if (!knowledgeId) {
    // knowledgeId が取得できなければ 400 Bad Request エラーを返す
    throw new HTTPException(400, { message: 'knowledgeId is required' });
  }

  // 2. 更新対象のナレッジを取得する
  const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);
  if (!knowledge) {
    throw new HTTPException(404, { message: 'Not Found' });
  }

  // 認可チェック: リクエスト元のユーザーがナレッジの作成者であるかを確認する
  const userId = c.get('userId');
  if (knowledge.authorId !== userId) {
    throw new HTTPException(403, { message: 'Forbidden' });
  }

  // 3. ナレッジを更新して永続化する
  const updatedKnowledge = Knowledge.update(knowledge, content);
  await KnowledgeRepository.upsert(updatedKnowledge);

  // 4. トップページにリダイレクトする
  return c.redirect('/');
};
