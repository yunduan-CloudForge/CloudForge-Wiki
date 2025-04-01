/**
 * Markdown转HTML预处理工具
 * 此脚本用于将docs目录下的所有Markdown文件预处理为HTML文件
 * 使用方法: node md2html.js
 */

const fs = require('fs');
const path = require('path');
const marked = require('marked');
const hljs = require('highlight.js');

// 配置marked
marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(code, { language: lang }).value;
            } catch (err) {}
        }
        return hljs.highlightAuto(code).value;
    },
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
});

// 输出目录
const HTML_DIR = path.join(__dirname, '..', 'docs', 'html');

// 确保输出目录存在
if (!fs.existsSync(HTML_DIR)) {
    fs.mkdirSync(HTML_DIR, { recursive: true });
}

/**
 * 将Markdown文件转换为HTML文件
 * @param {string} mdFilePath Markdown文件路径
 * @param {string} htmlFilePath 输出的HTML文件路径
 */
function convertMarkdownToHtml(mdFilePath, htmlFilePath) {
    try {
        // 读取Markdown文件内容
        const markdown = fs.readFileSync(mdFilePath, 'utf-8');
        
        // 转换为HTML
        const html = marked.parse(markdown);
        
        // 确保输出目录存在
        const htmlDir = path.dirname(htmlFilePath);
        if (!fs.existsSync(htmlDir)) {
            fs.mkdirSync(htmlDir, { recursive: true });
        }
        
        // 写入HTML文件
        fs.writeFileSync(htmlFilePath, html, 'utf-8');
        
        console.log(`转换成功: ${mdFilePath} -> ${htmlFilePath}`);
    } catch (error) {
        console.error(`转换失败: ${mdFilePath}`, error);
    }
}

/**
 * 递归处理目录中的所有Markdown文件
 * @param {string} dir 要处理的目录
 * @param {string} baseDir 基础目录，用于计算相对路径
 */
function processDirectory(dir, baseDir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // 递归处理子目录
            processDirectory(filePath, baseDir);
        } else if (file.endsWith('.md')) {
            // 计算相对路径
            const relativePath = path.relative(baseDir, filePath);
            // 构建输出HTML文件路径
            const htmlFilePath = path.join(HTML_DIR, relativePath.replace(/\.md$/, '.html'));
            // 转换文件
            convertMarkdownToHtml(filePath, htmlFilePath);
        }
    }
}

// 主函数
function main() {
    const docsDir = path.join(__dirname, '..', 'docs');
    
    console.log('开始转换Markdown文件为HTML...');
    processDirectory(docsDir, docsDir);
    console.log('转换完成!');
}

// 执行主函数
main();