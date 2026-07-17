# 静态部署 Static Deployment

## 1. 目标

生产站点输出纯静态目录，不依赖运行时 Node 或数据库，文章和程序路由预生成，直接刷新详情页可访问。

## 2. 审查步骤

1. 阅读 `package.json`；
2. 确认框架；
3. 确认构建命令；
4. 检查 SSR、API routes 和 Server Components；
5. 检查动态路由生成；
6. 执行构建；
7. 找到输出目录；
8. 使用纯静态服务器预览；
9. 刷新全部主要路由。

## 3. 目标路由

```text
/
/articles
/articles/<slug>
/programs
/programs/<slug>
/about
/404
```

兼容 `/projects` 和 `/projects/<slug>`。

## 4. GitHub Pages

处理 base path、资源路径、404、Actions 构建、输出目录和自定义域名。不要用 SPA fallback 掩盖静态路由缺失。

## 5. Cloudflare Pages

记录 Build command、Output directory、Node version、环境变量、Root directory 和自定义域名。纯静态站不配置不必要 Functions。

## 6. 发布验证

检查首页、导航、文章/程序详情刷新、图片、字体、404、sitemap、robots、Open Graph、控制台和移动端。

## 7. vinext/React 审查

在 ADR 0002 结论前，不假设当前框架已满足静态要求。结果只能是“保留并完善静态导出”或“无法满足，提出迁移方案”。
