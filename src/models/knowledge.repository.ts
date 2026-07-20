import { glob, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { Knowledge } from './knowledge.model.js';

async function getAll(): Promise<Knowledge[]> {
  const files = await Array.fromAsync(glob('./storage/**/*.json'));

  const knowledges = await Promise.all(files.map((file) => readFile(file, 'utf-8').then(JSON.parse)));

  return knowledges;
}

async function getByKnowledgeId(knowledgeId: string): Promise<Knowledge> {
  const filePath = path.join('./storage', `${knowledgeId}.json`);
  const fileContent = await readFile(filePath, 'utf-8');

  return JSON.parse(fileContent) as Knowledge;
}

async function getByAuthorId(authorId: string): Promise<Knowledge[]> {
  const knowledges = await getAll();

  return knowledges.filter((knowledge) => knowledge.authorId === authorId);
}

async function deleteByKnowledgeId(knowledgeId: string): Promise<void> {
  const filePath = path.join('./storage', `${knowledgeId}.json`);

  await rm(filePath, { force: true });
}

async function upsert(knowledge: Knowledge): Promise<void> {
  const filePath = path.join('./storage', `${knowledge.knowledgeId}.json`);

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(knowledge, null, 2), 'utf-8');
}

export const KnowledgeRepository = {
  getByKnowledgeId,
  getByAuthorId,
  getAll,
  upsert,
  deleteByKnowledgeId,
};
