import { defineConfig } from 'vitepress'

// Served from a GitHub Pages project site: https://<user>.github.io/<repo>/
// Override with VITEPRESS_BASE=/ for a custom domain or a user/organization page.
const base = process.env.VITEPRESS_BASE || '/fasty-website/'

const APP_REPO = 'https://github.com/ixxxxoooo/Fasty'

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
      '/plugins/': [
        {
          text: '插件',
          items: [{ text: '插件总览', link: '/plugins/' }],
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
