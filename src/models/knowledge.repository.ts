import { glob, readFile, rm, writeFile } from 'node:fs/promises';

import type { Knowledge } from './knowledge.model.js';

function readKnowledge(file: string): Promise<Knowledge> {
  return readFile(file, 'utf-8').then(JSON.parse);
}

async function getAll(): Promise<Knowledge[]> {
  const files = await Array.fromAsync(glob('./storage/**/*.json'));

  return Promise.all(files.map(readKnowledge));
}

async function getByKnowledgeId(knowledgeId: string): Promise<Knowledge | undefined> {
  const file = `./storage/${knowledgeId}.json`;
  return readKnowledge(file).catch(() => undefined);
}

async function upsert(knowledge: Knowledge): Promise<void> {
  await writeFile(`./storage/${knowledge.knowledgeId}.json`, JSON.stringify(knowledge, null, 2), 'utf-8');
}

async function deleteByKnowledgeId(knowledgeId: string): Promise<void> {
  await rm(`./storage/${knowledgeId}.json`, { force: true });
}

export const KnowledgeRepository = {
  getByKnowledgeId,

  // biome-ignore lint/suspicious/noExplicitAny: TODO: (学生向け) 実装する
  getByAuthorId: (_: string): Promise<Knowledge[]> => undefined as any,

  getAll,

  upsert,

  deleteByKnowledgeId,
};
