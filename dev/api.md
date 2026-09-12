---
title: API 参考
---

# API 参考

插件通过全局 `fasty` 对象调用 Fasty 能力。所有方法均返回 `Promise`，建议使用 `await` 或 `.then()` 处理结果。

> 敏感能力需要在 `plugin.json` 的 `permissions` 中声明，详见[权限说明](./permissions.md)。

## 数据存储

| 方法 | 参数 | 权限 |
| --- | --- | --- |
| `fasty.db.clear()` | — | — |
| `fasty.db.get(key)` | `key` | — |
| `fasty.db.list(prefix)` | `prefix` | — |
| `fasty.db.put(key, value)` | `key`, `value` | — |
| `fasty.db.remove(key)` | `key` | — |

## 剪贴板

| 方法 | 参数 | 权限 |
| --- | --- | --- |
| `fasty.clipboard.add(content, contentType)` | `content`, `contentType` | `clipboard.write` |
| `fasty.clipboard.clear()` | — | `clipboard.write` |
| `fasty.clipboard.getFavorites(limit)` | `limit` | `clipboard.read` |
| `fasty.clipboard.getHistory(limit, contentType)` | `limit`, `contentType` | `clipboard.read` |
| `fasty.clipboard.readImage()` | — | `clipboard.read` |
| `fasty.clipboard.remove(id)` | `id` | `clipboard.write` |
| `fasty.clipboard.search(query, limit)` | `query`, `limit` | `clipboard.read` |
| `fasty.clipboard.toggleFavorite(id)` | `id` | `clipboard.write` |
| `fasty.clipboard.togglePin(id)` | `id` | `clipboard.write` |
| `fasty.clipboard.write(content)` | `content` | `clipboard.write` |

## 文件系统

| 方法 | 参数 | 权限 |
| --- | --- | --- |
| `fasty.fs.copy(from, to)` | `from`, `to` | `fs.write` |
| `fasty.fs.delete(path)` | `path` | `fs.write` |
| `fasty.fs.fileExists(path)` | `path` | `fs.read` |
| `fasty.fs.fileMetadata(path)` | `path` | `fs.read` |
| `fasty.fs.mkdir(path, recursive)` | `path`, `recursive` | `fs.write` |
| `fasty.fs.readDir(path)` | `path` | `fs.read` |
| `fasty.fs.readFile(path)` | `path` | `fs.read` |
| `fasty.fs.rename(from, to)` | `from`, `to` | `fs.write` |
| `fasty.fs.writeBinary(path, base64Data)` | `path`, `base64Data` | `fs.write` |
| `fasty.fs.writeFile(path, content)` | `path`, `content` | `fs.write` |

## 工具函数

| 方法 | 参数 | 权限 |
| --- | --- | --- |
| `fasty.tools.base64Decode(input)` | `input` | — |
| `fasty.tools.base64Encode(input)` | `input` | — |
| `fasty.tools.computeHash(input, algorithm)` | `input`, `algorithm` | — |
| `fasty.tools.dictLookup(word)` | `word` | — |
| `fasty.tools.dictSearch(query, limit)` | `query`, `limit` | — |
| `fasty.tools.formatJson(input, indent)` | `input`, `indent` | — |

## 语音朗读

| 方法 | 参数 | 权限 |
| --- | --- | --- |
| `fasty.tts.getVoices()` | — | — |
| `fasty.tts.speak(text, rate, voice)` | `text`, `rate`, `voice` | — |
| `fasty.tts.stop()` | — | — |

## 文字识别

| 方法 | 参数 | 权限 |
| --- | --- | --- |
| `fasty.ocr.recognize(imagePath, languages)` | `imagePath`, `languages` | `media.ocr` |

## 图片处理

