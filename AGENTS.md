# Images

- Keep images that Astro should optimize or transform in `src`; place assets that must be served unchanged in `public`.
- Store images shared across pages or components in `images/common`; store page-specific images in `images/pages`, grouped by page when needed.
- Keep OGP images in `public` so they are available at stable, direct URLs.
- Render PNG and JPEG sources with Astro’s `Picture` component, serving WebP with the original format as the fallback.
- Ensure SVGs imported from `src` are optimized with Astro’s SVGO optimizer; SVGs in `public` require no processing.
- Add reusable icons as symbols in `public/assets/images/common/symbols.svg` and reference them with `<use href="/assets/images/common/symbols.svg#icon-name">`. Hide decorative icons from assistive technology; provide an accessible name when an icon conveys meaning.

# Development Server

- Respect Astro’s dev-server lock by default. Use `--ignore-lock` only when an intentional, temporary second server is required, and stop that process explicitly because Astro’s `dev stop`, `dev status`, and `dev logs` commands do not track it.

# Documentation

- When updating `AGENTS.md`, update `AGENTS-ja.md` in the same change so the Japanese translation remains consistent with the canonical English instructions.
