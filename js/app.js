// 全局变量
let wikiData = {};
let searchIndex = {};

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
});

// 初始化应用
async function initApp() {
    try {
        // 加载配置文件
        await loadConfig();
        
        // 生成导航目录
        await generateTOC();
        
        // 处理URL路由
        handleRouting();
        
        // 初始化Markdown渲染器配置
        initMarkdownRenderer();
    } catch (error) {
        console.error('初始化应用失败:', error);
        showErrorMessage('初始化应用失败，请刷新页面重试。');
    }
}

// 加载配置文件
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const config = await response.json();
        
        // 设置网站标题
        if (config.title) {
            document.title = config.title;
            document.querySelector('.logo h1').textContent = config.title;
        }
        
        // 设置页脚信息
        if (config.footer) {
            document.querySelector('footer p').innerHTML = config.footer;
        }
        
        return config;
    } catch (error) {
        console.warn('加载配置文件失败，使用默认配置:', error);
        return {
            title: 'Wiki系统',
            footer: '&copy; 2023 Wiki系统 | 基于Markdown的静态Wiki'
        };
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索功能
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
    
    // 返回顶部按钮
    createBackToTopButton();
    
    // 监听导航链接点击
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            const href = e.target.getAttribute('href');
            if (href && href.startsWith('#/')) {
                e.preventDefault();
                navigateTo(href.substring(2));
            }
        }
    });
    
    // 添加文件夹点击事件
    document.addEventListener('click', (e) => {
        const folderHeader = e.target.closest('.folder-header');
        if (folderHeader) {
            const folder = folderHeader.closest('.nav-folder');
            folder.classList.toggle('active');
        }
    });
}

// 初始化Markdown渲染器配置
function initMarkdownRenderer() {
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
}

