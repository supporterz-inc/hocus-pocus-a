import { describe, expect, it } from 'vitest';
import { router } from './router.js';

describe('Router', () => {
  it('作成画面を表示できる', async () => {
    const response = await router.request('/knowledges/new');

    expect(response.status).toBe(200);

    const html = await response.text();

    expect(html).toContain('ナレッジ作成');
  });

  it('POST /knowledges は成功時に 303 を返す', async () => {
    const response = await router.request('/knowledges', {
      method: 'POST',
      body: new URLSearchParams({
        content: '# React',
      }),
    });

    expect(response.status).toBe(303);
  });

  it('空白のみを投稿すると 400 を返す', async () => {
    const response = await router.request('/knowledges', {
      method: 'POST',
      body: new URLSearchParams({
        content: ' ',
      }),
    });

    expect(response.status).toBe(400);
  });

  it('改行のみを投稿すると 400 を返す', async () => {
    const response = await router.request('/knowledges', {
      method: 'POST',
      body: new URLSearchParams({
        content: '\n',
      }),
    });
    expect(response.status).toBe(400);
  });
});
