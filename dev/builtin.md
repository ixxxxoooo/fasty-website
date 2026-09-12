# 内置插件开发

内置插件是随 Fasty 一起编译、分发的官方插件，入口为 Vue 单文件组件。

## 目录结构

```
plugins/my-plugin/
├── plugin.json
├── MyPlugin.vue          # main 指向此文件
├── types.ts
├── myPluginUtils.ts
├── components/
└── __tests__/MyPlugin.spec.ts
```

## 主视图组件

```vue
<!-- @author your-name -->
<script setup lang="ts">
import { fasty } from '@/services/fasty-api'
import { useI18n } from 'vue-i18n'
import { inject, onMounted, onUnmounted, ref } from 'vue'

const { t } = useI18n()
const pluginData = inject<Record<string, unknown>>('pluginData', {})
const text = ref('')

onMounted(async () => {
  const saved = await fasty.db.get('draft')
  if (typeof saved === 'string') text.value = saved
})

onUnmounted(() => {
  // 释放编辑器、定时器、事件监听等资源
})
</script>

<template>
  <div class="my-plugin">
    <textarea v-model="text" />
  </div>
</template>
```

## 能力调用

从全局基础设施导入统一的 `fasty` 对象：

```ts
import { fasty } from '@/services/fasty-api'

await fasty.shellOpenPath('/path/to/file')          // 打开文件
await fasty.clipboard.write('hello')                 // 写入剪贴板
const data = await fasty.httpRequest({ url: 'https://example.com' })
const models = await fasty.ai.getModels()
```

完整方法见 [API 参考](./api.md)。

## 数据持久化

推荐使用 `fasty.db`（按插件 ID 自动隔离）：

```ts
await fasty.db.put('config', { theme: 'dark' })
const config = await fasty.db.get('config')
const keys = await fasty.db.list('draft:')
await fasty.db.remove('config')
```

同时可以通过 `inject('pluginData')` 读写宿主注入的轻量共享数据，用于窗口间即时同步。

## 生命周期与事件

```ts
import { fasty } from '@/services/fasty-api'

const off = fasty.onPluginEnter(({ code }) => {
  // 插件进入，code 为命中的指令编码
})

fasty.onPluginOut(() => { /* 插件退出 */ })
fasty.onThemeChanged((mode) => { /* 'light' | 'dark' 变化 */ })
fasty.clipboard.onClipboardChange((payload) => { /* 剪贴板变化 */ })

// 组件卸载时取消监听
onUnmounted(() => off())
```

## 子输入框

在主搜索框下方提供插件级输入框：

```ts
const off = fasty.setSubInput(({ text }) => {
  // 用户输入变化
}, '请输入内容', true)

fasty.setSubInputValue('预设内容')
onUnmounted(() => {
  off()
  fasty.removeSubInput()
})
```

## 分离窗口

在 `plugin.json` 的 `pluginSetting.detach` 中配置尺寸与置顶；用户可用 <kbd>⌘D</kbd> 手动分离。分离窗口与主窗口共享同一套组件与 `fasty.db` 数据。

## 多语言与图标

- 所有用户可见文案通过 `t('key')` 使用，并**同时**在 `src/locales/zh-CN.ts` 与 `src/locales/en-US.ts` 注册词条。
- 使用 `lucide-vue-next` 图标，并在 `src/utils/pluginIcons.ts` 中注册图标名，供搜索列表渲染。

## 约定

- 单个 `.vue` 文件建议不超过 500 行；业务逻辑提取到 `use*.ts` 或 `*Utils.ts`。
- 禁止跨插件目录 `import`；只允许依赖全局基础设施。
- 组件卸载时清理定时器、事件监听、编辑器实例等资源。
