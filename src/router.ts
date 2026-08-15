import { Hono } from 'hono';
import { createKnowledgeController } from './controllers/create-knowledge.controller.js';
import { getAllKnowledgesController } from './controllers/get-all-knowledges.controller.js';
import { getCreateKnowledgeController } from './controllers/get-create-knowledge.controller.js';
import { KnowledgeCreateFeature } from './features/KnowledgeCreateFeature.js';
import { InvalidKnowledgeContentError } from './models/knowledge.model.js';

export interface Variables {
  userId: string;
}

export const router = new Hono<{ Variables: Variables }>();

router.get('/', (ctx) => {
  // MEMO: `ctx.get('userId')` によって、必要に応じて UserID を利用できる
  const userId = ctx.get('userId');
  console.log('Signed-in :', userId);

  // MEMO: Controller は Context を直接受け取らず、必要な情報のみを引数に受け取る
  return ctx.html(getAllKnowledgesController(userId));
});

router.get('/knowledges/new', (ctx) => {
  return ctx.html(getCreateKnowledgeController());
});

router.post('/knowledges', async (ctx) => {
  const body = await ctx.req.parseBody();
  const content = body['content'];

  if (typeof content !== 'string') {
    return ctx.html(
      KnowledgeCreateFeature({
        content: '',
        errorMessage: '本文を入力してください',
      }),
      400,
    );
  }

  const userId = ctx.get('userId');

  try {
    await createKnowledgeController(content, userId);
    return ctx.redirect('/', 303);
  } catch (error) {
    if (error instanceof InvalidKnowledgeContentError) {
      return ctx.html(
        KnowledgeCreateFeature({
          content,
          errorMessage: '本文を入力してください',
        }),
        400,
      );
    }

    throw error;
  }
});
