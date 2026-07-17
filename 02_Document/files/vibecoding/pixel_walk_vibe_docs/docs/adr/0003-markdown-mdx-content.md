# ADR 0003: 文章和程序使用 Markdown/MDX

- Status: Accepted
- Date: 2026-07-17
- Decision Owners: 项目所有者

## Context

站点所有者需要不修改页面组件即可维护内容。

## Decision

文章和程序详情使用 Markdown/MDX 与 Frontmatter，构建时进行 schema 校验和静态生成。

## Alternatives

写死在组件、远程 CMS、数据库。

## Consequences

内容可版本管理，适合静态站点；需要字段 schema 和资源路径规则。

## Verification

新增内容无需修改列表组件即可出现，错误 Frontmatter 在构建时失败。
