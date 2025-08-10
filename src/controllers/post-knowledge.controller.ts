import type { Context } from 'hono';
import { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function postKnowledgeController(ctx: Context) {
  const { content } = await ctx.req.json<{ content: string }>();
  console.log(content);
  const userId = ctx.get('userId');

  const knowledge = Knowledge.create(content, userId);
  console.log(knowledge);
  await KnowledgeRepository.upsert(knowledge);

  return ctx.redirect('/');
}