| 方法 | 参数 | 权限 |
| --- | --- | --- |
| `fasty.image.adjust(inputPath, outputPath, brightness, contrast)` | `inputPath`, `outputPath`, `brightness`, `contrast` | — |
| `fasty.image.blur(inputPath, outputPath, sigma)` | `inputPath`, `outputPath`, `sigma` | — |
| `fasty.image.convert(inputPath, outputPath, quality)` | `inputPath`, `outputPath`, `quality` | — |
| `fasty.image.copyFile(path)` | `path` | `fs.read` |
| `fasty.image.crop(inputPath, outputPath, x, y, width, height)` | `inputPath`, `outputPath`, `x`, `y`, `width`, `height` | — |
| `fasty.image.flip(inputPath, outputPath, horizontal)` | `inputPath`, `outputPath`, `horizontal` | — |
| `fasty.image.getInfo(path)` | `path` | — |
| `fasty.image.grayscale(inputPath, outputPath)` | `inputPath`, `outputPath` | — |
| `fasty.image.resize(inputPath, outputPath, width, height, maintainAspect)` | `inputPath`, `outputPath`, `width`, `height`, `maintainAspect` | — |
| `fasty.image.rotate(inputPath, outputPath, degrees)` | `inputPath`, `outputPath`, `degrees` | — |
| `fasty.image.saveFile(source, destination)` | `source`, `destination` | `fs.write` |
| `fasty.image.store(bytes)` | `bytes` | — |
| `fasty.image.watermark(inputPath, outputPath, text, position, opacity)` | `inputPath`, `outputPath`, `text`, `position`, `opacity` | — |

## 内置浏览器

| 方法 | 参数 | 权限 |
| --- | --- | --- |
| `fasty.browser.close(id)` | `id` | — |
| `fasty.browser.eval(id, script)` | `id`, `script` | — |
| `fasty.browser.hide(id)` | `id` | — |
| `fasty.browser.list()` | — | — |
| `fasty.browser.navigate(id, url)` | `id`, `url` | — |
| `fasty.browser.open(url, options)` | `url`, `options` | — |
| `fasty.browser.setAlwaysOnTop(id, flag)` | `id`, `flag` | — |
| `fasty.browser.setSize(id, width, height)` | `id`, `width`, `height` | — |
| `fasty.browser.show(id)` | `id` | — |

## WebSocket

| 方法 | 参数 | 权限 |
| --- | --- | --- |
| `fasty.ws.close(id)` | `id` | — |
| `fasty.ws.connect(url)` | `url` | `network` |
| `fasty.ws.send(id, message)` | `id`, `message` | — |

## Server-Sent Events

| 方法 | 参数 | 权限 |
| --- | --- | --- |
| `fasty.sse.close(id)` | `id` | — |
| `fasty.sse.connect(url, headers)` | `url`, `headers` | `network` |

## 下载

| 方法 | 参数 | 权限 |
| --- | --- | --- |
| `fasty.download.cancel(id)` | `id` | — |
| `fasty.download.file(url, savePath, headers)` | `url`, `savePath`, `headers` | `network` |
| `fasty.download.pause(id)` | `id` | — |
| `fasty.download.resume(id)` | `id` | — |

## 网速测试

| 方法 | 参数 | 权限 |
| --- | --- | --- |
| `fasty.speedTest.download(url, durationMs)` | `url`, `durationMs` | `network` |
| `fasty.speedTest.upload(url, durationMs)` | `url`, `durationMs` | `network` |

## AI

| 方法 | 参数 | 权限 |
| --- | --- | --- |
| `fasty.ai.abort(requestId)` | `requestId` | `ai` |
| `fasty.ai.chat(options)` | `options` | `ai` |
| `fasty.ai.getConfig()` | — | — |
| `fasty.ai.getModels()` | — | `ai` |
| `fasty.ai.imageGenerate(prompt, size)` | `prompt`, `size` | `ai` |

## 系统 / 窗口 / 输入 / 其他

