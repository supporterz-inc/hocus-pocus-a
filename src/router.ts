import { Hono } from 'hono';
import { getAllKnowledgesController } from './controllers/get-all-knowledges.controller.js';
import { getNewKnowledgePageController } from './controllers/get-new-knowledge-page.controller.js';
import { postKnowledgeController } from './controllers/post-knowledge.controller.js';

interface Variables {
  userId: string;
}

export const router = new Hono<{ Variables: Variables }>();

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
