# 随手改 SnapEdit · HTML 可视化编辑器

> 打开 HTML 文件即可所见即所得编辑，全程本地运行，文件不出电脑。

## ✨ 功能特性

### 核心编辑
- **单击文字直接改** — 所见即所得，点击任意文本即可编辑
- **拖选文字调样式** — 选中文字后弹出工具条，支持加粗/斜体/下划线/删除线、文字颜色、背景高亮、字号调整、字体切换
- **块级操作** — 选中任意元素后可复制、上移、下移、删除
- **颜色面板** — 同时调整文字/背景/边框三色，内置 30 色色板，支持手动输入色值
- **圆角 & 阴影** — 一键加减圆角、切换阴影效果
- **SVG 文字编辑** — 双击 SVG 内文字可直接修改内容
- **HTML 源码编辑** — 右键菜单或操作条可查看/编辑任意元素的原始 HTML

### 高级功能
- **撤销/还原** — 最多 30 步撤销，一键还原到初始状态
- **图片内嵌导出** — 导出时自动将图片转为 base64 data URL，换电脑打开不掉图
- **HTML 格式化导出** — 导出文件自动缩进美化，方便二次编辑
- **动态预览** — 对含 JS 的页面可开启脚本执行（仅建议可信文件）
- **实时统计** — 字数（中英文分别统计）、元素数、图片数、链接数实时显示
- **缩放** — Ctrl+= 放大 / Ctrl+- 缩小 / Ctrl+0 重置，50%~150%

### 体验优化
- **PWA 支持** — 可安装到桌面，离线可用（Service Worker 缓存）
- **暗色模式** — 自动适配系统深色主题
- **拖拽上传** — 直接把 HTML 文件拖进浏览器
- **右键菜单** — 复制文字、选父元素、快速操作
- **键盘快捷键** — Ctrl+S 导出、Ctrl+Z 撤销、Esc 取消选择
- **Alt+拖拽移动** — 按住 Alt 键拖动元素可自由移动位置
- **响应式** — 移动端友好

## 🚀 部署方式

### 方式一：Cloudflare Pages（推荐 · 永久免费）

#### 方法 A：Git 集成（推荐）

1. Fork 本仓库到你的 GitHub 账号
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. 选择仓库 `snapedit`
4. 配置构建设置：
   - **Framework preset**：`None`（纯静态）
   - **Build command**：留空
   - **Build output directory**：`.`（一个点，表示根目录）
   - **Node version**：`18` 或更高
5. 点击 **Save and Deploy**，约 30 秒后获得 `https://snapedit.pages.dev` 域名

#### 方法 B：Direct Upload

1. 将本项目打包为 zip
2. 登录 CF Dashboard → Pages → **Upload assets**
3. 拖入 zip 文件，输出目录填 `.`

#### 环境变量（可选）

如需自定义域名，在 CF Dashboard → Pages → Settings → Custom Domains 中添加。

### 方式二：GitHub Pages

1. 将仓库 Settings → Pages → Source 设为 `main` 分支
2. 访问 `https://<用户名>.github.io/snapedit/`

### 方式三：本地直接打开

直接用浏览器打开 `index.html` 即可使用（Service Worker 功能需 HTTP 环境）

## 📁 文件结构

```
snapedit-cf/
├── index.html          ← 主文件（HTML+CSS+JS 全内联，~55KB）
├── sw.js               ← Service Worker，离线缓存
├── manifest.webmanifest← PWA 安装配置
├── _headers            ← Cloudflare 安全头 + 缓存策略
├── _redirects          ← SPA 路由回退
├── package.json        ← 项目声明（CF Pages 识别用）
├── wrangler.toml       ← Cloudflare 配置
└── README.md
```

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + S` | 导出 HTML |
| `Ctrl/Cmd + Z` | 撤销 |
| `Ctrl/Cmd + B` | 加粗（编辑文字时） |
| `Ctrl/Cmd + I` | 斜体（编辑文字时） |
| `Ctrl/Cmd + U` | 下划线（编辑文字时） |
| `Ctrl/Cmd + =` | 放大画布 |
| `Ctrl/Cmd + -` | 缩小画布 |
| `Ctrl/Cmd + 0` | 重置缩放 |
| `Esc` | 取消选择 / 关闭弹窗 |
| `Alt + 拖拽` | 移动元素（实验性） |
| 右键 | 打开上下文菜单 |

## 🔒 隐私

所有编辑操作均在浏览器本地完成，文件不会上传到任何服务器。

## 📜 License

MIT
