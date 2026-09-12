# 安装 Fasty

## 系统要求

- macOS 12 或更高版本
- 支持 Apple Silicon 与 Intel 处理器

## 下载

前往 [GitHub Releases](https://github.com/ixxxxoooo/Fasty/releases/latest) 下载最新的 `.dmg` 安装包，打开后将 **Fasty** 拖入「应用程序」文件夹。

## 首次打开

Fasty 目前未经过 Apple 公证，首次打开时 macOS 会提示「无法验证开发者」。这是正常的，可按以下任一方式放行：

**方式一：右键打开**

在「应用程序」中右键点击 Fasty，选择「打开」，然后在弹窗中再次确认。

**方式二：终端命令**

```bash
xattr -cr /Applications/Fasty.app
```

执行后即可正常打开。

## 授权说明

首次使用部分功能时，系统会请求相应权限，按需授权即可：

| 权限 | 用途 |
| --- | --- |
| 辅助功能 | 全局快捷键、读取选中文本、模拟粘贴 |
| 屏幕录制 | 截图与屏幕取色 |
| 通知 | 完成提示与提醒 |

所有权限都可以在「系统设置 → 隐私与安全性」中随时调整。

## 更新

新版本会发布在 [Releases](https://github.com/ixxxxoooo/Fasty/releases)。下载覆盖安装即可，个人数据会保留。
