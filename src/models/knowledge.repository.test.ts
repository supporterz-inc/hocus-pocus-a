import { readFile, unlink } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { Knowledge } from './knowledge.model.js';
import { KnowledgeRepository } from './knowledge.repository.js';

describe('KnowledgeRepository', () => {
  it('Knowledge を保存できる', async () => {
    const knowledge = Knowledge.create('#本文', 'test-auther');

    const path = `./storage/${knowledge.knowledgeId}.json`; //保存先を決める
    try {
      await KnowledgeRepository.upsert(knowledge);
      const savedFile = JSON.parse(await readFile(path, 'utf-8'));

      expect(savedFile).toEqual(knowledge);
    } finally {
      await unlink(path).catch(() => {});
    }
  });
});
