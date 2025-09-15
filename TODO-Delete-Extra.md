# ナレッジ削除機能のUX改善提案

現在の実装では、「削除する」ボタンをクリックすると確認なしに即座にナレッジが削除されてしまいます。これは誤操作を招く可能性があり、ユーザーエクスペリエンスの観点から改善が望まれます。

## 提案: 削除確認ダイアログの追加

最もシンプルかつ効果的な改善策として、ブラウザ標準の確認ダイアログの実装を提案します。
フォームが送信される直前に `window.confirm()` を呼び出し、ユーザーに「本当にこの記事を削除しますか？？」と問いかけます。

-   ユーザーが「OK」を選択した場合：処理を続行し、フォームを送信します。
-   ユーザーが「キャンセル」を選択した場合：処理を中断し、フォームの送信を中止します。

この変更はフロントエンドの改修のみで完結するため、既存のバックエンドのロジックに影響を与えません。

## 編集案

### `src/features/KnowledgeDetailFeature.tsx` の更新

`form` タグに `onsubmit` イベントハンドラを追加します。

```typescript
import { raw } from 'hono/html';
import { marked } from 'marked';
import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface Props {
  knowledge: Knowledge;
}

export async function KnowledgeDetailFeature({ knowledge }: Props) {
  if (!knowledge) {
    return <div>ナレッジが見つかりません。</div>;
  }

  if (
    !knowledge.content ||
    typeof knowledge.content !== 'string' ||
    !knowledge.title ||
    typeof knowledge.title !== 'string' ||
    !knowledge.authorId ||
    typeof knowledge.authorId !== 'string' ||
    !knowledge.updatedAt ||
    typeof knowledge.updatedAt !== 'number'
  ) {
    return <div>ナレッジのデータが不正です。</div>;
  }

  const html = await marked.parse(knowledge.content, { gfm: true, breaks: true });

  return (
    <Layout title={knowledge.title}>
      <article class="space-y-4">
        <h1 class="text-2xl font-bold">{knowledge.title}</h1>
        <div class="prose">{raw(html)}</div>
        <p class="text-sm text-gray-500">
          作成者: {knowledge.authorId} | 最終更新: {new Date(knowledge.updatedAt * 1000).toLocaleString()}
        </p>

        <div class="flex items-center space-x-4">
          <a class="text-blue-500 hover:underline" href="/">
            一覧に戻る
          </a>

          <form
            action={`/knowledges/${knowledge.knowledgeId}/delete`}
            method="post"
            onsubmit="return window.confirm('本当にこの記事を削除しますか？')"
          >
            <button class="text-red-500 hover:underline" type="submit">
              削除する
            </button>
          </form>
        </div>
      </article>
    </Layout>
  );
}
```
