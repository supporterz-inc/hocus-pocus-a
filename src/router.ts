import { type Context, Hono } from 'hono';
import { deleteKnowledgeController } from './controllers/delete-knowledge.controller.js';
import { getAllKnowledgesController } from './controllers/get-all-knowledges.controller.js';
import { getNewKnowledgePageController } from './controllers/get-new-knowledge-page.controller.js';
import { postKnowledgeController } from './controllers/post-knowledge.controller.js';

interface Variables {
  userId: string;
}

export const router = new Hono<{ Variables: Variables }>();

export type HonoContext = Context<{ Variables: Variables }>;

router.get('/', (ctx) => {
  // MEMO: `ctx.get('userId')` によって、必要に応じて UserID を利用できる
  console.log('Signed-in :', ctx.get('userId'));

  return ctx.html(getAllKnowledgesController());
});

router.get('/articles', (c) => {
  return c.html(getNewKnowledgePageController());
});

router.post('/articles', async (c) => {
  return await postKnowledgeController(c);
});
router.post('/knowledges', postKnowledgeController);

router.post('/knowledges/:knowledgeId/delete', async (c) => {
  return await deleteKnowledgeController(c);
});
