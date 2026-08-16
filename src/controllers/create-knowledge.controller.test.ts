import { describe, expect, it } from 'vitest';

import { createKnowledgeController } from './create-knowledge.controller.js';

describe('Create Knowledge Controller', () => {
  it('ナレッジを作成できる', async () => {
    const content = '# React';
    const userId = 'test-user';

    const knowledge = await createKnowledgeController(content, userId);

    expect(knowledge.content).toBe(content);

    expect(knowledge.authorId).toBe(userId);
  });

  it('空文字では作成できない', async () => {
    await expect(createKnowledgeController('', 'test-user')).rejects.toThrow();
  });

  it('空白のみでは作成できない', async () => {
    await expect(createKnowledgeController(' ', 'test-user')).rejects.toThrow();
  });

  it('改行のみでは作成できない', async () => {
    await expect(createKnowledgeController('\n', 'test-user')).rejects.toThrow();
  });
});
