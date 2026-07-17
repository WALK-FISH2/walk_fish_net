import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const routes = [
  ["dist/index.html", "沿途捡到的想法"],
  ["dist/articles/index.html", "沿途记录"],
  ["dist/articles/first-post/index.html", "在像素世界里搭一条可逆的路"],
  ["dist/projects/index.html", "做点啥呢"],
  ["dist/projects/pixel-journey/index.html", "像素漫游个人站"],
  ["dist/about/index.html", "PLAYER PROFILE"],
  ["dist/404.html", "LOST COORDINATES"],
];

test("emits independent HTML for every required route", async () => {
  for (const [path, expected] of routes) {
    const html = await readFile(new URL(path, root), "utf8");
    assert.match(html, /<!DOCTYPE html>/i, path);
    assert.match(html, new RegExp(expected), path);
  }
});

test("static output has no server runtime", async () => {
  await assert.rejects(access(new URL("dist/server/index.js", root)));
  const rootEntries = await readdir(new URL("dist/", root));
  assert.ok(rootEntries.includes("index.html"));
  assert.ok(rootEntries.includes("articles"));
  assert.ok(rootEntries.includes("projects"));
});

test("keeps content, SEO, and reduced-motion hooks", async () => {
  const [home, css, robots] = await Promise.all([
    readFile(new URL("dist/index.html", root), "utf8"),
    readFile(new URL("src/styles/global.css", root), "utf8"),
    readFile(new URL("dist/robots.txt", root), "utf8"),
  ]);
  assert.match(home, /aria-label="旅程阶段"/);
  assert.match(home, /og:image/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(robots, /Sitemap:/);
});
