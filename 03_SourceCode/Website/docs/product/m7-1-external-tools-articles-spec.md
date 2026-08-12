# M7.1 外部工具介绍文章规格

状态：已完成并正式验收
日期：2026-08-13

## 1. 目标

在现有“文章&工具”栏目中新增三篇独立文章，分别介绍：

- Uiverse；
- React Bits；
- Three.js。

M7.1 是已完成 M7 后的内容增量，不重新打开 Programs 展示系统，也不提前合并 M8/M9。

## 2. 领域边界

- 三个网站均为第三方工具或开源/源码可见技术资源，必须进入 `articles` 内容集合；
- 不得进入 `programs`，不得出现在“做点啥呢”中；
- 不得暗示这些网站或库由站点所有者开发；
- 文章使用原创中文整理，引用官方入口，不复制第三方页面正文、截图、Logo 或演示素材；
- 事实以官方网站、官方文档、官方仓库和许可证为依据，并标记信息核对日期。

## 3. 每篇文章的内容结构

每篇至少覆盖：

1. 它是什么；
2. 适合解决什么问题；
3. 推荐的使用或学习方式；
4. 性能、可访问性、依赖或许可证边界；
5. 官方网站入口；
6. 一句话结论与信息时效说明。

## 4. 发布与排序

- 使用现有 Markdown Article schema，不新增字段；
- 发布日期为 `2026-08-13`；
- `draft: false`，进入文章列表、搜索、标签筛选、详情路由和 Sitemap；
- `featured: false`，不替换首页陆地世界当前三篇精选文章；
- slug 分别为 `uiverse-ui-library`、`react-bits-animated-components`、`threejs-web-3d-foundations`。

## 5. 外链规则

- 只使用 HTTPS 官方网站、官方文档或官方仓库；
- 明确的“打开官网”链接使用新标签页和 `noopener noreferrer`；
- 不嵌入第三方脚本、iframe、远程图片或运行时代码；
- 不把第三方统计数字当作长期事实；易变信息需要弱化表述或标注核对日期。

## 6. 静态输出影响

新增三个 canonical 文章详情页：

```text
/articles/uiverse-ui-library/
/articles/react-bits-animated-components/
/articles/threejs-web-3d-foundations/
```

不新增兼容路由，不改变现有路由结构。M7.1 开始时当前仓库实际为 15 个 HTML（11 个主页面、4 个 Projects 兼容页）；新增三篇文章后增加为 18 个 HTML，其中 14 个主页面、4 个 Projects 兼容页。生产仍为 Astro 纯静态输出，不增加 Node 请求期运行时。

## 7. 验收标准

- 三篇文章均通过 Article schema 校验并生成独立 HTML；
- `/articles/` 能显示、搜索并按标签筛选三篇内容；
- 三个详情页包含正确标题、原创介绍和对应官方链接；
- 外部入口使用 HTTPS，显式新标签页入口包含安全属性；
- Sitemap 收录三个 canonical 文章路由；
- 首页原三篇精选文章与 Programs 内容、动画、路由均无变化；
- Astro Check、ESLint、测试、生产构建和静态路由验证通过。

## 8. 2026-08-13 验收结果

- Astro Check：45 个文件，0 errors / 0 warnings / 0 hints；
- ESLint：通过；
- 自动化测试：20/20 通过，其中 M7.1 测试锁定三篇详情、官网外链安全属性、Sitemap 与首页精选不变；
- `npm run build:sites`：成功，Astro 输出 `dist/`，Sites 适配输出 `sites-dist/`；
- 静态输出：18 个 HTML，逐一以独立静态服务器请求均为 HTTP 200，未知路由为 HTTP 404；
- 三个新文章路由均为 HTTP 200，Sitemap 全部收录；首页 HTML 不包含三个新 slug；
- `dist/server` 不存在，M7.1 未增加 Node 请求期运行时。
