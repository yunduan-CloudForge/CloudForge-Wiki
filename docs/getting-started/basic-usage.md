# 基本用法

本页面将介绍Wiki系统的基本使用方法，帮助您充分利用系统的各项功能。

## 编写文档

### 创建新文档

1. 在 `docs` 目录中创建新的Markdown文件（`.md`扩展名）
2. 编辑 `docs/index.json` 文件，将新文档添加到目录结构中
3. 使用 `npm run build`命令构建Wiki的静态文件
4. 使用 `npm start` 命令启动Wiki的开发服务器预览文档

### 文档格式

所有文档都使用Markdown格式编写。Markdown是一种轻量级标记语言，易于学习和使用。详细语法请参考[Markdown语法](../features/markdown-syntax)页面。

### 文档链接

在文档中链接到其他文档时，可以使用相对路径：

```markdown
[链接文本](相对路径)
```

例如：
- 链接到同级目录：`[基本用法](basic-usage)`
- 链接到上级目录：`[Markdown语法](../features/markdown-syntax)`
- 链接到子目录：`[子文档](subdirectory/document)`

## 目录结构

### index.json 文件格式

`docs/index.json` 文件定义了Wiki的目录结构，格式如下：

```json
{
  "分类1": {
    "type": "folder",
    "title": "显示的分类名称",
    "文档1": {
      "type": "file",
      "title": "显示的文档名称",
      "path": "category/document1"
    }
  },
  "文档2": {
    "type": "file",
    "title": "单独文档",
    "path": "document2"
  }
}
```

说明：
- `type`: 可以是 `folder`（文件夹）或 `file`（文件）
- `title`: 在导航菜单中显示的名称
- `path`: 文档的路径（不包含 `.md` 扩展名）

## 配置系统

### config.json 文件

`config.json` 文件包含Wiki系统的全局配置：

```json
{
  "title": "Wiki标题",
  "description": "Wiki描述",
  "footer": "页脚内容",
  "theme": "light",
  "defaultPage": "默认显示的页面路径",
  "repository": "GitHub仓库URL"
}
```

## 使用技巧

### 图片和资源

将图片和其他资源文件放在 `docs/assets` 目录中，然后在Markdown文件中引用：

```markdown
![图片描述](../assets/image.png)
```

### 代码高亮

使用三个反引号和语言名称来启用代码高亮：

```javascript
function example() {
  console.log("Hello, Wiki!");
}
```

### 表格

Markdown支持创建表格：

| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |

## 搜索功能

使用页面顶部的搜索框可以快速查找内容。搜索功能会检索所有文档的标题和内容，并按相关性排序显示结果。

## 下一步

- 学习[Markdown语法](../features/markdown-syntax)编写更丰富的文档
- 了解如何使用[搜索功能](../features/search)快速找到内容
- 查看[关于页面](../about)了解更多信息