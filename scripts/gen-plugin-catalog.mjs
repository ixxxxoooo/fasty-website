// Generate the public plugin documentation from the Fasty app repository.
//
// Produces:
//   data/plugins.json    - structured catalog (index page + sidebar)
//   plugins/index.md     - directory page (searchable grid)
//   plugins/<id>.md      - one detail page per plugin
//
// Only user-facing manifest fields are read. Commands that are objects
// (regex matchers), internal settings and source paths are never emitted.

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(__dirname, '..');
const fastyRepo = resolve(process.env.FASTY_REPO || join(siteRoot, '..', 'Fasty'));
const pluginsDir = join(fastyRepo, 'plugins');
const outDir = join(siteRoot, 'plugins');
const dataFile = join(siteRoot, 'data', 'plugins.json');

/** Built-in plugins intentionally hidden from the public site. */
const EXCLUDE = new Set(['plugin-perf-monitor']);

const CATEGORY_ORDER = ['utility', 'development', 'network', 'system', 'media', 'ai'];

const CATEGORY_LABELS = {
  utility: '实用工具',
  development: '开发工具',
  network: '网络',
  system: '系统',
  media: '媒体',
  ai: 'AI 与智能',
};

const CATEGORY_TIPS = {
  utility: [
    '输入插件名称、功能关键词或拼音首字母即可快速找到。',
    '在选中文本后唤起 Fasty，可直接把内容带入插件处理。',
  ],
  development: [
    '支持直接粘贴文本进行转换、格式化或校验。',
    '可为常用命令绑定全局快捷键，一键直达。',
  ],
  network: ['首次使用需要网络访问权限。', '结果可能受本地网络环境影响。'],
  system: ['涉及系统操作时请谨慎，执行前确认目标。', '部分能力需要辅助功能等系统授权。'],
  media: ['支持直接从剪贴板或文件读取素材。'],
  ai: [
    '需要在「设置 → AI」中配置好服务商与模型后使用。',
    '联网使用时请注意数据隐私。',
  ],
};

const PERMISSION_LABELS = {
  'clipboard.read': '读取剪贴板',
  'clipboard.write': '写入剪贴板',
  'fs.read': '读取文件',
  'file.read': '读取文件',
  'fs.write': '写入文件',
  filesystem: '文件系统访问',
  network: '网络访问',
  'input.simulate': '模拟键盘输入',
  screen: '屏幕捕获',
  'screen.capture': '屏幕捕获',
  shell: '执行系统命令',
  'shell.execute': '执行系统命令',
  'shell.openUrl': '打开链接',
  'media.ocr': '文字识别（OCR）',
  'media.tts': '语音朗读',
  ai: 'AI 能力',
  browser: '内置浏览器控制',
};

function permissionLabel(permission) {
  if (PERMISSION_LABELS[permission]) return PERMISSION_LABELS[permission];
  if (permission.startsWith('browser.')) return `内置浏览器：${permission.slice('browser.'.length)}`;
  return permission;
}

/** String search keywords only (ignore regex matcher objects). */
function keywordsOf(feature) {
  if (!Array.isArray(feature.cmds)) return [];
  return feature.cmds.filter(c => typeof c === 'string' && c.trim()).map(c => c.trim());
}

function readPlugins() {
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
      ? manifest.features.map(f => ({
          code: f.code,
          explain: typeof f?.explain === 'string' ? f.explain.trim() : '',
          keywords: keywordsOf(f || {}),
        }))
      : [];

    plugins.push({
      id: manifest.id,
      name: manifest.name || manifest.id,
      description: (manifest.description || '').trim(),
      category: manifest.category || 'utility',
      permissions: Array.isArray(manifest.permissions) ? manifest.permissions : [],
      features,
    });
  }

  plugins.sort((a, b) => {
    const ca = CATEGORY_ORDER.indexOf(a.category);
    const cb = CATEGORY_ORDER.indexOf(b.category);
    if (ca !== cb) return (ca === -1 ? 99 : ca) - (cb === -1 ? 99 : cb);
    return a.name.localeCompare(b.name, 'zh-Hans-CN');
  });

  return plugins;
}

function renderDetailPage(plugin, all) {
  const lines = [];
  lines.push('---');
  lines.push(`title: ${plugin.name}`);
  lines.push('---');
  lines.push('');
  lines.push(`# ${plugin.name}`);
  lines.push('');
  if (plugin.description) lines.push(plugin.description);
  lines.push('');

  const withFeatures = plugin.features.filter(f => f.explain);
  if (withFeatures.length) {
    lines.push('## 主要功能');
    lines.push('');
    for (const f of withFeatures) lines.push(`- ${f.explain}`);
    lines.push('');
  }

  const keywords = [...new Set(plugin.features.flatMap(f => f.keywords))];
  if (keywords.length) {
    lines.push('## 触发关键词');
    lines.push('');
    lines.push('在搜索框中输入以下任意关键词或拼音首字母即可打开：');
    lines.push('');
    lines.push(keywords.map(k => `\`${k}\``).join('、'));
    lines.push('');
  }

  lines.push('## 使用提示');
  lines.push('');
  const tips = [
    ...(CATEGORY_TIPS[plugin.category] || []),
    '按 <kbd>⌘K</kbd> 可查看该插件的更多可用操作。',
    '按 <kbd>⌘D</kbd> 可将插件分离为独立窗口。',
  ];
  for (const tip of tips) lines.push(`- ${tip}`);
  lines.push('');

  if (plugin.permissions.length) {
    lines.push('## 所需权限');
    lines.push('');
    lines.push('该插件在使用时可能需要以下系统能力，首次调用时按提示授权即可：');
    lines.push('');
    for (const p of plugin.permissions) lines.push(`- ${permissionLabel(p)}`);
    lines.push('');
  }

  const related = all.filter(p => p.category === plugin.category && p.id !== plugin.id).slice(0, 6);
  if (related.length) {
    lines.push('## 相关插件');
    lines.push('');
    for (const r of related) lines.push(`- [${r.name}](./${r.id}.md)`);
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('[← 返回插件目录](./index.md)');
  lines.push('');

  return lines.join('\n');
}

function renderIndexPage(plugins) {
  const lines = [];
  lines.push('---');
  lines.push('title: 插件总览');
  lines.push('---');
  lines.push('');
  lines.push('# 插件总览');
  lines.push('');
  lines.push(
    `Fasty 内置 **${plugins.length}** 个插件，覆盖开发、实用工具、网络、系统与媒体等场景，全部开箱即用。点击任意插件查看详细说明。`,
  );
  lines.push('');
  lines.push('<PluginCatalog />');
  lines.push('');
  return lines.join('\n');
}

function main() {
  const plugins = readPlugins();

  // Clean previously generated detail pages (keep manual files like index via regeneration).
  if (existsSync(outDir)) {
    for (const file of readdirSync(outDir)) {
      if (file.endsWith('.md') && file !== 'index.md') rmSync(join(outDir, file));
    }
  } else {
    mkdirSync(outDir, { recursive: true });
  }

  for (const plugin of plugins) {
    writeFileSync(join(outDir, `${plugin.id}.md`), renderDetailPage(plugin, plugins), 'utf8');
  }
  writeFileSync(join(outDir, 'index.md'), renderIndexPage(plugins), 'utf8');

  mkdirSync(dirname(dataFile), { recursive: true });
  writeFileSync(dataFile, `${JSON.stringify(plugins, null, 2)}\n`, 'utf8');

  console.log(`[plugins] wrote ${plugins.length} detail pages + index + data to ${outDir}`);
}

main();
