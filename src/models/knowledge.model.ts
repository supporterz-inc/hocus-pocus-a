import { randomUUID } from 'node:crypto';

/**
 * ナレッジのドメインモデル
 */
export interface Knowledge {
  readonly __tag: 'Knowledge';

  /**
   * ナレッジの一意な ID
   *
   * @todo (学生向け，発展課題) Nominal Type を使って型安全にする
   */
  readonly knowledgeId: string;

  /**
   * ナレッジの作成者の ID
   *
   * @todo (学生向け，発展課題) Nominal Type を使って型安全にする
   */
  readonly authorId: string;

  /**
   * ナレッジのタイトル
   */
  readonly title: string;

  /**
   * ナレッジの本文 (Markdown)
   *
   * @todo (学生向け) 空白の場合は不正な Knowledge とみなす
   */
  readonly content: string;

  /**
   * ナレッジの作成日時 (UNIX タイムスタンプ)
   */
  readonly createdAt: number;

  /**
   * ナレッジの更新日時 (UNIX タイムスタンプ)
   */
  readonly updatedAt: number;
}

function assertValidContent(content: string): void {
  if (content.trim() === '') throw new Error('ナレッジの本文が空です');
}

function assertValidTitle(title: string): void {
  if (title.trim() === '') throw new Error('ナレッジのタイトルが空です');
}

/**
 * ナレッジを新規作成する
 *
 * @param title ナレッジのタイトル
 * @param content ナレッジの本文
 * @param authorId ナレッジの作成者の ID
 * @returns 新規作成されたナレッジ
 */
function create(title: Knowledge['title'], content: Knowledge['content'], authorId: Knowledge['authorId']): Knowledge {
  assertValidTitle(title);
  assertValidContent(content);
  const now = Math.floor(Date.now() / 1000);

  return {
    __tag: 'Knowledge',
    knowledgeId: randomUUID(),
    title,
    content,
    authorId,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * ナレッジを更新する
 *
 * @param knowledge 更新対象のナレッジ
 * @param title 新しいナレッジのタイトル
 * @param content 新しいナレッジの本文
 * @returns 更新されたナレッジ
 */
function update(self: Knowledge, title: Knowledge['title'], content: Knowledge['content']): Knowledge {
  assertValidTitle(title);
  assertValidContent(content);

  return {
    ...self,
    title,
    content,
    updatedAt: Math.floor(Date.now() / 1000),
  };
}

export const Knowledge = {
  create,
  update,
};