| 方法 | 参数 | 权限 |
| --- | --- | --- |
| `fasty.closeImagePin(id)` | `id` | — |
| `fasty.execCommand(cmd, args)` | `cmd`, `args` | — |
| `fasty.getAllDisplays()` | — | — |
| `fasty.getAppVersion()` | — | — |
| `fasty.getBatteryInfo()` | — | — |
| `fasty.getCursorPosition()` | — | — |
| `fasty.getDiskInfo()` | — | — |
| `fasty.getFileIcon(path)` | `path` | — |
| `fasty.getPath(name)` | `name` | — |
| `fasty.getPlatform()` | — | — |
| `fasty.getPrimaryDisplay()` | — | — |
| `fasty.getWindowType()` | — | — |
| `fasty.hideMainWindow()` | — | — |
| `fasty.httpRequest(options)` | `options` | — |
| `fasty.isDarkMode()` | — | — |
| `fasty.killProcess(pid)` | `pid` | — |
| `fasty.pasteFile(path)` | `path` | — |
| `fasty.pasteText(text)` | `text` | — |
| `fasty.pinImage(options)` | `options` | — |
| `fasty.readCurrentBrowserUrl()` | — | — |
| `fasty.readCurrentFolderPath()` | — | — |
| `fasty.redirect(target, payload)` | `target`, `payload` | — |
| `fasty.registerBackgroundTask(taskName, intervalMs, command)` | `taskName`, `intervalMs`, `command` | — |
| `fasty.registerGlobalShortcut(shortcut, callbackId)` | `shortcut`, `callbackId` | — |
| `fasty.removeFeature(code)` | `code` | — |
| `fasty.removeSubInput()` | — | — |
| `fasty.screenCapture(savePath)` | `savePath` | — |
| `fasty.screenColorPick()` | — | — |
| `fasty.setExpendHeight(height)` | `height` | — |
| `fasty.setFeature(feature)` | `feature` | — |
| `fasty.setSubInputValue(text)` | `text` | — |
| `fasty.setWindowAlwaysOnTop(flag)` | `flag` | — |
| `fasty.setWindowSize(width, height)` | `width`, `height` | — |
| `fasty.shellBeep()` | — | — |
| `fasty.showMainWindow()` | — | — |
| `fasty.showNotification(title, body)` | `title`, `body` | — |
| `fasty.showNotificationWithId(title, body, notificationId)` | `title`, `body`, `notificationId` | — |
| `fasty.showOpenDialog(options)` | `options` | — |
| `fasty.showSaveDialog(options)` | `options` | — |
| `fasty.simulatePaste(delayMs)` | `delayMs` | — |
| `fasty.spawnProcess(cmd, args)` | `cmd`, `args` | — |
| `fasty.startBackgroundTasks()` | — | — |
| `fasty.startDrag(paths)` | `paths` | `filesystem` |
| `fasty.stopBackgroundTasks()` | — | — |
| `fasty.streamCommand(cmd, args)` | `cmd`, `args` | `shell.execute` |
| `fasty.streamCommandKill(id)` | `id` | — |
| `fasty.subInputBlur()` | — | — |
| `fasty.subInputFocus()` | — | — |
| `fasty.subInputSelect()` | — | — |
| `fasty.typeString(text)` | `text` | — |
| `fasty.unregisterGlobalShortcut(shortcut)` | `shortcut` | — |

## shell

| 方法 | 参数 | 权限 |
| --- | --- | --- |
| `fasty.shell.openPath(path)` | `path` | `shell.execute` |
| `fasty.shell.openUrl(url)` | `url` | `shell.execute` |
| `fasty.shell.showInFolder(path)` | `path` | `shell.execute` |
| `fasty.shell.trashItem(path)` | `path` | `shell.execute` |

## 事件监听

以下方法注册事件回调，返回取消监听的函数。

| 方法 | 事件名 |
| --- | --- |
| `fasty.onBackgroundTaskTick(callback)` | `background-task-tick` |
| `fasty.onClipboardChange(callback)` | `clipboard-change` |
| `fasty.onDownloadProgress(callback)` | `download-progress` |
| `fasty.onNotificationClick(callback)` | `notification-click` |
| `fasty.onPluginDetach(callback)` | `plugin-detach` |
| `fasty.onPluginEnter(callback)` | `plugin-enter` |
| `fasty.onPluginOut(callback)` | `plugin-out` |
| `fasty.onPluginRedirect(callback)` | `plugin-redirect` |
| `fasty.onPluginShortcutTriggered(callback)` | `plugin-shortcut-triggered` |
| `fasty.onSpeedTestProgress(callback)` | `speed-test-progress` |
| `fasty.onSseEvent(callback)` | `sse-event` |
| `fasty.onStreamCommand(callback)` | `stream-command` |
| `fasty.onSubInputChange(callback)` | `sub-input-change` |
| `fasty.onThemeChanged(callback)` | `theme-changed` |
| `fasty.onWsMessage(callback)` | `ws-message` |

---

本页由构建脚本从插件 SDK 自动生成。
