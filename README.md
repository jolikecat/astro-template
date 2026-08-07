# astro-template

## 使い方

```shell
# 依存パッケージをインストールします
$ pnpm install

# localhost:4321 で開発サーバーを起動します
$ pnpm dev

# 本番用にビルドします
$ pnpm build

# JavaScript、TypeScript、Astro ファイルを検査します
$ pnpm lint

# ESLint で自動修正できる問題を修正します
$ pnpm lint:fix

# すべてのファイルを Prettier で整形します
$ pnpm format
```

ステージ済みの JavaScript、TypeScript、Astro ファイルは husky と lint-staged によってコミット時に自動検査・整形されます。`pnpm lint` と `pnpm format` は、プロジェクト全体を一括で確認したいときに使用してください。
