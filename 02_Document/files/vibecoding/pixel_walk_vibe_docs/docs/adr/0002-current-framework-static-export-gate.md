# ADR 0002: 当前框架必须通过静态导出门禁

- Status: Proposed
- Date: 2026-07-17
- Decision Owners: 项目所有者

## Context

现有代码据 Codex 汇报采用 vinext/React，而原始建议是 Astro。不能只因技术栈不同就重建，也不能假设当前框架天然满足静态部署。

## Decision

先审查当前框架：能稳定生成全部静态路由则保留；若需要常驻 Node 或动态路由无法预生成，再提出迁移方案。在审查完成前，不宣布 GitHub Pages 可部署。

## Alternatives

立即迁移 Astro；继续使用当前框架但忽略静态问题；改为 SSR 托管。

## Consequences

避免不必要重构，但增加明确架构门禁。

## Verification

完成 tasks 中 M1，并将本 ADR 状态改为 Accepted 或 Rejected。
