import { Hono } from 'hono';
import { createKnowledgeController } from './controllers/create-knowledge.controller.js';
import { getAllKnowledgesController, getKnowledgeDetailController } from './controllers/get-knowledges.controller.js';

export interface Variables {
  /**
   * Signed-in User の一意な ID
   */
  userId: string;

  /**
   * Signed-in User の名前 (重複する可能性あり)
   */
  userName: string;
}

export const router = new Hono<{ Variables: Variables }>();

router.get('/', (ctx) => {
  const userId = ctx.get('userId');
  const userName = ctx.get('userName');
  console.log(`Signed-in : ${userName} (${userId})`);
  return ctx.html(getAllKnowledgesController(userName));
});

router.post('/knowledges', async (ctx) => {
  const { content } = await ctx.req.parseBody();

  try {
    if (typeof content !== 'string') throw new Error('本文が不正です');
    await createKnowledgeController(content, ctx.get('userId'));
  } catch {
    return ctx.html(getAllKnowledgesController(ctx.get('userName')), 400);
  }

  return ctx.redirect('/', 303);
});

router.get('/knowledges/:shortId{[0-9a-f]{8}}', async (ctx) => {
  const page = await getKnowledgeDetailController(ctx.req.param('shortId'));

  return page ? ctx.html(page) : ctx.notFound();
});
