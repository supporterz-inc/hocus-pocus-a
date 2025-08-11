import type { Context } from 'hono';
import { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function postKnowledgeController(ctx: Context) {
  const body = await ctx.req.parseBody();
  console.log(body['content']);
  //const { content } = await ctx.req.json<{ content: string }>();
  const userId = ctx.get('userId');
  const content = String(body['content']);

  const knowledge = Knowledge.create(content, userId);
  await KnowledgeRepository.upsert(knowledge);

  return ctx.redirect('/');
}
