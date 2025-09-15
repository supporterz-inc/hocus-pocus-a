import { glob, readFile, rm, writeFile } from 'node:fs/promises';
import type { Knowledge } from './knowledge.model.js';

async function getAll(): Promise<Knowledge[]> {
  const files = await Array.fromAsync(glob('./storage/**/*.json'));

  const knowledges = await Promise.all(files.map((file) => readFile(file, 'utf-8').then(JSON.parse)));

  return knowledges;
}

// TODO: エントリが存在すれば更新、なければ作成の処理をする
async function upsert(knowledge: Knowledge): Promise<void> {
  const filePath = `./storage/${knowledge.knowledgeId}.json`;
  await writeFile(filePath, JSON.stringify(knowledge, null, 2), 'utf-8');
}

/**
 * knowledgeId から Knowledge を取得する
 * @param knowledgeId
 * @returns Knowledge or null (not found)
 */
async function getByKnowledgeId(knowledgeId: string): Promise<Knowledge | null> {
  const filePath = `./storage/${knowledgeId}.json`;
  const rawData = await readFile(filePath, 'utf-8').catch(() => null);

  if (!rawData) {
    return null;
  }

  const knowledge: Knowledge = JSON.parse(rawData);
  return knowledge;
}

async function deleteByKnowledgeId(knowledgeId: string): Promise<void> {
  const filePath = `./storage/${knowledgeId}.json`;
  await rm(filePath).catch((err) => {
    // ファイルが存在しない場合は無視する
    if (err.code !== 'ENOENT') {
      throw err;
    }
  });
}

export const KnowledgeRepository = {
  getByKnowledgeId,

  // biome-ignore lint/suspicious/noExplicitAny: TODO: (学生向け) 実装する
  getByAuthorId: (_: string): Promise<Knowledge[]> => undefined as any,

  getAll,

  upsert,

  deleteByKnowledgeId,
};
