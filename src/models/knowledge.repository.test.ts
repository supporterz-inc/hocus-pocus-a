import { rm } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { Knowledge } from './knowledge.model.js';
import { KnowledgeRepository } from './knowledge.repository.js';

describe('KnowledgeRepository', () => {
  it('保存したナレッジを一覧で取得できる', async () => {
    const knowledge = Knowledge.create('保存テスト用の内容', 'test-author');

    await KnowledgeRepository.upsert(knowledge);

    const knowledges = await KnowledgeRepository.getAll();

    expect(knowledges.some((item) => item.knowledgeId === knowledge.knowledgeId)).toBe(true);

    await rm(path.join('./storage', `${knowledge.knowledgeId}.json`), { force: true });
  });

  it('保存したナレッジを ID で取得できる', async () => {
    const knowledge = Knowledge.create('詳細表示テスト用の内容', 'test-author');

    await KnowledgeRepository.upsert(knowledge);

    const found = await KnowledgeRepository.getByKnowledgeId(knowledge.knowledgeId);

    expect(found?.knowledgeId).toBe(knowledge.knowledgeId);
    expect(found?.content).toBe(knowledge.content);

    await rm(path.join('./storage', `${knowledge.knowledgeId}.json`), { force: true });
  });
});
