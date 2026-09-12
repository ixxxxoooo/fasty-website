# plugin.json 配置

每个插件根目录都必须包含 `plugin.json`，用于描述插件信息、可被搜索的指令以及所需权限。

## 顶层字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 插件唯一标识，建议使用 kebab-case，如 `json-formatter` |
| `name` | string | 是 | 插件显示名称 |
| `main` | string | 是 | 入口文件。内置插件为 `.vue`，第三方插件为 `index.html` |
| `version` | string | 是 | 语义化版本号，如 `1.0.0` |
| `author` | string | 否 | 作者 |
| `description` | string | 否 | 一句话说明，展示在插件列表与搜索中 |
| `logo` | string | 否 | 插件图标文件（相对插件目录） |
| `icon` | string | 否 | 内置矢量图标名（已在图标库中注册） |
| `category` | string | 否 | 分类：`utility` / `development` / `network` / `system` / `media` / `ai` |
| `permissions` | string[] | 否 | 需要申请的权限，见[权限说明](./permissions.md) |
| `pluginSetting` | object | 否 | 窗口与分离窗口配置 |
| `features` | object[] | 是 | 指令声明，决定搜索命中与进入方式 |

## features 指令

`features` 是数组，每个元素声明一条可被搜索或内容识别触发的指令。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `code` | string | 指令编码，插件内唯一 |
| `explain` | string | 指令说明，展示在结果副标题 |
| `icon` | string | 指令图标（可选，缺省用插件图标） |
| `cmds` | (string \| object)[] | 触发关键词或内容匹配规则 |
| `mainHide` | boolean | 为 `true` 时不显示在默认列表 |

### cmds：字符串关键词

普通字符串即为搜索关键词，支持中文、英文与拼音首字母匹配。

```json
"cmds": ["JSON 格式化", "json", "格式化", "format"]
```

### cmds：内容匹配规则

对象形式用于在唤起时根据剪贴板或选中内容自动推荐该指令：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | string | `regex`（正则文本）、`img`（图片）、`over`（选中文本）、`files`（文件）、`window`（窗口） |
| `label` | string | 推荐项的显示文案 |
| `match` | string | `regex` 类型的正则表达式 |
| `minLength` / `maxLength` | number | 文本长度范围 |

```json
{
  "type": "regex",
  "label": "格式化 JSON",
  "match": "^\\s*[{\\[]",
  "minLength": 2
}
```

## pluginSetting

```json
"pluginSetting": {
  "height": 544,
  "detach": {
    "width": 900,
    "height": 620,
    "minWidth": 640,
    "minHeight": 480,
    "alwaysOnTop": false,
    "chrome": "default",
    "autoOpen": false
  }
}
```

| 字段 | 说明 |
| --- | --- |
| `height` | 插件在主窗口中的默认高度 |
| `detach.width` / `detach.height` | 分离窗口尺寸 |
| `detach.minWidth` / `detach.minHeight` | 分离窗口最小尺寸 |
| `detach.alwaysOnTop` | 分离窗口是否默认置顶 |
| `detach.chrome` | 窗口装饰：`default` 或 `none`（无边框） |
| `detach.autoOpen` | 进入插件时是否自动分离 |

## 完整示例

```json
{
  "id": "json-formatter",
  "name": "JSON 格式化",
  "main": "JsonFormatter.vue",
  "version": "1.0.0",
  "author": "ixxxxxxxx",
  "description": "JSON 格式化与压缩，支持语法高亮",
  "category": "development",
  "permissions": [],
  "pluginSetting": { "height": 544 },
  "features": [
    {
      "code": "format",
      "explain": "格式化 / 压缩 / 校验 JSON",
      "icon": "braces",
      "cmds": [
        "JSON 格式化",
        "json",
        "format",
        { "type": "regex", "label": "格式化 JSON", "match": "^\\s*[{\\[]", "minLength": 2 }
      ]
    }
  ]
}
```
