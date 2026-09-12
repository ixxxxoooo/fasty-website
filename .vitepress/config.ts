import { defineConfig } from 'vitepress'
import plugins from '../data/plugins.json'

// Served from a GitHub Pages project site: https://<user>.github.io/<repo>/
// Override with VITEPRESS_BASE=/ for a custom domain or a user/organization page.
const base = process.env.VITEPRESS_BASE || '/fasty-website/'

const APP_REPO = 'https://github.com/ixxxxoooo/Fasty'

interface CatalogPlugin {
  id: string
  name: string
  category: string
}

const CATEGORY_ORDER = ['utility', 'development', 'network', 'system', 'media', 'ai']
const CATEGORY_LABELS: Record<string, string> = {
  utility: '实用工具',
  development: '开发工具',
  network: '网络',
  system: '系统',
  media: '媒体',
  ai: 'AI 与智能',
}

const catalog = plugins as CatalogPlugin[]

const pluginSidebar = [
  { text: '插件总览', link: '/plugins/' },
  ...CATEGORY_ORDER.map(category => ({
    text: CATEGORY_LABELS[category],
    collapsed: false,
    items: catalog
      .filter(p => p.category === category)
      .map(p => ({ text: p.name, link: `/plugins/${p.id}` })),
  })).filter(group => group.items.length > 0),
]

export default defineConfig({
  base,
  lang: 'zh-CN',
  title: 'Fasty',
  description: '面向 macOS 的统一效率入口：一键唤起，搜索即执行。',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: `${base}favicon.png` }],
    ['link', { rel: 'apple-touch-icon', href: `${base}logo.png` }],
    ['meta', { name: 'theme-color', content: '#007aff' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Fasty' }],
    ['meta', { property: 'og:description', content: '面向 macOS 的统一效率入口：一键唤起，搜索即执行。' }],
    ['meta', { property: 'og:image', content: `${base}og.png` }],
  ],

  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'Fasty',

    nav: [
      { text: '指南', link: '/guide/getting-started', activeMatch: '/guide/' },
      { text: '插件', link: '/plugins/', activeMatch: '/plugins/' },
      { text: '开发', link: '/dev/', activeMatch: '/dev/' },
      { text: '更新日志', link: `${APP_REPO}/releases` },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' },
          ],
        },
        {
          text: '使用指南',
          items: [
            { text: '功能说明', link: '/guide/features' },
            { text: '快捷键', link: '/guide/shortcuts' },
            { text: '常见问题', link: '/guide/faq' },
          ],
        },
      ],
      '/plugins/': pluginSidebar,
      '/dev/': [
        {
          text: '插件开发',
          items: [
            { text: '开发总览', link: '/dev/' },
            { text: 'plugin.json 配置', link: '/dev/manifest' },
            { text: '内置插件开发', link: '/dev/builtin' },
            { text: '第三方插件开发', link: '/dev/external' },
          ],
        },
        {
          text: '接口与接入',
          items: [
            { text: 'API 参考', link: '/dev/api' },
            { text: '权限说明', link: '/dev/permissions' },
            { text: '打包与接入', link: '/dev/integrate' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: APP_REPO }],

    search: {
      provider: 'local',
    },

    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一页', next: '下一页' },
    lastUpdated: { text: '最后更新' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '主题',
    externalLinkIcon: true,

    footer: {
      message: '本地优先 · 一键直达',
      copyright: `Copyright © 2026 Fasty · <a href="${APP_REPO}">GitHub</a>`,
    },
  },
})
