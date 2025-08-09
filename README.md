Hocus Pocus | Knowledge Sharing Platform for GEEK-Project
===============================================================================

ベースとなるプロジェクトは "ニュートラルな設計" であることに重きを置いています。

これは、サマーインターンシップで形成されるチームの性質に応じて、 実装に特色が出ていくことを期待しているからです。

**"Hocus Pocus"** というプロジェクト名称自体も、「何が起こるかわからない」[^1]という観点から命名されています。


## Getting Started

この章に記載の項目は、セットアップ時に一度のみ実施してください：

- (※ Windows ユーザーのみ) [WSL: Windows Subsystem for Linux](https://learn.microsoft.com/ja-jp/windows/wsl/) をインストールします
- 以下のコマンドを一行ずつ順番に実行して、[Node.js](https://nodejs.org) をインストールします：
    - **※ 注意 ※** : Mac であれば "ターミナル" 上で、Windows であれば "WSL" 上でコマンドを実行してください

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 24
```

- Git-root にて `npm ci` コマンドを実行し、必要なライブラリをインストールします


## How to Use

### ローカル環境における動作確認

1. `npm run build` : Node.js ランタイム向けに、**src** 配下にある TypeScript をトランスパイルする
2. `npm start` : **target** 配下にあるアプリケーションを、[localhost:8080](http://localhost:8080) に配信する
    - `npm start -- USER_ID` の要領で引数を与えた場合、JWT の認証処理を回避できます


## Limitation of Development

開発用の GitHub Repository には、以下の制限がかけられています：

- `main` Branch には、メンター以外のユーザーに対する書き込み保護がかけられています
- Pull-Request の Merge には、1 人以上の Approved が必要です
- Pull-Request の Merge には、Status Check の通過が必要です

これらの制限により：

1. Branch の作成 (& 開発)
2. Pull-Request の作成 (& レビュー + Status Check)
3. メンターへの最終承認 (& Merge)

... といった流れが必ず行われるようにしています。


## Mission

`GEMINI.md` を参照しながら、チームで協力してベースアプリケーションのスコープを実装してください。


[^1]: https://dragonquest.fandom.com/wiki/Hocus_Pocus
