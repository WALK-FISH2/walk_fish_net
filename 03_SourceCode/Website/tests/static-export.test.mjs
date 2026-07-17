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
  assert.match(home, /在线程序/);
  assert.match(home, /静态前端演示/);
  assert.match(home, /当前限制/);
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

test("centralizes the reversible M4 dive timeline and underwater layers", async () => {
  const [storyConfig, sceneController, diveTransition, underwaterScene, homeComponent, css] = await Promise.all([
    readFile(new URL("src/config/story.config.ts", root), "utf8"),
    readFile(new URL("src/interactive/SceneController.ts", root), "utf8"),
    readFile(new URL("src/interactive/transitions/DiveTransition.ts", root), "utf8"),
    readFile(new URL("src/interactive/scenes/UnderwaterScene.ts", root), "utf8"),
    readFile(new URL("src/components/ImmersiveHome.tsx", root), "utf8"),
    readFile(new URL("src/styles/global.css", root), "utf8"),
  ]);

  for (const range of [
    "cooling: [0.3, 0.315]",
    "farWave: [0.315, 0.328]",
    "waveApproach: [0.328, 0.342]",
    "waveBreak: [0.342, 0.355]",
    "foamCover: [0.355, 0.368]",
    "underwaterSettle: [0.368, 0.38]",
    "surfaceRetreat: [0.38, 0.43]",
    "preheat: [0.64, 0.66]",
  ]) assert.ok(storyConfig.includes(range), range);

  for (const layer of ["far", "mid", "near", "foreground"]) {
    assert.match(storyConfig, new RegExp(`${layer}:\\s*\\{[\\s\\S]*?strength:`), layer);
  }
  assert.match(storyConfig, /export function getDiveState/);
  assert.match(storyConfig, /export function getUnderwaterState/);
  assert.match(sceneController, /cameraDescent/);
  assert.match(sceneController, /container\.tint/);
  assert.match(diveTransition, /getDiveState\(globalProgress\)/);
  assert.match(diveTransition, /const bubblePool = Array\.from/);
  assert.match(underwaterScene, /STORY_CONFIG\.underwater\.parallax/);
  assert.match(underwaterScene, /state\.preheat/);
  assert.match(underwaterScene, /const (?:farFishPool|midFishPool|jellyfishPool) = Array\.from/);
  assert.doesNotMatch(underwaterScene, /progress\s*\*\s*(?:35|60|90|170)/);
  assert.match(homeComponent, /--waterline-y/);
  assert.match(homeComponent, /DEMO_TYPE_LABELS\[program\.demoType\]/);
  assert.match(homeComponent, /get\("motion"\) === "full"/);
  assert.match(homeComponent, /forceFullMotionMode[\s\S]*?ScrollTrigger\.refresh\(\)/);
  assert.match(homeComponent, /get\("canvas"\) === "fallback"/);
  assert.match(css, /top:\s*calc\(var\(--waterline-y/);
  assert.match(css, /height:\s*64px/);
  assert.match(css, /immersive-home--force-motion/);
});

test("implements isolated reversible M4.5 pixel waves and pooled foam", async () => {
  const [storyConfig, diveTransition, sceneController, oceanTransition] = await Promise.all([
    readFile(new URL("src/config/story.config.ts", root), "utf8"),
    readFile(new URL("src/interactive/transitions/DiveTransition.ts", root), "utf8"),
    readFile(new URL("src/interactive/SceneController.ts", root), "utf8"),
    readFile(new URL("src/interactive/transitions/OceanToSpaceTransition.ts", root), "utf8"),
  ]);

  assert.match(storyConfig, /export function getLandOceanTransitionState/);
  for (const layer of ["far", "mid", "foreground"]) {
    assert.match(storyConfig, new RegExp(`${layer}:\\s*\\{[\\s\\S]*?amplitude:[\\s\\S]*?wavelength:[\\s\\S]*?phase:[\\s\\S]*?speed:[\\s\\S]*?alpha:[\\s\\S]*?pixelStep:[\\s\\S]*?foamWeight:`), layer);
  }
  assert.match(diveTransition, /type FoamParticle/);
  assert.match(diveTransition, /const foamPool: readonly FoamParticle\[\] = Array\.from/);
  assert.match(diveTransition, /drawPixelWaveLayer\(this\.farWave/);
  assert.match(diveTransition, /drawPixelWaveLayer\(this\.midWave/);
  assert.match(diveTransition, /drawPixelWaveLayer\(this\.foregroundWave/);
  assert.match(diveTransition, /drawReducedWaveCurtain/);
  assert.match(diveTransition, /transition\.seamCover/);
  assert.doesNotMatch(diveTransition, /Math\.random/);
  assert.match(sceneController, /STORY_CONFIG\.sections\.oceanToSpace/);
  assert.match(oceanTransition, /class OceanToSpaceTransition/);
  assert.doesNotMatch(oceanTransition, /getLandOceanTransitionState/);
});

test("keeps the M4.5-corrected world orientation fixed through the sea-to-space morph", async () => {
  const sceneController = await readFile(new URL("src/interactive/SceneController.ts", root), "utf8");

  assert.match(sceneController, /this\.world\.rotation = 0/);
  assert.doesNotMatch(sceneController, /maxRotation/);
  assert.doesNotMatch(sceneController, /Math\.sin\(transform \* Math\.PI\)/);
});

test("keeps the traveler corridor and Programs archive free of content collisions", async () => {
  const [css, storyConfig] = await Promise.all([
    readFile(new URL("src/styles/global.css", root), "utf8"),
    readFile(new URL("src/config/story.config.ts", root), "utf8"),
  ]);

  assert.match(css, /--hero-safe-top:\s*max\(88px,\s*12vh\)/);
  assert.match(css, /\.hero-copy\s*\{[\s\S]*?top:\s*var\(--hero-safe-top\)/);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?--hero-safe-top:\s*max\(76px,\s*8vh\)/);
  assert.match(storyConfig, /traveler:\s*\{\s*start:\s*0\.13,\s*travel:\s*0\.46/);
  assert.match(css, /--road-sign-safe-top:\s*28vh/);
  assert.match(css, /--road-sign-min-height:\s*250px/);
  assert.match(css, /--road-sign-stagger:\s*12px/);
  assert.match(css, /--road-sign-post-height:\s*52px/);
  assert.match(css, /\.road-signs\s*\{[\s\S]*?top:\s*var\(--road-sign-safe-top\)/);
  assert.match(css, /\.road-sign\s*\{[\s\S]*?min-height:\s*var\(--road-sign-min-height\)/);
  assert.match(css, /@media \(min-width:\s*981px\) and \(max-height:\s*820px\)[\s\S]*?--road-sign-min-height:\s*190px[\s\S]*?--road-sign-post-height:\s*28px/);
  assert.match(css, /@media \(max-width:\s*980px\)[\s\S]*?grid-auto-flow:\s*column[\s\S]*?\.road-sign__post\s*\{\s*display:\s*none;/);
  assert.match(css, /@media \(max-width:\s*980px\) and \(max-height:\s*700px\)[\s\S]*?min-height:\s*190px/);
  assert.match(css, /\.immersive-home--force-motion \.road-signs\s*\{\s*position:\s*sticky;\s*top:\s*var\(--road-sign-safe-top\)/);
  assert.doesNotMatch(css, /\.road-signs\s*\{\s*position:\s*sticky;\s*top:\s*(?:37|38)vh/);

  assert.match(css, /\.story-stage--programs \.stage-copy\s*\{\s*position:\s*relative;\s*top:\s*auto;/);
  assert.match(css, /\.portholes\s*\{\s*display:\s*grid;\s*gap:\s*var\(--program-card-gap\);/);
  assert.match(css, /\.porthole\s*\{\s*position:\s*relative;\s*top:\s*auto;/);
  assert.match(css, /\.immersive-home--force-motion \.porthole\s*\{\s*position:\s*relative;\s*top:\s*auto;\s*margin-bottom:\s*0;/);
  assert.match(css, /\.immersive-home--force-motion \.story-stage--programs\s*\{\s*height:\s*300vh;\s*min-height:\s*1900px;/);
  assert.match(css, /@media \(max-width:\s*767px\) and \(prefers-reduced-motion:\s*reduce\)[\s\S]*?--story-height:\s*650vh/);
  assert.doesNotMatch(css, /\.porthole\s*\{\s*position:\s*sticky/);
  assert.doesNotMatch(css, /--porthole-index\) \* (?:6|8)vh/);
});
