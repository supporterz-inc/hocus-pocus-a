import { constants } from 'node:fs';
import { access, unlink } from 'node:fs/promises';
import { afterEach, describe, expect, it } from 'vitest';
import { Knowledge } from './knowledge.model.js';
import { KnowledgeRepository } from './knowledge.repository.js';

describe('Create Knowledge', () => {
  it('Knowledge が作成できる', () => {
    const content = 'This is a test content.';
    const authorId = 'test-author';
    const knowledge = Knowledge.create(content, authorId);

    expect(knowledge.content).toBe(content);
    expect(knowledge.authorId).toBe(authorId);
    expect(knowledge.createdAt).toEqual(knowledge.updatedAt);
  });
});

describe('KnowledgeRepository', () => {
  afterEach(async () => {
    // Clean up any files created during tests
    try {
      const files = await KnowledgeRepository.getAll();
      await Promise.all(
        files.map(async (file) => {
          await unlink(`./storage/${file.knowledgeId}.json`);
        }),
      );
    } catch (_error) {
      // Ignore if directory doesn't exist or other cleanup issues
    }
  });

  it('deleteByKnowledgeId がナレッジを削除できる', async () => {
    const knowledge = Knowledge.create('Test content for deletion', 'test-author-delete');
    await KnowledgeRepository.upsert(knowledge);

    // Verify the file exists before deletion
    await expect(access(`./storage/${knowledge.knowledgeId}.json`, constants.F_OK)).resolves.toBeUndefined();

    await KnowledgeRepository.deleteByKnowledgeId(knowledge.knowledgeId);

    // Verify the file no longer exists after deletion
    await expect(access(`./storage/${knowledge.knowledgeId}.json`, constants.F_OK)).rejects.toThrow();
  });

  it('getByKnowledgeId がナレッジを取得できる', async () => {
    const knowledge = Knowledge.create('Test content for get', 'test-author-get');
    await KnowledgeRepository.upsert(knowledge);

    const fetchedKnowledge = await KnowledgeRepository.getByKnowledgeId(knowledge.knowledgeId);
    expect(fetchedKnowledge).toEqual(knowledge);
  });

  it('getByKnowledgeId が存在しないナレッジに対して undefined を返す', async () => {
    const fetchedKnowledge = await KnowledgeRepository.getByKnowledgeId('non-existent-id');
    expect(fetchedKnowledge).toBeUndefined();
  });
});
