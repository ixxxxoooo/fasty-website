# 第三方插件开发

第三方插件运行在独立的 `<iframe>` 沙箱中，可以使用任意前端技术栈（原生 HTML/JS、React、Vue…），通过官方 SDK `fasty-sdk.js` 调用 Fasty 能力。

## 目录结构

```
my-plugin/
├── plugin.json          # main 指向 index.html
├── index.html           # 插件入口
└── fasty-sdk.js         # 官方 SDK（从应用复制，勿修改）
```

`plugin.json` 示例：

```json
{
  "id": "my-plugin",
  "name": "我的插件",
  "main": "index.html",
  "version": "1.0.0",
  "description": "示例第三方插件",
  "category": "utility",
  "permissions": ["clipboard.read", "clipboard.write", "network"],
  "features": [
    { "code": "run", "explain": "运行我的插件", "cmds": ["我的插件", "myplugin"] }
  ]
}
```

## 引入 SDK

在 `index.html` 中引入 SDK，加载后全局对象 `window.fasty` 自动可用：

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>我的插件</title>
  </head>
  <body>
    <button id="copy">复制当前时间</button>
    <script src="fasty-sdk.js"></script>
    <script>
      document.getElementById('copy').addEventListener('click', async () => {
        await window.fasty.clipboard.write(new Date().toLocaleString())
      })
    </script>
  </body>
</html>
```

## 调用能力

`window.fasty` 的方法与内置插件完全一致，均返回 `Promise`：

```js
// 读取数据
const draft = await fasty.db.get('draft')

// 打开链接
await fasty.shellOpenUrl('https://example.com')

// 发送 HTTP 请求
const resp = await fasty.httpRequest({ url: 'https://api.example.com' })

// 事件监听（返回取消监听函数）
const off = fasty.onThemeChanged((mode) => console.log(mode))
```

完整方法列表见 [API 参考](./api.md)。

## 通信协议

SDK 通过 `postMessage` 与宿主通信，协议如下（一般无需手动处理，了解即可）。

**插件 → 宿主**

```js
// 调用 API
window.parent.postMessage({
  type: 'fasty-api-call',
  id: 'req_1',
  method: 'clipboard.write',
  args: ['hello'],
}, '*')

// 通知宿主 SDK 已就绪
window.parent.postMessage({ type: 'fasty-plugin-ready' }, '*')
```

**宿主 → 插件**

```js
// API 响应
{ type: 'fasty-api-response', id: 'req_1', success: true, data: ... }
{ type: 'fasty-api-response', id: 'req_1', success: false, error: '...' }

// 事件广播
{ type: 'fasty-event', event: 'theme-changed', payload: 'dark' }
```

## 权限

第三方插件严格受 `plugin.json` 的 `permissions` 白名单管控。调用未声明的能力会返回错误。详见[权限说明](./permissions.md)。

## 安全约束

- iframe 与宿主 DOM、Vue 运行时完全隔离，无法直接访问宿主页面。
- 仅能通过 SDK 调用白名单内的能力。
- 请勿在插件中硬编码任何密钥；如确需使用，应让用户自行配置并保存在 `fasty.db` 中。

## 下一步

- [打包与接入](./integrate.md) — 如何安装与调试你的插件。
