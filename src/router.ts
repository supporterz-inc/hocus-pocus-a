import { Hono } from 'hono';
import { getAllKnowledgesController } from './controllers/get-all-knowledges.controller.js';
import { getEditKnowledgeController } from './controllers/get-edit-knowledge.controller.js';
import { Knowledge } from './models/knowledge.model.js';
import { KnowledgeRepository } from './models/knowledge.repository.js';

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

router.get('/edit', async (ctx) => {
  const userId = ctx.get('userId');
  const knowledgeId = String(ctx.req.query('knowledgeId') ?? '').trim();

  if (!knowledgeId) {
    return ctx.redirect('/');
  }

  try {
    const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);

    if (knowledge.authorId !== userId) {
      return ctx.text('Forbidden', 403);
    }

    return ctx.html(getEditKnowledgeController(knowledge));
  } catch {
    return ctx.redirect('/');
  }
});

router.post('/edit', async (ctx) => {
  const userId = ctx.get('userId');
  const form = await ctx.req.formData();
  const knowledgeId = String(form.get('knowledgeId') ?? '').trim();
  const content = String(form.get('content') ?? '').trim();

  if (!knowledgeId || !content) {
    return ctx.redirect('/');
  }

  try {
    const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);

    if (knowledge.authorId !== userId) {
      return ctx.text('Forbidden', 403);
    }

    const updated = Knowledge.update(knowledge, content);
    await KnowledgeRepository.upsert(updated);

    return ctx.redirect('/');
  } catch {
    return ctx.redirect('/');
  }
});

router.post('/', async (ctx) => {
  const userId = ctx.get('userId');

  // フォームデータから本文を取得
  const form = await ctx.req.formData();
  const content = String(form.get('content') ?? '').trim();

  // 簡易バリデーション: 空ならリダイレクト
  if (!content) {
    return ctx.redirect('/');
  }

  const knowledge = Knowledge.create(content, userId);
  await KnowledgeRepository.upsert(knowledge);

  return ctx.redirect('/');
});
