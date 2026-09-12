// Generate the plugin API reference from the Fasty app repository.
//
// Sources (read-only, public contract):
//   public/fasty-sdk.js                          -> method names + parameters
//   src/services/api-registry/categories/*.ts    -> required permission per method
//
// Outputs:
//   data/api.json   - structured reference data
//   dev/api.md      - rendered reference page
//
// Internal-only APIs (pluginPerf) are excluded.

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(__dirname, '..');
const fastyRepo = resolve(process.env.FASTY_REPO || join(siteRoot, '..', 'Fasty'));
const sdkPath = join(fastyRepo, 'public', 'fasty-sdk.js');
const categoriesDir = join(fastyRepo, 'src', 'services', 'api-registry', 'categories');
const dataFile = join(siteRoot, 'data', 'api.json');
const outFile = join(siteRoot, 'dev', 'api.md');

const EXCLUDED_NAMESPACES = new Set(['pluginPerf']);

const NAMESPACE_LABELS = {
  db: '数据存储',
  clipboard: '剪贴板',
  fs: '文件系统',
  image: '图片处理',
  tools: '工具函数',
  tts: '语音朗读',
  ocr: '文字识别',
  ws: 'WebSocket',
  sse: 'Server-Sent Events',
  download: '下载',
  speedTest: '网速测试',
  browser: '内置浏览器',
  ubrowser: '内置浏览器（兼容别名）',
  ai: 'AI',
  general: '系统 / 窗口 / 输入 / 其他',
};

const NAMESPACE_ORDER = [
  'db', 'clipboard', 'fs', 'network', 'tools', 'tts', 'ocr',
  'image', 'browser', 'ubrowser', 'ws', 'sse', 'download', 'speedTest',
  'ai', 'general',
];

if (!existsSync(sdkPath)) {
  console.error(`[api] SDK not found: ${sdkPath}`);
  console.error('[api] set FASTY_REPO to the Fasty repository root');
  process.exit(1);
}

/** method -> permission, parsed from the registry category sources */
function parsePermissions() {
  const map = new Map();
  if (!existsSync(categoriesDir)) return map;
  for (const file of readdirSync(categoriesDir)) {
    if (!file.endsWith('.ts')) continue;
    const lines = readFileSync(join(categoriesDir, file), 'utf8').split('\n');
    let current = null;
    for (const line of lines) {
      const key = line.match(/^\s*'([A-Za-z][\w.]*)':\s*\{/);
      if (key) {
        current = key[1];
        continue;
      }
      if (!current) continue;
      const perm = line.match(/permission:\s*'([^']+)'/);
      if (perm) map.set(current, perm[1]);
    }
  }
  return map;
}

function parseSdk() {
  const text = readFileSync(sdkPath, 'utf8');
  const methods = [];
  const methodRe = /([A-Za-z0-9_]+):\s*function\s*\(([^)]*)\)\s*\{\s*return callApi\('([^']+)'/g;
  let m;
  while ((m = methodRe.exec(text))) {
    const params = m[2].split(',').map(p => p.trim()).filter(Boolean);
    methods.push({ method: m[3], params });
  }

  const events = [];
  const eventRe = /(on[A-Z]\w*):\s*function\s*\(([^)]*)\)\s*\{\s*return addEventListener\('([^']+)'/g;
  while ((m = eventRe.exec(text))) {
    events.push({ name: m[1], event: m[3] });
  }

  return { methods, events };
}

function namespaceOf(method) {
  return method.includes('.') ? method.split('.')[0] : 'general';
}

function renderApiPage(methods, events, permissions) {
  const lines = [];
  lines.push('---');
  lines.push('title: API 参考');
  lines.push('---');
  lines.push('');
  lines.push('# API 参考');
  lines.push('');
  lines.push(
    '插件通过全局 `fasty` 对象调用 Fasty 能力。所有方法均返回 `Promise`，建议使用 `await` 或 `.then()` 处理结果。',
  );
  lines.push('');
  lines.push('> 敏感能力需要在 `plugin.json` 的 `permissions` 中声明，详见[权限说明](./permissions.md)。');
  lines.push('');

  const grouped = new Map();
  for (const entry of methods) {
    const ns = namespaceOf(entry.method);
    if (EXCLUDED_NAMESPACES.has(ns)) continue;
    const list = grouped.get(ns) || [];
    list.push(entry);
    grouped.set(ns, list);
  }

  const orderedNamespaces = [...grouped.keys()].sort((a, b) => {
    const ia = NAMESPACE_ORDER.indexOf(a);
    const ib = NAMESPACE_ORDER.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  for (const ns of orderedNamespaces) {
    lines.push(`## ${NAMESPACE_LABELS[ns] || ns}`);
    lines.push('');
    lines.push('| 方法 | 参数 | 权限 |');
    lines.push('| --- | --- | --- |');
    const rows = grouped
      .get(ns)
      .sort((a, b) => a.method.localeCompare(b.method));
    for (const { method, params } of rows) {
      const permission = permissions.get(method);
      lines.push(
        `| \`fasty.${method}(${params.join(', ')})\` | ${params.length ? params.map(p => `\`${p}\``).join(', ') : '—'} | ${permission ? `\`${permission}\`` : '—'} |`,
      );
    }
    lines.push('');
  }

  if (events.length) {
    lines.push('## 事件监听');
    lines.push('');
    lines.push('以下方法注册事件回调，返回取消监听的函数。');
    lines.push('');
    lines.push('| 方法 | 事件名 |');
    lines.push('| --- | --- |');
    for (const e of events.sort((a, b) => a.name.localeCompare(b.name))) {
      lines.push(`| \`fasty.${e.name}(callback)\` | \`${e.event}\` |`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('本页由构建脚本从插件 SDK 自动生成。');
  lines.push('');
  return lines.join('\n');
}

function main() {
  const permissions = parsePermissions();
  const { methods, events } = parseSdk();
  const publicMethods = methods.filter(m => !EXCLUDED_NAMESPACES.has(namespaceOf(m.method)));

  mkdirSync(dirname(dataFile), { recursive: true });
  writeFileSync(dataFile, `${JSON.stringify({ methods: publicMethods, events }, null, 2)}\n`, 'utf8');

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, renderApiPage(publicMethods, events, permissions), 'utf8');

  console.log(`[api] wrote ${publicMethods.length} methods + ${events.length} events to ${outFile}`);
}

main();
