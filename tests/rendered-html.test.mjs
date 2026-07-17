import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the immersive home with accessible DOM content", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>像素漫游者/);
  assert.match(html, /你好，我是/);
  assert.match(html, /沿途捡到的想法/);
  assert.match(html, /沉在海里的项目档案/);
  assert.match(html, /aria-label="旅程阶段"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("renders all primary content routes", async () => {
  const routes = [
    ["/articles", "沿途记录"],
    ["/articles/first-post", "在像素世界里搭一条可逆的路"],
    ["/projects", "做点啥呢"],
    ["/projects/pixel-journey", "像素漫游个人站"],
    ["/about", "PLAYER PROFILE"],
    ["/404", "LOST COORDINATES"],
  ];

  for (const [pathname, expected] of routes) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    assert.match(await response.text(), new RegExp(expected), pathname);
  }
});

test("keeps authored content and social metadata in the project", async () => {
  const [layout, packageJson, readme] = await Promise.all([
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
    readFile(new URL("README.md", root), "utf8"),
  ]);
  assert.match(layout, /\/og\.png/);
  assert.match(packageJson, /"pixi\.js"/);
  assert.match(packageJson, /"gsap"/);
  assert.match(readme, /新增文章/);
  await access(new URL("public/og.png", root));
  await access(new URL("app/content/articles/first-post.md", root));
  await access(new URL("app/content/projects/pixel-journey.md", root));
  await assert.rejects(access(new URL("app/_sites-preview/SkeletonPreview.tsx", root)));
});
