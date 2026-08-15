import { describe, expect, it, vi} from 'vitest';
import { Knowledge, InvalidKnowledgeContentError} from './knowledge.model.js';

describe('Create Knowledge', () => {
  it('Knowledge が作成できる', () => {
    const content = 'This is a test content.';
    const authorId = 'test-author';
    const knowledge = Knowledge.create(content, authorId);

    expect(knowledge.content).toBe(content);
    expect(knowledge.authorId).toBe(authorId);
    expect(knowledge.createdAt).toEqual(knowledge.updatedAt);
    expect(knowledge.knowledgeId).toMatch(
      /^[0-9a-f-]{36}$/i //正規表現かどうかをチェック(UUID) 
    )
  });

});

it('空文字は作成できない', () => {
  expect(() => {
    Knowledge.create('', 'test-author');
  }).toThrow(InvalidKnowledgeContentError);
});

it('空白のみは作成できない', () => {
  expect(() => {
    Knowledge.create(' ', 'test-author');
  }).toThrow(InvalidKnowledgeContentError);
});

it('改行のみは作成できない', () => {
  expect(() => {
    Knowledge.create('\n', 'test-author');
  }).toThrow(InvalidKnowledgeContentError);
});

describe('Update Knowledge', () => {

  it('Knowledge が更新できる', () => {
    vi.useFakeTimers();
    const original = Knowledge.create('This is an original content', 'test-author');
    vi.advanceTimersByTime(1000); //秒数経過させて作成日時と更新日時ずらす
    const content = 'This is an updated content.';

    const updated = Knowledge.update(original, content);
    
    expect(updated.knowledgeId).toBe(original.knowledgeId);
    expect(updated.content).toBe(content);
    expect(updated.authorId).toBe(original.authorId);
    expect(updated.createdAt).toEqual(original.createdAt);
    expect(updated.updatedAt).toBeGreaterThan(original.updatedAt);
    vi.useRealTimers();
  });
});
