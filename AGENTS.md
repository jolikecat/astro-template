# Images

- Keep images that Astro should optimize or transform in `src`; place assets that must be served unchanged in `public`.
- Store images shared across pages or components in `src/assets/images/common`; store page-specific images in `src/assets/images/pages`, grouped by page when needed.
- Keep OGP images in `public` so they are available at stable, direct URLs.
- Render PNG and JPEG sources with Astro’s `Picture` component, serving WebP with the original format as the fallback.
- Ensure SVGs imported from `src` are optimized with Astro’s SVGO optimizer, configured through the experimental `svgOptimizer` flag in `astro.config.mjs`. Optimization runs only in production builds, so verify the result with `pnpm build` instead of the development server. SVGs in `public` require no processing.
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
