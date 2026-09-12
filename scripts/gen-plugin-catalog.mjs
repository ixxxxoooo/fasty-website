// Generate the public plugin catalog from the Fasty app repository.
//
// Only user-facing fields are read (name / description / feature explanations).
// Internal details (commands, permissions, settings, source paths) are never
// emitted, so the website does not expose implementation.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(__dirname, '..');
const fastyRepo = resolve(process.env.FASTY_REPO || join(siteRoot, '..', 'Fasty'));
const pluginsDir = join(fastyRepo, 'plugins');
const outFile = join(siteRoot, 'data', 'plugins.json');

/** Built-in plugins intentionally hidden from the public catalog. */
const EXCLUDE = new Set(['plugin-perf-monitor']);

const CATEGORY_ORDER = ['utility', 'development', 'network', 'system', 'media', 'ai'];

if (!existsSync(pluginsDir)) {
  console.error(`[plugins] app plugins directory not found: ${pluginsDir}`);
  console.error('[plugins] set FASTY_REPO to the Fasty repository root');
  process.exit(1);
}

const plugins = [];
for (const entry of readdirSync(pluginsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const manifestPath = join(pluginsDir, entry.name, 'plugin.json');
  if (!existsSync(manifestPath)) continue;

  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch {
    console.warn(`[plugins] skip invalid manifest: ${manifestPath}`);
    continue;
  }

  const isBuiltin = typeof manifest.main === 'string' && manifest.main.endsWith('.vue');
  if (!isBuiltin || EXCLUDE.has(manifest.id)) continue;

  const features = Array.isArray(manifest.features)
    ? manifest.features
        .map(f => (typeof f?.explain === 'string' ? f.explain.trim() : ''))
        .filter(Boolean)
    : [];

  plugins.push({
    id: manifest.id,
    name: manifest.name || manifest.id,
    description: (manifest.description || '').trim(),
    category: manifest.category || 'utility',
    features,
  });
}

plugins.sort((a, b) => {
  const ca = CATEGORY_ORDER.indexOf(a.category);
  const cb = CATEGORY_ORDER.indexOf(b.category);
  if (ca !== cb) return (ca === -1 ? 99 : ca) - (cb === -1 ? 99 : cb);
  return a.name.localeCompare(b.name, 'zh-Hans-CN');
});

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, `${JSON.stringify(plugins, null, 2)}\n`, 'utf8');
console.log(`[plugins] wrote ${plugins.length} plugins to ${outFile}`);
