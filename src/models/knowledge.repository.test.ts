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
});
