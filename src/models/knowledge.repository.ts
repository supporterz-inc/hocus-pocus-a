import { glob, readFile, writeFile } from 'node:fs/promises';

import type { Knowledge } from './knowledge.model.js';

async function getAll(): Promise<Knowledge[]> {
  const files = await Array.fromAsync(glob('./storage/**/*.json'));

  const knowledges = await Promise.all(files.map((file) => readFile(file, 'utf-8').then(JSON.parse)));

  return knowledges;
}

async function upsert(knowledge: Knowledge): Promise<void> {
  const filePath = `./storage/${knowledge.knowledgeId}.json`;
  const fileContent = JSON.stringify(knowledge, null, 2);

  await writeFile(filePath, fileContent, 'utf-8');
}

async function getByKnowledgeId(knowledgeId: string): Promise<Knowledge> {
  const filePath = `./storage/${knowledgeId}.json`;
  const fileContent = await readFile(filePath, 'utf-8');

  return JSON.parse(fileContent);
}

export const KnowledgeRepository = {
  getByKnowledgeId,

  // biome-ignore lint/suspicious/noExplicitAny: TODO: (学生向け) 実装する
  getByAuthorId: (_: string): Promise<Knowledge[]> => undefined as any,

  getAll,

  upsert,

  // biome-ignore lint/suspicious/noExplicitAny: TODO: (学生向け) 実装する
  deleteByKnowledgeId: (_: string): Promise<void> => undefined as any,
};
