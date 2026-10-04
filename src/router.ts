import { Hono } from 'hono';
import { createKnowledgeController } from './controllers/create-knowledge.controller.js';
import { deleteKnowledgeController } from './controllers/delete-knowledge.controller.js';
import { getAllKnowledgesController, getKnowledgeDetailController } from './controllers/get-knowledges.controller.js';

export interface Variables {
  userId: string;
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

router.post('/knowledges/:knowledgeId/delete', async (ctx) => {
  const { knowledgeId } = ctx.req.param();

  try {
    await deleteKnowledgeController(knowledgeId, ctx.get('userId'));
  } catch {
    return ctx.html(getAllKnowledgesController(ctx.get('userName')), 403);
  }

  return ctx.redirect('/', 303);
});

router.get('/knowledges/:knowledgeId{[0-9a-f-]{36}}', async (ctx) => {
  const page = await getKnowledgeDetailController(ctx.req.param('knowledgeId'));

  return page ? ctx.html(page) : ctx.notFound();
});
