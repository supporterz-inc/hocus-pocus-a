import { afterEach, describe, expect, it, vi } from 'vitest';
import { Knowledge } from './knowledge.model.js';

afterEach(() => {
  vi.useRealTimers();
});

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

it.each([
  ['空文字', ''],
  ['半角スペースのみ', '   '],
  ['全角スペースのみ', '　　'],
  ['改行・タブのみ', '\n\t\n'],
])('本文が%sの場合は作成できない', (_, content) => {
  expect(() => Knowledge.create(content, 'test-author')).toThrow();
});

it('前後に空白があっても本文があれば作成でき、本文はそのまま保持される', () => {
  const content = '  This is a test content.  ';
  const knowledge = Knowledge.create(content, 'test-author');

  expect(knowledge.content).toBe(content);
});

describe('Update Knowledge', () => {
  it('Knowledge が更新できる', () => {
    vi.useFakeTimers();

    const original = Knowledge.create('This is an original content', 'test-author');
    const content = 'This is an updated content.';

    vi.advanceTimersByTime(10000);

    const updated = Knowledge.update(original, content);

    expect(updated.knowledgeId).toBe(original.knowledgeId);
    expect(updated.content).toBe(content);
    expect(updated.authorId).toBe(original.authorId);
    expect(updated.createdAt).toEqual(original.createdAt);
    expect(updated.updatedAt).toBeGreaterThan(original.updatedAt);
  });
});

describe('Short ID of Knowledge', () => {
  it('knowledgeId の先頭のハイフンまでを返す', () => {
    const knowledge = {
      ...Knowledge.create('content', 'test-author'),
      knowledgeId: '100e75a9-290e-4ed8-b9a4-88854f41ba5e',
    };

    expect(Knowledge.toShortId(knowledge)).toBe('100e75a9');
  });

  it('新規作成したナレッジの短い ID は 16 進数 8 文字になる', () => {
    const knowledge = Knowledge.create('content', 'test-author');

    expect(Knowledge.toShortId(knowledge)).toMatch(/^[0-9a-f]{8}$/);
  });
});