// 生成导航目录
async function generateTOC() {
    try {
        const response = await fetch('docs/index.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        wikiData = data;
        
        // 构建搜索索引
        buildSearchIndex();
        
        // 生成目录HTML
        const tocElement = document.getElementById('toc');
        tocElement.innerHTML = generateTOCHTML(data, 0, 10, new Set());
    } catch (error) {
        console.error('加载目录失败:', error);
        const tocElement = document.getElementById('toc');
        tocElement.innerHTML = `
            <div class="toc-error">
                <p>加载目录失败。</p>
                <p>请确保 docs/index.json 文件存在并格式正确。</p>
            </div>
        `;
    }
}

// 生成目录HTML
function generateTOCHTML(data, level = 0, maxLevel = 10) {
    // 防止递归过深
    if (level > maxLevel) {
        console.warn('目录嵌套层级过深，已截断显示');
        return '';
    }
    
    // 空数据检查
    if (!data || Object.keys(data).length === 0) {
        return '';
    }
    
    let html = '<ul class="nav-list">';
    
    try {
        // 定义导航项的显示顺序
        const orderMap = {
            "入门指南": 1,
            "功能介绍": 2,
            "关于": 3
        };

        // 修改排序逻辑
        const sortedEntries = Object.entries(data).sort((a, b) => {
            if (a[0] === '_index') return -1;
            if (b[0] === '_index') return 1;
            
            const orderA = orderMap[a[0]] || 999;
            const orderB = orderMap[b[0]] || 999;
            if (orderA !== orderB) {
                return orderA - orderB;
            }
            return (a[1].title || a[0]).localeCompare(b[1].title || b[0]);
        });

        for (const [key, value] of sortedEntries) {
            if (key === '_index' || !value || typeof value !== 'object') continue;
            
            const title = value.title || key;
            const path = value.path || key;
            
            if (value.type === 'file') {
                html += `<li class="nav-item">
                    <a href="#/${path}" title="${title}">
                        <i class="fas fa-file-alt"></i>
                        <span>${title}</span>
                    </a>
                </li>`;
            } else if (value.type === 'folder') {
                const subMenu = generateTOCHTML(value, level + 1, maxLevel);
                if (subMenu) {
                    html += `<li class="nav-folder">
                        <div class="folder-header">
                            <i class="fas fa-chevron-right folder-icon"></i>
                            <span class="folder-title" title="${title}">${title}</span>
                        </div>
                        ${subMenu}
                    </li>`;
                }
            }
        }
        
        html += '</ul>';
        return html;
    } catch (error) {
        console.error('生成目录时出错:', error);
        return '';
    }
}

// 处理URL路由
function handleRouting() {
    window.addEventListener('hashchange', () => {
        const path = window.location.hash.substring(2) || '';
        loadContent(path);
    });
    
    // 初始加载
    const path = window.location.hash.substring(2) || '';
    loadContent(path);
}

// 加载内容
async function loadContent(path) {
    const contentElement = document.getElementById('content');
    
    if (!path) {
        // 显示欢迎页面
        contentElement.innerHTML = document.querySelector('.welcome-message').outerHTML;
        return;
    }
    
    try {
        contentElement.innerHTML = '<div class="loader"></div>';
        
        // 确保路径格式正确，移除开头的斜杠（如果有）
        const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
        
        // 尝试加载预构建的HTML文件
        try {
            console.log('正在加载HTML文件:', `docs/html/${normalizedPath}.html`);
            const response = await fetch(`docs/html/${normalizedPath}.html`);
            
            if (response.ok) {
                const html = await response.text();
                contentElement.innerHTML = `<div class="markdown-content">${html}</div>`;
                
                // 处理页面内链接
                processPageLinks();
                
                // 滚动到顶部
                window.scrollTo(0, 0);
                return;
            }
        } catch (htmlError) {
            console.warn('加载HTML文件失败，尝试加载Markdown文件:', htmlError);
        }
        
        // 如果HTML文件不存在或加载失败，回退到加载Markdown文件
        console.log('正在加载Markdown文件:', `docs/${normalizedPath}.md`);
        const response = await fetch(`docs/${normalizedPath}.md`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const markdown = await response.text();
        // 使用marked()函数而不是marked.parse()，以兼容当前版本的marked库
        const html = marked(markdown);
        
        contentElement.innerHTML = `<div class="markdown-content">${html}</div>`;
        
        // 处理页面内链接
        processPageLinks();
        
        // 滚动到顶部
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('加载内容失败:', error);
        contentElement.innerHTML = `
            <div class="error-message">
                <h2>内容加载失败</h2>
                <p>无法加载 ${path}.md 文件。</p>
                <p>请确保文件存在并且格式正确。</p>
                <p>错误详情: ${error.message}</p>
            </div>
        `;
    }
}

// 处理页面内链接
function processPageLinks() {
    const links = document.querySelectorAll('.markdown-content a');
    const currentPath = window.location.hash.substring(2) || '';
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#/')) {
            // 相对链接转换为Wiki链接
            if (href.startsWith('#')) {
                // 页面内锚点链接，保持不变
            } else if (href.endsWith('.md')) {
                // Markdown链接转换为Wiki链接，移除.md后缀
                const newHref = '#/' + href.replace(/\.md$/, '');
                link.setAttribute('href', newHref);
            } else {
                // 处理相对路径链接
                let newPath = '';
                
                if (href.startsWith('../')) {
                    // 上级目录链接
                    const currentDir = currentPath.split('/');
                    currentDir.pop(); // 移除当前文件名
                    
                    // 处理每个../
                    let tempHref = href;
                    while (tempHref.startsWith('../')) {
                        tempHref = tempHref.substring(3);
                        currentDir.pop(); // 上移一级目录
                    }
                    
                    // 构建新路径
                    newPath = currentDir.join('/') + (currentDir.length > 0 ? '/' : '') + tempHref;
                } else {
                    // 同级或下级目录链接
                    const currentDir = currentPath.split('/');
                    currentDir.pop(); // 移除当前文件名
                    newPath = currentDir.join('/') + (currentDir.length > 0 ? '/' : '') + href;
                }
                
                link.setAttribute('href', '#/' + newPath);
            }
        }
    });
}

