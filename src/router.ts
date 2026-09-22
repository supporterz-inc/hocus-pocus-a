import { Hono } from 'hono';
import { createKnowledgeController, saveKnowledgeController } from './controllers/create-knowledge.controller.js';
import { getAllKnowledgesController } from './controllers/get-all-knowledges.controller.js';

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
  // MEMO: `ctx.get(keyof Variables)` によって、必要に応じて値を利用できる
  const userId = ctx.get('userId');
  const userName = ctx.get('userName');
  console.log(`Signed-in : ${userName} (${userId})`);

  // MEMO: Controller は Context を直接受け取らず、必要な情報のみを引数に受け取る
  return ctx.html(getAllKnowledgesController(userName));
});

router.get('/new', (ctx) => {
  return ctx.html(createKnowledgeController());
});

router.post('/new', async (ctx) => {
  const { content } = await ctx.req.parseBody<{ content: string }>();
  const userId = ctx.get('userId');

  await saveKnowledgeController(content, userId);

  return ctx.redirect('/');
});
