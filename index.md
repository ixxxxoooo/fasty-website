---
layout: home

hero:
  name: Fasty
  text: 统一效率入口
  tagline: 面向 macOS 的一站式启动器：一个快捷键唤起，输入即搜索，选中即执行，把应用、文件、插件与常用操作收进同一个搜索框。
  image:
    src: /logo.png
    alt: Fasty
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 下载
      link: https://github.com/ixxxxoooo/Fasty/releases/latest
    - theme: alt
      text: GitHub
      link: https://github.com/ixxxxoooo/Fasty

features:
  - icon: ⚡
    title: 全局唤起
    details: 默认 ⌥Space 一键呼出，失焦自动隐藏，随时待命又不打断手头的工作。
  - icon: 🔍
    title: 多源搜索
    details: 插件、应用、文件、系统设置与网页快开统一搜索，支持拼音全拼与首字母。
  - icon: 🧩
    title: 40+ 内置插件
    details: JSON、时间戳、剪贴板历史、截图、翻译、天气、日历……开箱即用。
  - icon: 📋
    title: 剪贴板历史
    details: 自动记录复制内容，随时搜索、收藏，一键再次粘贴。
  - icon: 📸
    title: 截图与标注
    details: 区域 / 窗口 / 全屏截图，内置编辑器、标注工具与取色器。
  - icon: 🪟
    title: 分离窗口与置顶
    details: 长任务放入独立窗口常驻，图片、文本、文件可 Pin 到桌面。
  - icon: ⌨️
    title: 快捷键自定义
    details: 全局与插件命令快捷键可自定义，自带冲突检测与录制界面。
  - icon: 🌗
    title: 深浅色与多语言
    details: 跟随系统主题，中文 / 英文界面自由切换。
  - icon: 🔒
    title: 本地优先
    details: 数据默认保存在本地，仅在你使用联网功能时才需要网络。
---

## 三步上手

<div class="home-steps">

1. **唤起** — 按下 <kbd>⌥Space</kbd>，搜索框即刻出现。
2. **查找** — 输入应用名、文件名、插件名或关键词，支持拼音与首字母。
3. **执行** — 用 <kbd>↑</kbd> <kbd>↓</kbd> 选择，按 <kbd>Enter</kbd> 直达结果。

</div>

## 下一步

- [快速开始](/guide/getting-started) — 了解基本用法。
- [安装 Fasty](/guide/installation) — 下载并完成首次设置。
- [插件总览](/plugins/) — 浏览全部内置插件。
- [快捷键](/guide/shortcuts) — 掌握高效操作。

<style>
.home-steps ol {
  padding-left: 1.2em;
}
.home-steps kbd {
  display: inline-block;
  padding: 1px 6px;
  font-size: 12px;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-bottom-width: 2px;
  border-radius: 5px;
}
</style>
