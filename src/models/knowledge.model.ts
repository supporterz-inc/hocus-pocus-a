import { randomUUID } from 'node:crypto';

export class InvalidKnowledgeContentError extends Error {
  constructor() {
    super('Knowledge content is empty.');
  }
}

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
   * ナレッジの本文 (Markdown)
   *
   * @todo (学生向け) 空白の場合は不正な Knowledge とみなす
   * if (content.trim == ' ')
   * if (content.trim().length === 0) {
      throw new KnowledgeValidationError('本文を入力してください。');
    }
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

/**
 * ナレッジを新規作成する
 *
 * @param content ナレッジの本文
 * @param authorId ナレッジの作成者の ID
 * @returns 新規作成されたナレッジ
 */
function create(content: Knowledge['content'], authorId: Knowledge['authorId']): Knowledge {
  if (content.trim().length === 0){
    throw new InvalidKnowledgeContentError();
  } //空文字チェック
  const now = Math.floor(Date.now() / 1000); //現在時刻取得

  return {
    __tag: 'Knowledge',
    knowledgeId: randomUUID(),
    content, //本文
    authorId, //作成者
    createdAt: now, //作成日時
    updatedAt: now, //更新日時
  };

  
}

/**
 * ナレッジを更新する
 *
 * @param knowledge 更新対象のナレッジ
 * @param content 新しいナレッジの本文
 * @returns 更新されたナレッジ
 */
function update(self: Knowledge, content: Knowledge['content']): Knowledge {
  return {
    ...self,
    content,
    updatedAt: Math.floor(Date.now() / 1000),
  };
}

export const Knowledge = {
  create,
  update,
};
