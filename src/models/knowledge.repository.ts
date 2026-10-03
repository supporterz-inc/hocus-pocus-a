import { glob, readFile, writeFile } from 'node:fs/promises';

import type { Knowledge } from './knowledge.model.js';

function readKnowledge(file: string): Promise<Knowledge> {
  return readFile(file, 'utf-8').then(JSON.parse);
}

async function getAll(): Promise<Knowledge[]> {
  const files = await Array.fromAsync(glob('./storage/**/*.json'));

  return Promise.all(files.map(readKnowledge));
}

async function getByShortId(shortId: string): Promise<Knowledge | undefined> {
  const [file] = await Array.fromAsync(glob(`./storage/${shortId}-*.json`));

  return file ? readKnowledge(file) : undefined;
}

async function upsert(knowledge: Knowledge): Promise<void> {
  await writeFile(`./storage/${knowledge.knowledgeId}.json`, JSON.stringify(knowledge, null, 2), 'utf-8');
}

export const KnowledgeRepository = {
  // biome-ignore lint/suspicious/noExplicitAny: TODO: (学生向け) 実装する
  getByKnowledgeId: (_: string): Promise<Knowledge> => undefined as any,

  getByShortId,

  // biome-ignore lint/suspicious/noExplicitAny: TODO: (学生向け) 実装する
  getByAuthorId: (_: string): Promise<Knowledge[]> => undefined as any,

  getAll,

  upsert,

  // biome-ignore lint/suspicious/noExplicitAny: TODO: (学生向け) 実装する
  deleteByKnowledgeId: (_: string): Promise<void> => undefined as any,
};
