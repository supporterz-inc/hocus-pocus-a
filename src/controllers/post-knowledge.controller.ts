import type { Context } from 'hono';

export async function postKnowledgeController(c: Context) {
  const body = await c.req.parseBody();

  // TODO: body の内容をストレージに保存する処理を実装する
  console.log('Form data:', body);

  return c.redirect('/articles', 303);
}
