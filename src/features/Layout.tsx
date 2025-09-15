import type { PropsWithChildren } from 'hono/jsx';

interface Props {
  title: string;
}

export function Layout({ title, children }: PropsWithChildren<Props>) {
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>Hocus Pocus - {title} | Knowledge Sharing Platform for GEEK-Project</title>
        <link href="/index.css" rel="stylesheet" />
      </head>

      <body class="bg-gray-100 text-gray-900">
        <header class="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
          <div class="mx-auto max-w-screen-md px-4 py-3 flex items-center justify-between">
            <a class="flex items-center gap-2" href="/">
              <span class="inline-block h-3 w-3 rounded-full bg-blue-500"></span>
              <span class="font-semibold">Hocus Pocus</span>
            </a>
            <nav class="flex items-center gap-2">
              <a class="text-sm text-gray-700 hover:text-gray-900" href="/">
                一覧
              </a>
              <a class="btn btn-primary" href="/knowledges/new">
                新規作成
              </a>
            </nav>
          </div>
        </header>

        <main class="mx-auto max-w-screen-md px-4 py-6">{children}</main>

        <footer class="mx-auto max-w-screen-md px-4 py-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Hocus Pocus
        </footer>
      </body>
    </html>
  );
}