// 导航到指定路径
function navigateTo(path) {
    window.location.hash = '#/' + path;
}

// 构建搜索索引
function buildSearchIndex() {
    searchIndex = {};
    
    function indexItem(item, path) {
        if (item.type === 'file' && item.path) {
            searchIndex[item.path] = {
                title: item.title || item.path,
                path: item.path
            };
        }
        
        for (const [key, value] of Object.entries(item)) {
            if (key !== '_index' && key !== 'type' && key !== 'title' && key !== 'path' && typeof value === 'object') {
                indexItem(value, path ? `${path}/${key}` : key);
            }
        }
    }
    
    indexItem(wikiData, '');
}

// 执行搜索
async function performSearch(query) {
    if (!query.trim()) {
        return;
    }
    
    const contentElement = document.getElementById('content');
    contentElement.innerHTML = '<div class="loader"></div>';
    
    try {
        const results = await searchDocuments(query);
        displaySearchResults(results, query);
    } catch (error) {
        console.error('搜索失败:', error);
        contentElement.innerHTML = `
            <div class="error-message">
                <h2>搜索失败</h2>
                <p>执行搜索时出错。</p>
                <p>错误信息: ${error.message}</p>
            </div>
        `;
    }
}

// 搜索文档
async function searchDocuments(query) {
    const results = [];
    const queryLower = query.toLowerCase();
    
    // 搜索标题
    for (const [path, data] of Object.entries(searchIndex)) {
        if (data.title.toLowerCase().includes(queryLower)) {
            results.push({
                path: path,
                title: data.title,
                score: 2,  // 标题匹配得分较高
                snippet: '标题匹配'
            });
            continue;
        }
        
        try {
            // 搜索内容
            const response = await fetch(`docs/${path}.md`);
            if (!response.ok) continue;
            
            const content = await response.text();
            if (content.toLowerCase().includes(queryLower)) {
                // 提取匹配上下文作为摘要
                const index = content.toLowerCase().indexOf(queryLower);
                const start = Math.max(0, index - 50);
                const end = Math.min(content.length, index + query.length + 50);
                let snippet = content.substring(start, end);
                
                // 添加省略号
                if (start > 0) snippet = '...' + snippet;
                if (end < content.length) snippet += '...';
                
                results.push({
                    path: path,
                    title: data.title,
                    score: 1,  // 内容匹配得分较低
                    snippet: snippet
                });
            }
        } catch (error) {
            console.warn(`搜索文档 ${path} 时出错:`, error);
        }
    }
    
    // 按得分排序
    results.sort((a, b) => b.score - a.score);
    
    return results;
}

// 显示搜索结果
function displaySearchResults(results, query) {
    const contentElement = document.getElementById('content');
    
    if (results.length === 0) {
        contentElement.innerHTML = `
            <div class="search-results">
                <h2 class="search-results-title">搜索结果: ${query}</h2>
                <p>没有找到匹配的结果。</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="search-results">
            <h2 class="search-results-title">搜索结果: ${query}</h2>
    `;
    
    for (const result of results) {
        // 高亮显示匹配的查询词
        const highlightedSnippet = result.snippet.replace(
            new RegExp(query, 'gi'),
            match => `<span class="search-highlight">${match}</span>`
        );
        
        html += `
            <div class="search-result-item">
                <h3 class="search-result-title">
                    <a href="#/${result.path}">${result.title}</a>
                </h3>
                <p class="search-result-snippet">${highlightedSnippet}</p>
            </div>
        `;
    }
    
    html += '</div>';
    contentElement.innerHTML = html;
}

// 创建返回顶部按钮
function createBackToTopButton() {
    const button = document.createElement('div');
    button.className = 'back-to-top';
    button.innerHTML = '↑';
    button.title = '返回顶部';
    document.body.appendChild(button);
    
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });
}

// 显示错误信息
function showErrorMessage(message) {
    const contentElement = document.getElementById('content');
    contentElement.innerHTML = `
        <div class="error-message">
            <h2>错误</h2>
            <p>${message}</p>
        </div>
    `;
}