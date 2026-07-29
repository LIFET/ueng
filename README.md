# UENG

XUHENG 的个人数字名片与项目入口。

## 在线预览

- GitHub Pages：<https://lifet.github.io/ueng/>
- GitHub 仓库：<https://github.com/LIFET/ueng>

## 页面特点

- 黑白极简的单屏数字名片设计
- UENG 品牌开场动画
- 桌面端轻微 3D 视差与跟随光效
- 支持移动端自适应布局
- 名片正反面切换
- 系统分享与复制页面链接
- 下载 vCard 联系人文件
- Open Graph 与 Twitter Card 分享信息
- 支持添加到 iOS 主屏幕
- 无第三方框架和外部字体依赖

## 修改公开链接

所有公开项目链接统一在 [`links.js`](./links.js) 中维护：

```js
window.UENG_LINKS = [
  {
    title: 'UENG',
    note: 'PERSONAL INDEX',
    url: '#',
    local: true
  },
  {
    title: 'GITHUB',
    note: 'CODE & EXPERIMENTS',
    url: 'https://github.com/yourname',
    local: false
  }
];
```

字段说明：

- `title`：链接名称
- `note`：简短说明
- `url`：目标地址
- `local: true`：站内链接
- `local: false`：外部链接，将在新标签页打开

访客无法在网页前台增加或修改链接。

## 本地预览

直接打开 `index.html`，或在项目目录启动本地服务器：

```bash
python3 -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

## 项目结构

```text
.
├── index.html              # 页面结构与元信息
├── style.css               # 页面样式与响应式布局
├── script.js               # 动效、翻面、分享与无障碍交互
├── links.js                # 公开链接配置
├── manifest.webmanifest    # Web App 配置
├── favicon.svg             # 浏览器图标
├── apple-touch-icon.png    # iOS 主屏幕图标
├── share-cover.png         # 社交分享封面
└── xuheng.vcf              # 联系人名片文件
```

## 部署

本项目使用 GitHub Pages，从 `main` 分支根目录自动部署。

提交更新：

```bash
git add .
git commit -m "更新 UENG"
git push
```

推送后，GitHub Pages 会自动更新。

## 许可

页面内容与视觉设计归 XUHENG / UENG 所有。未经许可，请勿直接复制后用于其他个人或商业项目。
