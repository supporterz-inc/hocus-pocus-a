import { glob, readFile, mkdir, writeFile } from 'node:fs/promises'; //mkdir:ディレクトリ作成、writeFile:書き込み

import type { Knowledge } from './knowledge.model.js';

async function getAll(): Promise<Knowledge[]> {
  const files = await Array.fromAsync(glob('./storage/**/*.json'));

  const knowledges = await Promise.all(files.map((file) => readFile(file, 'utf-8').then(JSON.parse)));

  return knowledges;
}

//upsertの実装
async function upsert(knowledge: Knowledge,): Promise<void> {
  await mkdir('./storage', { //storageフォルダを作る
    recursive: true,
  });
  const path =`./storage/${knowledge.knowledgeId}.json`; //ここで保存先を決める
  await writeFile(path,
    JSON.stringify(knowledge,null,2,) //json化
    ,'utf-8',); //ファイル保存
}

export const KnowledgeRepository = {
  // biome-ignore lint/suspicious/noExplicitAny: TODO: (学生向け) 実装する
  getByKnowledgeId: (_: string): Promise<Knowledge> => undefined as any,

  // biome-ignore lint/suspicious/noExplicitAny: TODO: (学生向け) 実装する
  getByAuthorId: (_: string): Promise<Knowledge[]> => undefined as any,

  getAll,

  // biome-ignore lint/suspicious/noExplicitAny: TODO: (学生向け) 実装する
  upsert,

  // biome-ignore lint/suspicious/noExplicitAny: TODO: (学生向け) 実装する
  deleteByKnowledgeId: (_: string): Promise<void> => undefined as any,
};
