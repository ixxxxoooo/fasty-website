# Fasty Website

Official website and documentation for **Fasty**, a macOS launcher. Built with
[VitePress](https://vitepress.dev) and deployed to GitHub Pages.

This repository is intentionally separate from the application repository so the
site can be public even if the app source is not, and so content changes never
trigger the app build.

## Local development

```bash
pnpm install
pnpm gen:plugins   # optional: refresh the plugin catalog from the app repo
pnpm dev
```

## Build

```bash
pnpm docs:build     # output: .vitepress/dist
pnpm preview
```

## Plugin catalog

`data/plugins.json` is generated from the app repository's `plugins/*/plugin.json`
by `scripts/gen-plugin-catalog.mjs`. It reads only user-facing fields
(`name`, `description`, feature explanations) — no internal implementation.

Locally it looks for the app repo at `../Fasty`; override with an absolute path:

```bash
FASTY_REPO=/path/to/Fasty pnpm gen:plugins
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
