# `AGENTS.md` 日本語参考訳

このファイルは、人間が確認するための [`AGENTS.md`](./AGENTS.md) の日本語訳です。Codex 向けの正式な指示は `AGENTS.md` です。内容が矛盾する場合は `AGENTS.md` を優先してください。

# 画像

- Astro で最適化または変換する画像は `src` に置き、加工せずそのまま配信する必要があるアセットは `public` に置きます。
- 複数のページやコンポーネントで共有する画像は `images/common` に置き、ページ固有の画像は `images/pages` に置きます。必要に応じてページごとに分類します。
- OGP 画像は、安定した直接 URL で利用できるように `public` に置きます。
- PNG および JPEG の画像は Astro の `Picture` コンポーネントで表示し、WebP と元の画像形式をフォールバックとして配信します。
- `src` からインポートする SVG は Astro の SVGO オプティマイザーで最適化します。`public` 内の SVG は処理不要です。
- 再利用するアイコンは `public/assets/images/common/symbols.svg` にシンボルとして追加し、`<use href="/assets/images/common/symbols.svg#icon-name">` で参照します。装飾目的のアイコンは支援技術から隠し、意味を伝えるアイコンにはアクセシブルな名前を付けます。

# 開発サーバー

- 原則として Astro の開発サーバーロックを尊重します。意図的かつ一時的に2つ目のサーバーが必要な場合に限って `--ignore-lock` を使用し、そのプロセスは明示的に停止します。`--ignore-lock` で起動したプロセスは Astro の `dev stop`、`dev status`、`dev logs` では追跡されません。

# ドキュメント

- `AGENTS.md` を更新するときは、同じ変更内で `AGENTS-ja.md` も更新し、日本語訳を正式な英語版の指示と一致させます。
