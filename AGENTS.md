# CSS

- Style with Tailwind utility classes in markup. Do not layer a separate CSS methodology or bespoke component class names on top of them.
- Promote repeated design values to Tailwind theme tokens with `@theme` in `src/assets/styles/global.css`; reserve arbitrary values for genuine one-offs.
- Keep the `@layer base` block in `global.css` limited to project-wide defaults that improve the unstyled experience. Do not duplicate Tailwind Preflight.
- Prefer utilities over `@apply`. Reach for `@apply` only for markup you cannot annotate directly, such as generated or third-party HTML.
- Express component variants and state as `data-*` attributes and target them with Tailwind’s `data-*` variants instead of modifier class names.
- Let `prettier-plugin-tailwindcss` order class lists; run `pnpm format` instead of sorting classes by hand.

# Images

Every image is served from `public`. Astro does not optimize images. Process image files with `tools/image-compressor` before using them; its `input` tree mirrors `public` exactly.

```
tools/image-compressor/input/
├── assets/images/
│   ├── common/              # temporary input for shared images
│   └── pages/               # temporary input; mirrors src/pages
└── ogp.jpg, ...             # temporary input for root-level public images

public/
├── assets/images/
│   ├── common/              # compressed shared images, including symbols.svg
│   └── pages/               # compressed page-specific images; mirrors src/pages
└── ogp.jpg, ...             # compressed root-level public images
```

- Under `pages`, `common` holds the images shared by the pages beneath it, and a directory named after a page file without its extension holds the images that only that page uses. Images shared site-wide belong in the top-level `common`, never in `pages/common`.
- Put images in `tools/image-compressor/input` using the same relative path they should have under `public`, then run `pnpm images:compress`. The command preserves directories, overwrites matching outputs, and does not delete other files from `public`.
- The compressor handles JPEG, PNG, WebP, AVIF, and GIF with Sharp and SVG with SVGO. Its quality, extensions, outputs, and SVGO options are defined in `tools/image-compressor/config.json`. JPEG and PNG inputs produce both an optimized same-format fallback and a WebP file. Its `input` contents are temporary and ignored by Git; the processed files in `public` are the source-controlled assets.
- Place ordinary site images under `assets/images`; place site-wide files that must be fetched from the site root — such as root-level OGP images, favicons, or touch icons — at the corresponding root of `public`.
- Reference every image with the root-relative URL matching its path under `public`. Do not import images from `src` or render them with Astro’s `Image` or `Picture` components.
- Render JPEG and PNG assets with a native `<picture>` containing a WebP `<source>` and the same-format `<img>` fallback. Specify `width` and `height` on `<img>` to prevent layout shifts, and add appropriate loading behavior for the image’s role.
- Add reusable icons as symbols in `public/assets/images/common/symbols.svg` and reference them with `<use href="/assets/images/common/symbols.svg#icon-name">`. Hide decorative icons from assistive technology; provide an accessible name when an icon conveys meaning.

# Accessibility

- Prefer native HTML. No ARIA is better than incorrect or incomplete ARIA; add ARIA only when native semantics cannot express the required meaning or state.
- When ARIA is necessary, fulfill the complete semantic and interaction contract, including accessible names, keyboard behavior, focus management, and synchronized states and properties. Do not override correct native semantics.

# Development Server

- Before starting a development server for verification, run `pnpm astro dev status`. Reuse an existing server when possible instead of starting another one, and do not stop a server that was already running before the current task.
- Astro starts the dev server as a background process automatically when it detects an AI coding agent, so `pnpm astro dev` is normally enough; `--background` requests the same behavior explicitly and is safe to pass. If the current task started a background server, stop it with `pnpm astro dev stop` before finishing, then run `pnpm astro dev status` to confirm that it is no longer running. Because `dev stop` only tracks background servers, terminate a foreground server by stopping the exact process that the current task started.
- Respect Astro’s dev-server lock by default. Use `--ignore-lock` only when an intentional, temporary second server is required. It cannot be combined with `--background`, `--force`, or the automatic background mode that Astro enables for AI coding agents, so it requires a foreground server on a free port: `ASTRO_DEV_BACKGROUND=0 pnpm astro dev --ignore-lock --port 4322`.
- A server started with `--ignore-lock` is not tracked by Astro’s `dev stop`, `dev status`, or `dev logs` commands. Retain the exact process ID or terminal session created by the current task and terminate that process before finishing. Never use broad cleanup commands such as `pkill`, `killall`, or killing every process on a port, because they can terminate development servers owned by the user or another task.

# Astro Reference

- Verify Astro behavior, CLI flags, and configuration options against the official documentation through the `astro-docs` MCP server instead of relying on recalled knowledge, because the CLI and configuration surface change between minor releases. Check the behavior for the Astro version pinned in `package.json`.
- The server is registered in `.mcp.json` for Claude Code and in `.codex/config.toml` for Codex. When you add or change a documentation source for one agent, apply the same change for the other.

# Documentation

- `AGENTS.md` holds the canonical instructions for every agent working in this repository; `AGENTS-ja.md` is a Japanese reference translation for human readers. When the two disagree, `AGENTS.md` wins.
- When updating `AGENTS.md`, update `AGENTS-ja.md` in the same change so the Japanese translation remains consistent with the canonical English instructions.
