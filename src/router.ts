import { Hono } from 'hono';
import { createKnowledgeController, saveKnowledgeController } from './controllers/create-knowledge.controller.js';
import { detailKnowledgeController } from './controllers/detail-knowledge.controller.js';
import { getAllKnowledgesController } from './controllers/get-all-knowledges.controller.js';
import {
  saveUpdatedKnowledgeController,
  updateKnowledgeController,
} from './controllers/update-knowledge.controller.js';
import { isUUID } from './utils/is-uuid.js';

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

  return ctx.redirect('/', 303);
});

router.get('/knowledges/:id', async (ctx) => {
  const id = ctx.req.param('id');
  if (!isUUID(id)) {
    return ctx.text('不正な値です', 400);
  }

  return ctx.html(detailKnowledgeController(id));
});

router.get('/knowledges/:id/edit', async (ctx) => {
  const id = ctx.req.param('id');
  if (!isUUID(id)) {
    return ctx.text('不正な値です', 400);
  }
  const userId = ctx.get('userId');

  return ctx.html(await updateKnowledgeController(id, userId));
});

router.patch('/knowledges/:id', async (ctx) => {
  const id = ctx.req.param('id');
  if (!isUUID(id)) {
    return ctx.text('不正な値です', 400);
  }

  const { content } = await ctx.req.parseBody<{ content: string }>();
  const userId = ctx.get('userId');

  await saveUpdatedKnowledgeController(id, content, userId);

  return ctx.redirect(`/knowledges/${id}`, 303);
});
