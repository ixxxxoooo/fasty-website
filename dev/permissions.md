# 权限说明

Fasty 对敏感能力实行**白名单管控**：插件只有在 `plugin.json` 的 `permissions` 中声明后，才能调用对应 API；未声明时调用会抛出权限错误。

## 声明方式

```json
{
  "id": "my-plugin",
  "name": "我的插件",
  "main": "index.html",
  "permissions": ["clipboard.read", "clipboard.write", "network", "fs.read"]
}
```

## 权限列表

| 权限 | 说明 | 相关能力 |
| --- | --- | --- |
| `clipboard.read` | 读取剪贴板 | `clipboard.getHistory` / `getFavorites` / `readImage` / `search` |
| `clipboard.write` | 写入剪贴板 | `clipboard.write` / `add` / `remove` / `clear` / `togglePin` / `toggleFavorite` |
| `fs.read` | 读取文件 | `fs.readFile` / `readDir` / `fileExists` / `fileMetadata` |
| `fs.write` | 写入与修改文件 | `fs.writeFile` / `writeBinary` / `rename` / `copy` / `delete` / `mkdir` |
| `filesystem` | 文件系统访问（综合） | 需要文件读写时声明 |
| `network` | 网络访问 | `httpRequest` / `download` / `ws` / `sse` / `speedTest` |
| `input.simulate` | 模拟键盘输入 | `pasteText` / `pasteFile` / `typeString` / `simulatePaste` |
| `screen` / `screen.capture` | 屏幕捕获 | `screenCapture` / `screenColorPick` / `getPrimaryDisplay` |
| `shell` / `shell.execute` | 执行系统命令 | `execCommand` / `spawnProcess` / `streamCommand` |
| `shell.openUrl` | 打开链接 | `shellOpenUrl` |
| `media.ocr` | 文字识别 | `ocr.recognize` |
| `media.tts` | 语音朗读 | `tts.speak` / `stop` / `getVoices` |
| `ai` | AI 能力 | `ai.chat` / `chatStream` / `getModels` / `imageGenerate` |
| `browser.*` | 内置浏览器控制 | `browser.open` / `navigate` / `eval` / `show` / `hide` 等 |

> 未列出的能力默认无需声明权限，例如 `db.*`（数据按插件隔离）、`tools.*`（纯计算）等。

## 校验行为

- 权限在**调用时**校验，而非安装时。
- 未声明权限时抛出 `PermissionDeniedError`，错误信息会指出缺失的权限名。
- 权限校验结果会被缓存，同一插件同一权限不会重复校验。

## 最佳实践

- **最小权限原则**：只声明插件真正需要的能力。
- **能力透明**：插件页面在插件详情中展示所需权限，方便用户了解。
- **优雅降级**：捕获权限错误并给出提示，而不是直接崩溃。

```js
try {
  await fasty.clipboard.write(text)
} catch (err) {
  // 提示用户该功能需要剪贴板权限
  console.warn('剪贴板权限不可用', err)
}
```
