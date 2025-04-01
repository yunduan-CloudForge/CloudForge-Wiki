# Markdown Wiki 系统

这是一个基于Markdown和HTML/CSS/JavaScript开发的静态Wiki系统，专为GitHub Pages设计。本系统不需要服务器端代码，完全在浏览器中运行，使得部署和维护变得极其简单。

## 特点

- **纯静态实现**：无需数据库或服务器端代码
- **Markdown支持**：使用简单的Markdown语法编写内容
- **直接部署**：可直接部署在GitHub Pages或任何静态网站托管服务上
- **响应式设计**：适配各种设备，从手机到桌面电脑
- **文档导航**：自动生成文档目录树
- **内容搜索**：内置全文搜索功能
- **语法高亮**：支持多种编程语言的代码高亮

## 快速开始

### 本地运行

1. 克隆或下载本仓库
2. 使用npm start启动本地服务器
3. 在浏览器中访问 `http://localhost:8000`（或相应端口）

### 部署到GitHub Pages

1. Fork 本仓库或创建新仓库并上传代码
2. 在仓库设置中启用GitHub Pages
3. 选择部署分支（通常是 `main` 或 `master`）
4. 访问 `https://你的用户名.github.io/仓库名` 查看部署的Wiki

## 添加内容

1. 在 `docs` 目录中创建Markdown文件（`.md`扩展名）
2. 编辑 `docs/index.json` 文件，将新文档添加到目录结构中
3. 自定义 `config.json` 文件中的设置
4. 使用 `npm run build`命令构建Wiki的静态文件

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

## 自定义

### 配置文件

编辑 `config.json` 文件自定义Wiki的标题、描述和页脚信息：

```json
{
  "title": "我的Wiki",
  "description": "我的知识库",
  "footer": "&copy; 2023 我的Wiki | 基于Markdown的静态Wiki"
}
```

### 文档结构

编辑 `docs/index.json` 文件定义文档结构：

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
  }
}
```

## 许可证

本项目采用 Apache-2.0 license 许可证。