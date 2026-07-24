# CSS

- Use CUBE CSS as a decision framework: layout belongs to Composition, component-specific appearance to Block, and small intentional overrides to Tailwind utilities.
- Keep Base limited to project-wide defaults that improve the unstyled experience. Do not duplicate Tailwind Preflight.
- Prefer low-specificity selectors, inheritance, and the cascade. Utilities must be able to override Blocks without `!important`.
- Promote repeated design values to Tailwind theme tokens; reserve arbitrary values for genuine one-offs.
- Order class groups as Block, Composition, Utility. Separate groups with a literal `|`, never square brackets: `class="card | flow wrapper | text-body-sm"`.
- Express Block variants and state as `data-*` exceptions instead of modifier class names.

# Images

- Keep images that Astro should optimize or transform in `src`; place assets that must be served unchanged in `public`.
- Store images shared across pages or components in `images/common`; store page-specific images in `images/pages`, grouped by page when needed.
- Keep OGP images in `public` so they are available at stable, direct URLs.
- Render PNG and JPEG sources with Astro’s `Picture` component, serving WebP with the original format as the fallback.
- Ensure SVGs imported from `src` are optimized with Astro’s SVGO optimizer; SVGs in `public` require no processing.
- Add reusable icons as symbols in `public/assets/images/common/symbols.svg` and reference them with `<use href="/assets/images/common/symbols.svg#icon-name">`. Hide decorative icons from assistive technology; provide an accessible name when an icon conveys meaning.

# Development Server

- Respect Astro’s dev-server lock by default. Use `--ignore-lock` only when an intentional, temporary second server is required, and stop that process explicitly because Astro’s `dev stop`, `dev status`, and `dev logs` commands do not track it.
