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

所有新内容使用 Program schema；旧链接不会直接失效。
