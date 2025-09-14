import { Hono } from 'hono';
import { createKnowledgeController } from './controllers/create-knowledge.controller.js';
import { getAllKnowledgesController } from './controllers/get-all-knowledges.controller.js';
import { getNewKnowledgeController } from './controllers/get-new-knowledge.controller.js';

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

// ナレッジ作成フォームの表示
router.get('/knowledges/new', (ctx) => {
  // 作成フォームのUIを返すコントローラーを呼び出す
  return ctx.html(getNewKnowledgeController());
});

// ナレッジの作成
router.post('/knowledges', async (ctx) => {
  // フォームデータ (Markdown本文) を取得
  const formData = await ctx.req.formData();
  const content = formData.get('content');

  if (typeof content !== 'string') {
    return ctx.text('Invalid content', 400);
  }

  // 認証ユーザーのIDを取得
  const authorId = ctx.get('userId');

  // ナレッジを作成するコントローラーを呼び出す
  await createKnowledgeController(content, authorId);

  // トップページにリダイレクト
  return ctx.redirect('/');
});
