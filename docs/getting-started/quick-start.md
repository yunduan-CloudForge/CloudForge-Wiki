# 快速开始

欢迎使用基于Markdown的Wiki系统！本指南将帮助您快速上手并开始使用这个系统。

## 系统简介

这是一个基于HTML、CSS和JavaScript开发的静态Wiki系统，使用Markdown格式编写内容并通过构建静态文件，可以直接部署在GitHub Pages上。不需要服务器端代码，完全在浏览器中运行。（同类产品：mkdocs）

## 部署步骤

### 1. 克隆或下载仓库

```bash
git clone https://github.com/yourusername/wiki-system.git
cd wiki-system
```

### 2. 修改配置

编辑 `config.json` 文件，设置Wiki的标题、描述和页脚信息：

```json
{
  "title": "我的Wiki",
  "description": "我的知识库",
  "footer": "&copy; 2023 我的Wiki | 基于Markdown的静态Wiki"
}
```

### 3. 添加内容

1. 在 `docs` 目录中创建Markdown文件
2. 编辑 `docs/index.json` 文件，定义文档结构
3. 使用 `npm run build`命令构建Wiki的静态文件

### 4. 部署到GitHub Pages

1. 创建GitHub仓库
2. 推送代码到仓库
3. 在仓库设置中启用GitHub Pages

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

## 目录结构

```
├── index.html          # 主页面
├── config.json         # 配置文件
├── css/                # 样式文件
│   └── style.css       # 主样式表
├── docs/               # 静态文档
├── js/                 # JavaScript文件
│   └── app.js          # 应用逻辑
└── docs/               # 文档目录
    ├── index.json      # 文档结构定义
    └── *.md            # Markdown文档
```

## 下一步

- 查看[基本用法](basic-usage)了解更多功能
- 学习[Markdown语法](../features/markdown-syntax)编写精美文档
- 了解如何使用[搜索功能](../features/search)快速找到内容