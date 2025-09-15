import { access } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { Knowledge } from './knowledge.model.js';
import { KnowledgeRepository } from './knowledge.repository.js';

describe('Create Knowledge', () => {
  it('Knowledge が作成できる', () => {
    const content = 'This is a test content.';
    const authorId = 'test-author';
    const title = 'test-title';
    const knowledge = Knowledge.create(content, authorId, title);

    expect(knowledge.content).toBe(content);
    expect(knowledge.authorId).toBe(authorId);
    expect(knowledge.title).toBe(title);
    expect(knowledge.createdAt).toEqual(knowledge.updatedAt);
  });
});

describe('Update Knowledge', () => {
  it('Knowledge が更新できる', () => {
    const original = Knowledge.create('This is an original content', 'test-author', 'test-title');
    const content = 'This is an updated content.';
    const title = 'updated-title';

    setTimeout(() => {
      const updated = Knowledge.update(original, title, content);

      expect(updated.knowledgeId).toBe(original.knowledgeId);
      expect(updated.title).toBe(title);
      expect(updated.content).toBe(content);
      expect(updated.authorId).toBe(original.authorId);
      expect(updated.createdAt).toEqual(original.createdAt);
      expect(updated.updatedAt).toBeGreaterThan(original.updatedAt);
    }, 100);
  });
});

describe('deleteByKnowledgeId', () => {
  it('Knowledge が削除できる', async () => {
    //1. テスト用のKnowledgeを作成して保存
    const knowledge = Knowledge.create('delete test', 'test-author', 'delete test title');
    await KnowledgeRepository.upsert(knowledge);

    //2. 保存したファイルが存在することを確認
    await expect(access(`./storage/${knowledge.knowledgeId}.json`)).resolves.toBeUndefined();

    //3. ナレッジを削除
    await KnowledgeRepository.deleteByKnowledgeId(knowledge.knowledgeId);

    //4. ファイルが削除されたことを確認
    await expect(access(`./storage/${knowledge.knowledgeId}.json`)).rejects.toThrow();
  });
});
