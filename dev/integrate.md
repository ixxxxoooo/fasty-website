# 打包与接入

本章说明如何把开发好的插件接入 Fasty —— 从本地调试到安装使用。

## 内置插件

内置插件随应用一起编译，无需单独安装。

1. 将插件目录放入应用的 `plugins/{id}/`。
2. 在 `src/utils/pluginIcons.ts` 中注册所用的图标名。
3. 在 `src/locales/zh-CN.ts` 与 `src/locales/en-US.ts` 同步补充文案。
4. 运行应用即可在搜索框中通过 `cmds` 关键词进入插件。

## 第三方插件

第三方插件以目录形式分发，包含 `plugin.json`、入口页面与 `fasty-sdk.js`。

### 打包清单

```
my-plugin/
├── plugin.json
├── index.html
├── fasty-sdk.js
└── 其他静态资源…
```

打包注意事项：

- `plugin.json` 的 `main` 必须指向 `index.html`。
- 所有资源使用**相对路径**，确保在 iframe 中加载正常。
- 不要压缩或修改 `fasty-sdk.js`。

### 安装

在 Fasty 的「设置 → 插件」中安装：

1. 打开插件管理页面。
2. 选择「安装第三方插件」，选中插件目录；或直接将插件目录**拖拽**到窗口。
3. 安装后插件出现在列表与搜索中，可随时启用、禁用或卸载。

### 调试

- 第三方插件运行在 iframe 中，可使用开发者工具查看其控制台输出。
- 修改插件文件后重新加载插件即可看到更新。
- 遇到权限错误时，检查 `plugin.json` 的 `permissions` 是否声明完整。

## 版本与更新

- `plugin.json` 的 `version` 使用语义化版本号。
- 更新插件时替换整个插件目录并重启/重新加载。
- 插件数据通过 `fasty.db` 按插件 ID 隔离保存，更新插件不会丢失数据。

## 接入检查清单

- [ ] `plugin.json` 字段完整（`id` / `name` / `main` / `version` / `features`）。
- [ ] `main` 指向正确的入口（内置 `.vue`，第三方 `index.html`）。
- [ ] 所需权限已在 `permissions` 中声明。
- [ ] 用户可见文案已做多语言处理。
- [ ] 组件卸载或页面离开时释放资源。
- [ ] 在浅色 / 深色模式下均显示正常。
