如果 Cloudflare 已经连接 GitHub 仓库，但是我并不想让每次上传的内容都直接更新到我的网页，有什么方案？

Worked for 1m 2s

可以。对于你的项目，最推荐采用 **“开发分支 + 发布分支”**：平时正常上传 GitHub，但只有主动合并到发布分支时，公网网页才更新。

## 推荐方案：单独建立 `production` 发布分支

分支职责设为：

```
main          日常开发，随时提交和上传
production    公网正式版本，只在准备上线时更新
```

Cloudflare Pages 可以指定任意一个分支作为 Production branch；其他分支即使产生预览部署，也不会替换正式网站。

### 1. 创建发布分支

在项目根目录执行：

```
cd D:\Work\walk_fish_net

git switch -c production
git push -u origin production
git switch main
```

现在 GitHub 上会有：

```
main
production
```

### 2. 修改 Cloudflare 的正式分支

进入：

```
Cloudflare
→ Workers 和 Pages
→ 你的 Pages 项目
→ 设置 Settings
→ 构建 Builds
→ 分支控制 Branch control
```

修改为：

```
Production branch：production
```

对于 `Preview branch`，有两种选择：

```
All non-production branches
```

这样每次推送 `main`，Cloudflare 会生成一个测试网址，但正式的 `项目名.pages.dev` 不会更新。

或者选择：

```
None / Disable automatic branch deployments
```

这样推送 `main` 时连测试版本都不会自动构建。Cloudflare 当前支持分别控制正式分支和预览分支的自动部署。

## 平时开发

继续在 `main` 分支修改和上传：

```
git switch main

git add .
git commit -m "完善网站内容"
git push
```

这时候代码会上传到 GitHub，但**正式网页不会变化**。

## 准备正式上线时

确认 `main` 中的效果没有问题后，再执行：

```
git switch production
git pull origin production
git merge main
git push origin production
git switch main
```

只有这次：

```
git push origin production
```

才会触发正式网站更新。

整体流程就是：

```
修改代码
→ 推送 main
→ 检查效果
→ 确认可以发布
→ 合并到 production
→ Cloudflare 更新正式网页
```

## 再加一项：只监听网站目录

你的 GitHub 仓库不只有网站，还包含：

```
03_SourceCode/Website
03_SourceCode/Programs
02_Document
……
```

Cloudflare 默认情况下，仓库中任何文件发生变化，都可能触发一次构建。你可以设置只在网站目录变化时构建。

进入：

```
Pages 项目
→ Settings
→ Build
→ Build watch paths
```

设置：

```
Include paths：
03_SourceCode/Website/*
Exclude paths：
留空
```

这样修改其他目录时不会触发网站构建；`*` 会匹配 `Website` 下的多层子目录。

## 备选方案：完全手动发布

也可以关闭：

```
Enable automatic production branch deployments
```

并把：

```
Preview branch
```

设为：

```
None
```

这样任何 GitHub 推送都不会自动发布。准备上线时，使用 Wrangler 手动部署。Cloudflare 官方支持关闭所有自动部署后，通过 Wrangler 发布到现有 Pages 项目。

Vite 项目：

```
cd D:\Work\walk_fish_net\03_SourceCode\Website

npm run build

npx wrangler pages deploy dist `
  --project-name=你的Cloudflare项目名 `
  --branch=production
```

普通 HTML 项目：

```
cd D:\Work\walk_fish_net\03_SourceCode\Website

npx wrangler pages deploy . `
  --project-name=你的Cloudflare项目名 `
  --branch=production
```

Wrangler 的 `pages deploy` 命令支持指定上传目录、项目名称和分支。

**对你来说，使用 `main + production` 两个分支，再将构建监听路径限制为 `03_SourceCode/Website/*` 最合适。**它既保留 GitHub 自动部署的便利，也不会让每一次普通提交直接影响正式网页。







测试网站的网址是什么？

假设你的 Cloudflare Pages 项目名是：

```
walk-fish-net
```

并且设置为：

```
production：正式发布分支
main：测试分支
```

那么测试网站通常是：

```
https://main.walk-fish-net.pages.dev
```

正式网站仍然是：

```
https://walk-fish-net.pages.dev
```

每次 `main` 分支生成预览部署时，还会产生一个对应本次提交的固定地址，例如：

```
https://abc123.walk-fish-net.pages.dev
```

其中：

- `main.walk-fish-net.pages.dev`：始终指向 `main` 分支的最新测试版本；
- `abc123.walk-fish-net.pages.dev`：对应某一次具体部署，之后不会改变。

你可以在 Cloudflare 中查看准确网址：

```
Workers 和 Pages
→ 选择你的项目
→ 部署 / Deployments
→ 找到 main 分支的部署
→ 查看构建 / View build
```

部署详情中的 **Aliases / 别名** 就会显示测试网址。

前提是预览分支部署已开启，并允许部署 `main`：

```
设置
→ 构建和部署
→ 分支控制
→ Preview branches
→ All non-production branches
```

Cloudflare 默认可以为非正式分支生成预览部署。