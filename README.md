# astro-template

## 使い方

```shell
# 依存パッケージをインストールします
$ pnpm install

# localhost:4321 で開発サーバーを起動します
$ pnpm dev

# 本番用にビルドします
$ pnpm build

# すべてのファイルを Prettier で整形します
$ pnpm format
```

ステージ済みのファイルは husky と lint-staged によってコミット時に自動で整形されるため、`pnpm format` はプロジェクト全体を一括で整形したいときにのみ必要です。
