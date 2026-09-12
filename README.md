# Fasty Website

Official website and documentation for **Fasty**, a macOS launcher. Built with
[VitePress](https://vitepress.dev) and deployed to GitHub Pages.

This repository is intentionally separate from the application repository so the
site can be public even if the app source is not, and so content changes never
trigger the app build.

## Local development

```bash
pnpm install
pnpm gen   # optional: regenerate plugin pages and the API reference from the app repo
pnpm dev
```

## Build

```bash
pnpm docs:build     # output: .vitepress/dist
pnpm preview
```

## Generated content

`pnpm gen` runs two scripts against the app repository (default `../Fasty`):

- `scripts/gen-plugin-catalog.mjs` → `data/plugins.json`, `plugins/index.md` and
  one `plugins/<id>.md` detail page per plugin.
- `scripts/gen-api-reference.mjs` → `data/api.json` and `dev/api.md`.

They read only the public manifest / SDK contract (names, descriptions, feature
explanations, API signatures, permissions) — no internal implementation.

Override the app repo path with an absolute path:

```bash
FASTY_REPO=/path/to/Fasty pnpm gen
```

## Deployment (GitHub Pages)

`deploy.yml` builds on every push to `main` and publishes `.vitepress/dist` to
GitHub Pages. Enable **Settings → Pages → Build and deployment → GitHub Actions**
once, and set the `base` to the repository name.

The site is served under `https://<user>.github.io/<repo>/`, so `base` defaults
to `/fasty-website/` in `.vitepress/config.ts`. If the repository is renamed (or
a custom domain is used), override it:

```bash
VITEPRESS_BASE=/ pnpm docs:build
```
