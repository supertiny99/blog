# Blog

基于 [Astro](https://astro.build) 的个人博客，部署在 Cloudflare Workers。

## 技术栈

- **框架**：Astro 7（Markdown / MDX 内容集合）
- **包管理**：pnpm（Node 24，见 `.nvmrc`）
- **部署**：Cloudflare Workers（`wrangler.jsonc`）
- **特性**：SEO 友好（canonical URL + Open Graph）、Sitemap、RSS Feed、图片自动优化（sharp）

## 目录结构

```text
├── public/                  # 原样输出、不经优化的静态资源（favicon 等）
├── src/
│   ├── assets/              # 需要优化的素材（图片、字体）
│   │   ├── site/            #   站点级共用素材（OG 分享图、logo）
│   │   ├── blog/
│   │   │   └── placeholders/#   文章配图占位图
│   │   └── fonts/           #   字体
│   ├── components/          # 组件
│   ├── content/
│   │   └── blog/            # 博文（.md / .mdx）+ 同名图片文件夹
│   ├── layouts/             # 布局
│   ├── pages/               # 路由页面
│   ├── styles/              # 全局样式
│   ├── consts.ts            # 站点常量
│   └── content.config.ts    # 内容集合 schema（frontmatter 校验）
├── scripts/
│   ├── new-post.mjs         # 创建新文章脚本
│   └── deploy.sh            # Cloudflare 部署脚本
├── docs/                    # 项目文档
├── astro.config.mjs
├── wrangler.jsonc           # Cloudflare Workers 配置
└── package.json
```

Astro 把 `src/pages/` 下的 `.astro` / `.md` 文件按文件名暴露为路由；博文统一放在 `src/content/blog/`，通过 `getCollection()` 读取，frontmatter 由 `content.config.ts` 校验。

## 图片素材管理

### 两条路径的分界

图片能放的位置只有两个，处理方式截然不同——这是分类的根基：

| 位置 | 是否被 Astro 优化（压缩 / 转 webp / 响应式尺寸） | 引用方式 | 适用 |
| :--- | :--- | :--- | :--- |
| `src/assets/` | ✅ 走 sharp 管线 | 相对路径 / `import` | 绝大多数图片 |
| `public/` | ❌ 原样输出 | `/xxx.png` 绝对路径 | favicon 等需固定 URL 的文件 |

### `src/assets/` 内部分类

**按用途分，不要按文章分**（文章配图另有处理，见下）：

- `site/` — 站点级、多页面共用的素材（OG 分享图、logo）
- `blog/placeholders/` — 文章配图占位图
- `fonts/` — 字体

判断标准：一张图会被多篇文章 / 多个页面用到 → `site/`；只属于一篇文章 → co-locate（见下）。

### 文章配图：co-locate

每篇文章的配图放在文章同级的同名文件夹里，跟随文章一起增删——避免 `../../` 跨目录引用，也防止删文章后留下孤儿图片：

```text
src/content/blog/
├── my-post.md
└── my-post/              # 与文章同名的图片文件夹
    ├── hero.jpg
    └── screenshot.png
```

引用用干净的相对路径，Astro 会自动优化：

```yaml
# frontmatter 头图
heroImage: './my-post/hero.jpg'
```

```markdown
<!-- 正文插图 -->
![说明](./my-post/screenshot.png)
```

### 命名规范

- 全小写、连字符分词、带语义：`react-state.png`，而非 `IMG_3278.JPG` 或 `图片1.png`
- 占位图放进 `placeholders/` 并在名字里体现（如 `placeholder-xxx`），别和真图混放

## 标签（tags）

文章 frontmatter 的 `tags` 字段是字符串数组，用于按主题筛选文章：

```yaml
tags: ['react', '随笔']
```

- **值即展示、即 URL**：`tags: ['react']` 显示为 `react`，并生成 `/blog/tags/react/` 独立页面
- **每个标签一页**：Astro 构建时为每个标签生成静态列表页，列出该标签下全部文章——URL 可分享、可被搜索引擎收录
- **入口**：`/blog` 列表页顶部有全部标签导航条；文章卡片和详情页也显示标签，点击即跳到对应标签页
- **命名约定**：建议小写英文或短中文（如 `react`、`guide`、`随笔`）。大小写不同的值（`React` vs `react`）会被当成两个标签，请自行保持一致（不做强制转换，以免改写展示文案）
- **中文标签**：可用，但 URL 会被浏览器 encode（如 `/blog/tags/%E9%9A%8F%E7%AC%94/`），功能正常只是不够干净——介意 URL 美观就用英文

## 写新文章

```sh
pnpm new-post "我的文章" my-post
```

脚本会创建 `src/content/blog/my-post.md`（含 frontmatter 模板）和同名图片文件夹 `my-post/`（含 `.gitkeep`）。把配图丢进该文件夹，按上面的相对路径方式引用即可。

不传文件名时，自动从标题生成 slug；纯中文标题会回退为 `post-YYYY-MM-DD`。详见 `pnpm new-post`。

## 常用命令

所有命令在项目根目录执行：

| 命令 | 作用 |
| :--- | :--- |
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 启动本地开发服务器 `localhost:4321` |
| `pnpm build` | 构建生产站点到 `./dist/` |
| `pnpm preview` | 本地预览构建产物 |
| `pnpm new-post "<标题>" [文件名]` | 创建新文章（含同名图片文件夹） |
| `pnpm deploy:cf` | 构建并部署到 Cloudflare Workers |
| `pnpm generate-types` | 生成 Wrangler 类型 |
| `pnpm astro ...` | 运行 Astro CLI（如 `astro check`） |

## 部署

```sh
pnpm deploy:cf
```

脚本（`scripts/deploy.sh`）依次执行：构建 → 检查 Cloudflare 登录状态（未登录或 token 过期会自动打开浏览器授权）→ `wrangler deploy`。

部署配置见 `wrangler.jsonc`（Worker 名称 `blog`，静态资源目录 `./dist`）。

## 致谢

- 主题基于 [Bear Blog](https://github.com/HermanMartinus/bearblog/)
- 基于 [Astro Blog 模板](https://astro.build/themes/)，文档见 [docs.astro.build](https://docs.astro.build)
