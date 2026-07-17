# 提示词：静态导出审查

请先阅读 constitution.md、spec.md、architecture.md、tasks.md、AGENTS.md 和 ADR 0001/0002。

本轮只完成 M1 静态导出审查，不做视觉重构。

请：

1. 检查 package.json 和框架版本；
2. 找出所有 SSR、API route、Server Component 和 Node 运行时依赖；
3. 列出全部公开路由；
4. 确认文章和程序动态路由如何生成；
5. 执行真实生产构建；
6. 找到静态输出目录；
7. 关闭开发服务器；
8. 使用纯静态服务器打开输出目录；
9. 直接刷新文章和程序详情页；
10. 测试 404 和目标子路径；
11. 更新 ADR 0002、tasks.md 和 static-deployment.md。

不要因为框架不是 Astro 就直接迁移。

最终报告：当前框架、构建命令、输出目录、是否需要 Node 运行时、已验证路由、GitHub Pages/Cloudflare Pages 可用性、问题和保留当前框架的建议。
