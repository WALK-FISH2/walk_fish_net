import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const primaryRoutes = [
  ["dist/index.html", "沿途捡到的想法"],
  ["dist/about/index.html", "PLAYER PROFILE"],
  ["dist/articles/index.html", "沿途记录"],
  ["dist/articles/content-as-levels/index.html", "把内容当作关卡"],
  ["dist/articles/first-post/index.html", "在像素世界里搭一条可逆的路"],
  ["dist/articles/small-tools/index.html", "小工具也值得被认真记录"],
  ["dist/programs/index.html", "做点啥呢"],
  ["dist/programs/pixel-journey/index.html", "像素漫游个人站"],
  ["dist/programs/signal-garden/index.html", "Signal Garden"],
  ["dist/programs/tidy-desk/index.html", "Tidy Desk"],
  ["dist/404.html", "LOST COORDINATES"],
];

const legacyRoutes = [
  ["dist/projects/index.html", "/programs/"],
  ["dist/projects/pixel-journey/index.html", "/programs/pixel-journey/"],
  ["dist/projects/signal-garden/index.html", "/programs/signal-garden/"],
  ["dist/projects/tidy-desk/index.html", "/programs/tidy-desk/"],
];

test("emits independent HTML for every primary and compatibility route", async () => {
  for (const [path, expected] of primaryRoutes) {
    const html = await readFile(new URL(path, root), "utf8");
    assert.match(html, /<!DOCTYPE html>/i, path);
    assert.match(html, new RegExp(expected), path);
  }

  for (const [path, target] of legacyRoutes) {
    const html = await readFile(new URL(path, root), "utf8");
    assert.match(html, /http-equiv="refresh"/i, path);
    assert.match(html, /name="robots" content="noindex,follow"/i, path);
    assert.ok(html.includes(target), path);
  }

  const outputEntries = await readdir(new URL("dist/", root), { recursive: true });
  assert.equal(outputEntries.filter((entry) => entry.endsWith(".html")).length, 15);
});

test("program pages expose the required domain content without claiming missing services", async () => {
  const requiredSections = [
    "这是什么程序",
    "为什么编写它",
    "本人完成了什么",
    "核心功能",
    "技术方案",
    "程序演示",
    "当前限制",
    "数据和隐私说明",
  ];
  const [pixelJourney, tidyDesk, signalGarden, home] = await Promise.all([
    readFile(new URL("dist/programs/pixel-journey/index.html", root), "utf8"),
    readFile(new URL("dist/programs/tidy-desk/index.html", root), "utf8"),
    readFile(new URL("dist/programs/signal-garden/index.html", root), "utf8"),
    readFile(new URL("dist/index.html", root), "utf8"),
  ]);

  for (const html of [pixelJourney, tidyDesk, signalGarden]) {
    for (const section of requiredSections) assert.match(html, new RegExp(section));
    assert.match(html, /SoftwareApplication/);
    assert.match(html, /\/programs\//);
  }

  const staticDisclaimer = "这是静态演示版，部分后端、数据库、登录或实时功能未接入。";
  assert.match(tidyDesk, new RegExp(staticDisclaimer));
  assert.doesNotMatch(home, new RegExp(staticDisclaimer));
  assert.match(signalGarden, /当前没有可公开访问的程序演示/);
});

test("static output has no Node server runtime and sitemap favors canonical routes", async () => {
  await assert.rejects(access(new URL("dist/server/index.js", root)));
  const rootEntries = await readdir(new URL("dist/", root));
  assert.ok(rootEntries.includes("programs"));
  assert.ok(rootEntries.includes("projects"));

  const [sitemap, robots] = await Promise.all([
    readFile(new URL("dist/sitemap-0.xml", root), "utf8"),
    readFile(new URL("dist/robots.txt", root), "utf8"),
  ]);
  assert.match(sitemap, /\/programs\/pixel-journey\//);
  assert.doesNotMatch(sitemap, /\/projects(?:\/|<)/);
  assert.match(robots, /Sitemap:/);
});

test("keeps content, SEO, reduced-motion, and migrated source boundaries", async () => {
  const [home, program, css, contentConfig] = await Promise.all([
    readFile(new URL("dist/index.html", root), "utf8"),
    readFile(new URL("dist/programs/tidy-desk/index.html", root), "utf8"),
    readFile(new URL("src/styles/global.css", root), "utf8"),
    readFile(new URL("src/content.config.ts", root), "utf8"),
  ]);
  assert.match(home, /aria-label="旅程阶段"/);
  assert.match(home, /\/programs\/tidy-desk\//);
  assert.match(program, /rel="canonical"[^>]+\/programs\/tidy-desk\//);
  assert.match(program, /og:image/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(contentConfig, /const programs = defineCollection/);
  assert.doesNotMatch(contentConfig, /const projects = defineCollection/);
  await access(new URL("src/content/programs/tidy-desk.md", root));
});

test("centralizes overworld parallax without scene-local layer coefficients", async () => {
  const [storyConfig, overworldScene] = await Promise.all([
    readFile(new URL("src/config/story.config.ts", root), "utf8"),
    readFile(new URL("src/interactive/scenes/OverworldScene.ts", root), "utf8"),
  ]);

  for (const layer of ["far", "mid", "near", "foreground"]) {
    assert.match(storyConfig, new RegExp(`${layer}:\\s*\\{[\\s\\S]*?strength:`), layer);
  }
  assert.match(overworldScene, /STORY_CONFIG\.overworld/);
  assert.doesNotMatch(overworldScene, /progress\s*\*\s*width\s*\*\s*0\.(?:07|19|4|46)/);
  assert.doesNotMatch(overworldScene, /nearShift\s*\*\s*1\.35/);
});

test("keeps article content available across the Canvas fallback boundary", async () => {
  const [home, homeComponent, sceneController, css] = await Promise.all([
    readFile(new URL("dist/index.html", root), "utf8"),
    readFile(new URL("src/components/ImmersiveHome.tsx", root), "utf8"),
    readFile(new URL("src/interactive/SceneController.ts", root), "utf8"),
    readFile(new URL("src/styles/global.css", root), "utf8"),
  ]);

  assert.match(home, /class="story-canvas pixel-art" aria-hidden="true"/);
  assert.match(home, /\/articles\/first-post\//);
  assert.match(home, /\/articles\/content-as-levels\//);
  assert.match(homeComponent, /catch\s*\{[\s\S]*?setCanvasFailed\(true\)/);
  assert.match(sceneController, /onContextLost\?\.\(\)/);
  assert.match(sceneController, /this\.destroyed \|\| !this\.initialized/);
  assert.match(css, /\.immersive-home--fallback \.story-canvas\s*\{\s*display:\s*none/);
  assert.match(css, /\.immersive-home--fallback \.canvas-fallback\s*\{\s*display:\s*block/);
});
