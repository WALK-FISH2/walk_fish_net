# ADR 0001: 静态优先架构

- Status: Accepted
- Date: 2026-07-17
- Decision Owners: 项目所有者

## Context

个人网站第一阶段需要低成本、易部署，不希望维护传统服务器和数据库。

## Decision

核心页面必须静态生成，部署后不需要 Node 服务常驻运行。

## Alternatives

传统前后端分离、SSR 站点、带数据库 CMS。

## Consequences

部署简单、成本低、攻击面小、内容可版本管理；评论、登录和实时功能需第三方或 Serverless，构建时需要生成全部动态路由。

## Verification

生产构建输出纯静态目录；使用纯静态服务器访问；详情页直接刷新成功。
