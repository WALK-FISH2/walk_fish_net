# ADR 0009: 使用 Program 领域和 /programs 路由

- Status: Accepted
- Date: 2026-07-17
- Decision Owners: 项目所有者

## Context

原“项目”语义过宽。用户明确“做点啥呢”板块用于展示本人编写的程序示例。

## Decision

领域模型使用 Program，公开主路由使用 `/programs`，导航中文名称为“做点啥呢”。现有 `/projects` 路径迁移时保留兼容跳转。

## Alternatives

继续使用 Project；使用 PortfolioItem；使用 Work。

## Consequences

语义更准确，但需要迁移内容、类型、路由和测试。

## Verification

2026-07-17 已验证：

- 内容集合、类型、目录与组件统一使用 Program/programs；
- `/programs/` 和 3 个 Program 详情页生成独立静态 HTML；
- `/projects/` 和 3 个旧 slug 生成静态兼容跳转页；
- 兼容页使用新 canonical 与 `noindex,follow`；
- Sitemap 只收录 Programs 主路由；
- 默认和子路径静态服务器验证均通过。
