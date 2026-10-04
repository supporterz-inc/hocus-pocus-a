import { glob, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

import type { Knowledge } from './knowledge.model.js';

// タイトル機能の追加前に保存されたナレッジには title が無いため、補って読み込む
function readKnowledge(file: string): Promise<Knowledge> {
  return readFile(file, 'utf-8').then((json) => ({ title: '(無題)', ...JSON.parse(json) }));
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
  // Docker Image には storage/ が含まれないため、無ければ作成する
  await mkdir('./storage', { recursive: true });
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
