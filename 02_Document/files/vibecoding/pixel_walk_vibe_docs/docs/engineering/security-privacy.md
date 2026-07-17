# 安全与隐私 Security & Privacy

## 静态前端秘密

任何下发到浏览器的内容都不是秘密。禁止私有 API 密钥、数据库密码、云服务 Secret、长期 Token 和内部接口凭据。

## 程序演示

每个演示声明是否存储数据、数据位置、是否发送到外部、使用哪些第三方服务以及是否只是静态模拟。

## iframe

默认最小权限：

```html
sandbox="allow-scripts"
```

按需增加 `allow-forms`、`allow-modals`、`allow-downloads`、`allow-popups` 或 `allow-same-origin`。`allow-same-origin` 与 `allow-scripts` 同时使用前必须评估风险。

## 外部链接

使用 `rel="noopener noreferrer"`，新标签页有明确提示，不自动跳转，外部演示不可用时主站仍可阅读。

## 内容安全

建议配置 CSP、X-Content-Type-Options、Referrer-Policy、Permissions-Policy 和合理缓存。

## 个人信息

不得暴露私人地址、内部服务器、公司秘密、未脱敏截图、真实 Token 和不应公开的同事信息。

## 依赖

定期检查漏洞，不引入来源不明包，新增大依赖说明用途，提交锁文件，构建脚本不执行未知远程代码。
