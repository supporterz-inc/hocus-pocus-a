import { glob, readFile, unlink, writeFile } from 'node:fs/promises';

import type { Knowledge } from './knowledge.model.js';

async function getAll(): Promise<Knowledge[]> {
  const files = await Array.fromAsync(glob('./storage/**/*.json'));

  const knowledges = await Promise.all(files.map((file) => readFile(file, 'utf-8').then(JSON.parse)));

  return knowledges;
}

async function upsert(knowledge: Knowledge): Promise<void> {
  console.log(knowledge);
  await writeFile(`./storage/${knowledge.knowledgeId}.json`, JSON.stringify(knowledge, null, 2));
}

async function getByKnowledgeId(knowledgeId: string): Promise<Knowledge | undefined> {
  try {
    const fileContent = await readFile(`./storage/${knowledgeId}.json`, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // ファイルが存在しない場合は undefined を返す
    if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}

async function deleteByKnowledgeId(knowledgeId: string): Promise<void> {
  await unlink(`./storage/${knowledgeId}.json`);
}

export const KnowledgeRepository = {
  getByKnowledgeId,

  // biome-ignore lint/suspicious/noExplicitAny: TODO: (学生向け) 実装する
  getByAuthorId: (_: string): Promise<Knowledge[]> => undefined as any,

  getAll,

  upsert,

  deleteByKnowledgeId,
};
