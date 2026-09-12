# 插件开发

Fasty 采用**双轨制插件体系**：随应用分发的**内置插件**追求原生质感与深度系统能力；面向社区的**第三方插件**运行在 iframe 沙箱中，安全隔离。

## 两类插件对比

| | 内置插件（Built-in） | 第三方插件（External） |
| --- | --- | --- |
| 入口 | `{PascalCase}.vue`（Vue 单文件组件） | `index.html`（iframe 沙箱） |
| 运行环境 | 与主程序同栈，首帧 0ms | 独立 iframe，与宿主 DOM 隔离 |
| 能力调用 | `import { fasty } from '@/services/fasty-api'` | `window.fasty.*`（`fasty-sdk.js`） |
| 通信方式 | 进程内调用 | `postMessage` 桥接 |
| 分发方式 | 随应用编译分发 | 本地安装 / 拖拽导入 |
| 适用场景 | 官方核心能力、复杂交互 | 社区扩展、任意前端技术栈 |

两种形态调用的是**同一套能力**：`fasty-sdk.js` 由内置 API 定义自动派生，方法名与语义完全对齐。

## 内置插件目录结构

```
plugins/{id}/
├── plugin.json          # 插件清单与命令声明
├── {PascalCase}.vue     # 主视图单文件组件（main 入口）
├── types.ts             # 插件私有类型
├── {name}Utils.ts       # 插件私有逻辑
├── components/          # 仅本插件使用的子组件
└── __tests__/           # 单元测试
```

内置插件要求**业务自闭环**：可以引用全局基础设施（`@/services/fasty-api`、`@/composables/*`、全局样式 Token、`vue-i18n`、`lucide-vue-next`），但**禁止跨插件目录相互引用**。

## 第三方插件目录结构

```
my-plugin/
├── plugin.json          # 清单（main 指向 index.html）
├── index.html           # 入口页面
└── fasty-sdk.js         # 官方 SDK（从应用复制）
```

## 下一步

- [plugin.json 配置](./manifest.md) — 清单字段与命令声明。
- [内置插件开发](./builtin.md) — 使用 Vue 开发内置插件。
- [第三方插件开发](./external.md) — 使用 iframe + SDK 开发外部插件。
- [API 参考](./api.md) — 全部可用 `fasty` 方法。
- [权限说明](./permissions.md) — 权限声明与校验规则。
- [打包与接入](./integrate.md) — 安装、加载与发布。
