import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";
import {
  MOTION_STORAGE_KEY,
  readSavedMotionPreference,
  resolveMotionPreference,
  urlWithoutMotionOverride,
  writeSavedMotionPreference,
} from "../src/lib/motionPreference.ts";
import {
  clampStoryProgress,
  storyProgressForScrollY,
  storyScrollYForProgress,
} from "../src/lib/storyScroll.ts";
import { getOctopusTravelerState, getProgramsArchiveState } from "../src/config/story.config.ts";

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

test("keeps content, SEO, motion modes, and migrated source boundaries", async () => {
  const [home, program, css, contentConfig, baseLayout] = await Promise.all([
    readFile(new URL("dist/index.html", root), "utf8"),
    readFile(new URL("dist/programs/tidy-desk/index.html", root), "utf8"),
    readFile(new URL("src/styles/global.css", root), "utf8"),
    readFile(new URL("src/content.config.ts", root), "utf8"),
    readFile(new URL("src/layouts/BaseLayout.astro", root), "utf8"),
  ]);
  assert.match(home, /aria-label="旅程阶段"/);
  assert.match(home, /\/programs\/tidy-desk\//);
  assert.match(program, /rel="canonical"[^>]+\/programs\/tidy-desk\//);
  assert.match(program, /og:image/);
  assert.match(css, /html\[data-motion-mode="reduce"\]/);
  assert.match(baseLayout, /prefers-reduced-motion: reduce/);
  assert.match(baseLayout, /data-motion-mode="full"/);
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
  assert.match(homeComponent, /useMotionPreference\(\)/);
  assert.match(homeComponent, /preservedProgress[\s\S]*?trigger\.refresh\(\)/);
  assert.match(homeComponent, /get\("canvas"\) === "fallback"/);
  assert.match(css, /top:\s*calc\(var\(--waterline-y/);
  assert.match(css, /height:\s*64px/);
  assert.match(css, /html\[data-motion-mode="reduce"\]/);
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
  assert.match(storyConfig, /oceanToSpace:\s*\[0\.66,\s*0\.8\]/);
  assert.match(sceneController, /getOceanSpaceMorphState\(this\.progress\)/);
  assert.match(oceanTransition, /class OceanToSpaceTransition/);
  assert.doesNotMatch(oceanTransition, /getLandOceanTransitionState/);
});

test("keeps the M4.5-corrected world orientation fixed through the sea-to-space morph", async () => {
  const [sceneController, oceanTransition, underwaterScene, spaceScene] = await Promise.all([
    readFile(new URL("src/interactive/SceneController.ts", root), "utf8"),
    readFile(new URL("src/interactive/transitions/OceanToSpaceTransition.ts", root), "utf8"),
    readFile(new URL("src/interactive/scenes/UnderwaterScene.ts", root), "utf8"),
    readFile(new URL("src/interactive/scenes/SpaceScene.ts", root), "utf8"),
  ]);

  assert.match(sceneController, /this\.world\.rotation = 0/);
  assert.doesNotMatch(sceneController, /maxRotation/);
  assert.doesNotMatch(sceneController, /Math\.sin\(transform \* Math\.PI\)/);
  for (const source of [oceanTransition, underwaterScene, spaceScene]) {
    assert.doesNotMatch(source, /\.rotation\s*=/);
    assert.doesNotMatch(source, /scale\.set\([^)]*-/);
  }
});

test("implements one deterministic M5 particle pool from bubbles through stars and meteors", async () => {
  const [storyConfig, sceneController, morphParticles, oceanTransition, underwaterScene, spaceScene, homeComponent, css] = await Promise.all([
    readFile(new URL("src/config/story.config.ts", root), "utf8"),
    readFile(new URL("src/interactive/SceneController.ts", root), "utf8"),
    readFile(new URL("src/interactive/transitions/morphParticles.ts", root), "utf8"),
    readFile(new URL("src/interactive/transitions/OceanToSpaceTransition.ts", root), "utf8"),
    readFile(new URL("src/interactive/scenes/UnderwaterScene.ts", root), "utf8"),
    readFile(new URL("src/interactive/scenes/SpaceScene.ts", root), "utf8"),
    readFile(new URL("src/components/ImmersiveHome.tsx", root), "utf8"),
    readFile(new URL("src/styles/global.css", root), "utf8"),
  ]);

  for (const range of [
    "preheat: [0.64, 0.66]",
    "bubbleDensity: [0.66, 0.69]",
    "brighten: [0.69, 0.72]",
    "bubbleToStar: [0.72, 0.755]",
    "starToMeteor: [0.755, 0.785]",
    "settleSpace: [0.785, 0.8]",
  ]) assert.ok(storyConfig.includes(range), range);

  assert.match(storyConfig, /export function getOceanSpaceMorphState/);
  assert.match(storyConfig, /desktop:\s*0\.055/);
  assert.match(storyConfig, /mobile:\s*0\.022/);
  assert.match(storyConfig, /reducedMotion:\s*0/);
  assert.match(morphParticles, /export type MorphParticle/);
  assert.match(morphParticles, /export const MORPH_PARTICLES: readonly MorphParticle\[\] = Array\.from/);
  assert.match(morphParticles, /createSeededRandom\(0x50495845\)/);
  assert.doesNotMatch(morphParticles, /Math\.random/);
  assert.match(oceanTransition, /MORPH_PARTICLES/);
  assert.match(oceanTransition, /particle\.meteorRank < meteorRatio/);
  assert.match(oceanTransition, /drawMeteorTail/);
  assert.match(oceanTransition, /drawGalaxy/);
  assert.doesNotMatch(oceanTransition, /private waves/);
  assert.doesNotMatch(underwaterScene, /const bubblePool/);
  assert.doesNotMatch(spaceScene, /const starSeeds/);
  assert.doesNotMatch(spaceScene, /meteorX/);
  assert.match(sceneController, /getOceanSpaceMorphState\(this\.progress\)/);
  assert.match(sceneController, /this\.oceanTransition\.update\([^;]*this\.progress/);
  assert.match(homeComponent, /--program-exit-opacity/);
  assert.match(homeComponent, /data-programs-exited/);
  assert.match(homeComponent, /--about-enter-opacity/);
  assert.match(css, /var\(--program-exit-opacity, 1\)/);
  assert.match(css, /\.immersive-home\[data-programs-exited\]/);
  assert.match(css, /var\(--about-enter-opacity, 1\)/);
});

test("keeps the traveler corridor and Programs archive free of content collisions", async () => {
  const [css, storyConfig] = await Promise.all([
    readFile(new URL("src/styles/global.css", root), "utf8"),
    readFile(new URL("src/config/story.config.ts", root), "utf8"),
  ]);

  assert.match(css, /--hero-safe-top:\s*max\(88px,\s*12vh\)/);
  assert.match(css, /\.hero-copy\s*\{[\s\S]*?top:\s*var\(--hero-safe-top\)/);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?--hero-safe-top:\s*max\(76px,\s*8vh\)/);
  assert.match(storyConfig, /land:\s*\{[\s\S]*?startX:\s*0\.13,[\s\S]*?endX:\s*0\.59/);
  assert.match(css, /--road-sign-safe-top:\s*28vh/);
  assert.match(css, /--road-sign-min-height:\s*250px/);
  assert.match(css, /--road-sign-stagger:\s*12px/);
  assert.match(css, /--road-sign-post-height:\s*52px/);
  assert.match(css, /\.road-signs\s*\{[\s\S]*?top:\s*var\(--road-sign-safe-top\)/);
  assert.match(css, /\.road-sign\s*\{[\s\S]*?min-height:\s*var\(--road-sign-min-height\)/);
  assert.match(css, /@media \(min-width:\s*981px\) and \(max-height:\s*820px\)[\s\S]*?--road-sign-min-height:\s*190px[\s\S]*?--road-sign-post-height:\s*28px/);
  assert.match(css, /@media \(max-width:\s*980px\)[\s\S]*?grid-auto-flow:\s*column[\s\S]*?\.road-sign__post\s*\{\s*display:\s*none;/);
  assert.match(css, /@media \(max-width:\s*980px\) and \(max-height:\s*700px\)[\s\S]*?min-height:\s*190px/);
  assert.match(css, /\.road-signs\s*\{[\s\S]*?position:\s*sticky;[\s\S]*?top:\s*var\(--road-sign-safe-top\)/);
  assert.doesNotMatch(css, /\.road-signs\s*\{\s*position:\s*sticky;\s*top:\s*(?:37|38)vh/);

  assert.match(css, /html\[data-motion-mode="full"\] \.story-stage--programs \.programs-copy\s*\{[\s\S]*?position:\s*sticky;[\s\S]*?top:\s*var\(--program-title-safe-top\)/);
  assert.match(css, /grid-template-columns:\s*var\(--program-title-lane-width\) minmax\(0,\s*1fr\)/);
  assert.match(css, /\.story-stage--programs \.portholes\s*\{[\s\S]*?grid-column:\s*2;[\s\S]*?justify-items:\s*end;/);
  assert.match(css, /@media \(max-width:\s*1199px\)[\s\S]*?\.story-stage--programs \.programs-copy\s*\{[\s\S]*?position:\s*relative;[\s\S]*?opacity:\s*1;/);
  assert.match(css, /\.portholes\s*\{\s*display:\s*grid;\s*gap:\s*var\(--program-card-gap\);/);
  assert.match(css, /\.porthole\s*\{\s*position:\s*relative;\s*top:\s*auto;/);
  assert.match(css, /html\[data-motion-mode="reduce"\] \.porthole\s*\{\s*margin-bottom:\s*0;/);
  assert.match(css, /\.story-stage--programs\s*\{\s*height:\s*300vh;\s*min-height:\s*1900px;/);
  assert.match(css, /html\[data-motion-mode="reduce"\] \.immersive-home\s*\{\s*--story-height:\s*auto !important;/);
  assert.doesNotMatch(css, /\.porthole\s*\{\s*position:\s*sticky/);
  assert.doesNotMatch(css, /\.porthole\s*\{\s*position:\s*fixed/);
  assert.doesNotMatch(css, /--porthole-index\) \* (?:6|8)vh/);
});

test("derives the M6.1 Programs title fade reversibly from global progress", () => {
  const beforeFade = getProgramsArchiveState(0.59);
  const middleFade = getProgramsArchiveState(0.615);
  const afterFade = getProgramsArchiveState(0.64);
  const reverseMiddle = getProgramsArchiveState(0.615);

  assert.deepEqual(beforeFade, {
    titleExitProgress: 0,
    titleOpacity: 1,
    titleRisePx: 0,
    titleColor: 0xe5faff,
  });
  assert.equal(middleFade.titleExitProgress, 0.5);
  assert.equal(middleFade.titleOpacity, 0.5);
  assert.equal(middleFade.titleRisePx, 6);
  assert.equal(middleFade.titleColor, 0x7f87a1);
  assert.deepEqual(reverseMiddle, middleFade);
  assert.deepEqual(afterFade, {
    titleExitProgress: 1,
    titleOpacity: 0,
    titleRisePx: 12,
    titleColor: 0x181443,
  });
});

test("derives all M6.2 octopus narrative forms reversibly from one progress model", () => {
  assert.deepEqual(getOctopusTravelerState(0), {
    form: "land",
    worldX: 0.13,
    worldY: 0.73,
    landOpacity: 1,
    diverOpacity: 0,
    astronautVisibility: 0,
    aboveContent: false,
  });

  const leapApex = getOctopusTravelerState(0.328);
  assert.equal(leapApex.form, "land");
  assert.equal(leapApex.worldY, 0.48);
  assert.equal(leapApex.landOpacity, 1);
  assert.equal(leapApex.aboveContent, true);

  const waveCover = getOctopusTravelerState(0.368);
  assert.equal(waveCover.form, "land");
  assert.equal(waveCover.worldY, 0.76);
  assert.equal(waveCover.landOpacity, 0);

  const underwaterStart = getOctopusTravelerState(0.38);
  assert.equal(underwaterStart.form, "diver");
  assert.equal(underwaterStart.worldX, 0.82);
  assert.ok(Math.abs(underwaterStart.worldY - 0.2) < 1e-9);
  assert.equal(underwaterStart.diverOpacity, 1);

  const programs = getOctopusTravelerState(0.5);
  assert.equal(programs.form, "diver");
  assert.ok(Math.abs(programs.worldX - 0.52) < 1e-9);
  assert.ok(Math.abs(programs.worldY - 0.44) < 1e-9);

  const oceanExit = getOctopusTravelerState(0.66);
  assert.equal(oceanExit.form, "diver");
  assert.equal(oceanExit.worldY, 1.16);
  assert.equal(oceanExit.diverOpacity, 0);
  assert.equal(getOctopusTravelerState(0.7).form, "hidden");
  assert.equal(getOctopusTravelerState(0.8).astronautVisibility, 0);
  assert.ok(Math.abs(getOctopusTravelerState(0.815).astronautVisibility - 0.5) < 1e-9);
  assert.equal(getOctopusTravelerState(0.83).astronautVisibility, 1);
  assert.deepEqual(getOctopusTravelerState(0.815), getOctopusTravelerState(0.815));

  const mobileLeapApex = getOctopusTravelerState(0.328, true);
  assert.equal(mobileLeapApex.worldX, 0.9);
  assert.equal(mobileLeapApex.worldY, 0.55);
  const mobilePrograms = getOctopusTravelerState(0.5, true);
  assert.ok(Math.abs(mobilePrograms.worldX - 0.86) < 1e-9);
  assert.ok(Math.abs(mobilePrograms.worldY - 0.44) < 1e-9);
});

test("implements M6.2 production sprites, layering, and one cleaned-up astronaut loop", async () => {
  const [storyConfig, homeComponent, astronaut, overworldScene, pixelDraw, css, assetScript] = await Promise.all([
    readFile(new URL("src/config/story.config.ts", root), "utf8"),
    readFile(new URL("src/components/ImmersiveHome.tsx", root), "utf8"),
    readFile(new URL("src/components/AstronautOctopus.tsx", root), "utf8"),
    readFile(new URL("src/interactive/scenes/OverworldScene.ts", root), "utf8"),
    readFile(new URL("src/interactive/pixel/draw.ts", root), "utf8"),
    readFile(new URL("src/styles/global.css", root), "utf8"),
    readFile(new URL("scripts/process-m62-assets.mjs", root), "utf8"),
  ]);

  for (const invariant of [
    "overworld: [0, 0.3]",
    "dive: [0.3, 0.38]",
    "underwater: [0.38, 0.66]",
    "oceanToSpace: [0.66, 0.8]",
    "space: [0.8, 1]",
    "astronautGate: [0.8, 0.83]",
  ]) assert.ok(storyConfig.includes(invariant), invariant);

  assert.match(storyConfig, /export function getOctopusTravelerState/);
  assert.match(homeComponent, /getOctopusTravelerState\(progress,\s*window\.innerWidth <= 767\)/);
  assert.match(homeComponent, /octopus-world-sprite--land/);
  assert.match(homeComponent, /octopus-world-sprite--diver/);
  assert.match(homeComponent, /<AstronautOctopus/);
  assert.match(homeComponent, /data-octopus-above-content/);
  assert.doesNotMatch(overworldScene, /drawTraveler/);
  assert.doesNotMatch(pixelDraw, /export function drawTraveler/);

  assert.match(astronaut, /window\.requestAnimationFrame\(tick\)/);
  assert.match(astronaut, /window\.cancelAnimationFrame\(animationFrameId\)/);
  assert.match(astronaut, /document\.addEventListener\("visibilitychange"/);
  assert.match(astronaut, /document\.removeEventListener\("visibilitychange"/);
  assert.match(astronaut, /window\.removeEventListener\("resize"/);
  assert.match(astronaut, /if \(mode === "hidden" \|\| mode === "reduced"\) startEntry\(\)/);
  assert.match(astronaut, /visibility <= 0\.001/);
  assert.doesNotMatch(astronaut, /addEventListener\("scroll"/);
  assert.doesNotMatch(astronaut, /ScrollTrigger/);

  assert.match(css, /\.octopus-world-layer\s*\{[\s\S]*?z-index:\s*1;[\s\S]*?pointer-events:\s*none/);
  assert.match(css, /\.immersive-home\[data-octopus-above-content\] \.octopus-world-layer\s*\{[\s\S]*?z-index:\s*3/);
  assert.match(css, /\.octopus-astronaut\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?z-index:\s*3;[\s\S]*?pointer-events:\s*none/);
  assert.match(css, /\.signal-station \.constellation-card\s*\{[\s\S]*?z-index:\s*4/);
  assert.match(css, /html\[data-motion-mode="reduce"\] \.octopus-world-sprite img\s*\{\s*animation:\s*none/);
  assert.match(assetScript, /kernel:\s*sharp\.kernel\.nearest/);
  assert.match(assetScript, /CANVAS_SIZE = 384/);

  for (const asset of [
    "octopus-land.png",
    "octopus-diver.png",
    "octopus-astronaut.png",
  ]) await access(new URL(`src/assets/m6-2/${asset}`, root));
});

test("implements M5.5 polish without changing the M5 progress contract", async () => {
  const [storyConfig, homeComponent, meteorOverlay, oceanTransition, diveTransition, waveAssets, pixelDraw, css] = await Promise.all([
    readFile(new URL("src/config/story.config.ts", root), "utf8"),
    readFile(new URL("src/components/ImmersiveHome.tsx", root), "utf8"),
    readFile(new URL("src/components/MeteorOverlay.tsx", root), "utf8"),
    readFile(new URL("src/interactive/transitions/OceanToSpaceTransition.ts", root), "utf8"),
    readFile(new URL("src/interactive/transitions/DiveTransition.ts", root), "utf8"),
    readFile(new URL("src/interactive/transitions/m55WaveAssets.ts", root), "utf8"),
    readFile(new URL("src/interactive/pixel/draw.ts", root), "utf8"),
    readFile(new URL("src/styles/global.css", root), "utf8"),
  ]);

  for (const invariant of [
    "dive: [0.3, 0.38]",
    "oceanToSpace: [0.66, 0.8]",
    "space: [0.8, 1]",
    "intervalMs: { min: 1000, max: 3000 }",
    "durationMs: { min: 300, max: 900 }",
    "maxActive: { desktop: 2, mobile: 1 }",
  ]) assert.ok(storyConfig.includes(invariant), invariant);

  assert.match(oceanTransition, /yBeforeMeteor \+ particle\.meteorDirectionY \* travel/);
  assert.match(oceanTransition, /y - particle\.meteorDirectionY \* distance/);
  assert.match(homeComponent, /<MeteorOverlay active=\{phase === "space" && !canvasFailed\}/);
  assert.doesNotMatch(meteorOverlay, /globalProgress|scrollProgress|ScrollTrigger/);
  assert.match(meteorOverlay, /visibilitychange/);
  assert.match(meteorOverlay, /reducedMotion:\s*boolean/);
  assert.match(meteorOverlay, /motionReduced = \(\) => reducedMotion/);
  assert.match(meteorOverlay, /clearTimeout\(timerId\)/);
  assert.match(meteorOverlay, /cancelAnimationFrame\(animationFrameId\)/);
  assert.match(meteorOverlay, /meteors = \[\]/);
  assert.match(css, /\.story-canvas,\s*\.meteor-overlay,\s*\.canvas-fallback\s*\{[\s\S]*?position:\s*fixed/);

  assert.match(diveTransition, /loadM55WaveTextures/);
  assert.match(diveTransition, /new TilingSprite/);
  assert.match(diveTransition, /spriteConfig\.back/);
  assert.match(diveTransition, /spriteConfig\.mid/);
  assert.match(diveTransition, /spriteConfig\.foreground/);
  assert.match(waveAssets, /wave-front\.png/);
  assert.match(waveAssets, /foam-band-front\.png/);
  assert.match(waveAssets, /bubble-clusters\.png/);
  for (const asset of [
    "wave-front.png",
    "wave-mid.png",
    "wave-back.png",
    "foam-band-front.png",
    "foam-band-mid.png",
    "bubble-clusters.png",
  ]) await access(new URL(`src/assets/m5-5/${asset}`, root));

  assert.match(pixelDraw, /planetHalo/);
  assert.match(pixelDraw, /rearRingAlpha/);
  assert.match(pixelDraw, /frontRingAlpha/);
  assert.match(pixelDraw, /Core body covers the middle of the rear ring/);
});

test("resolves and persists the M6 motion preference contract", async () => {
  assert.deepEqual(resolveMotionPreference("", null), { mode: "full", source: "default" });
  assert.deepEqual(resolveMotionPreference("", "reduce"), { mode: "reduce", source: "saved" });
  assert.deepEqual(resolveMotionPreference("?motion=full", "reduce"), { mode: "full", source: "url" });
  assert.deepEqual(resolveMotionPreference("?motion=reduce", "full"), { mode: "reduce", source: "url" });
  assert.deepEqual(resolveMotionPreference("?motion=unknown", "reduce"), { mode: "reduce", source: "saved" });

  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  assert.equal(writeSavedMotionPreference(storage, "reduce"), true);
  assert.equal(values.get(MOTION_STORAGE_KEY), "reduce");
  assert.equal(readSavedMotionPreference(storage), "reduce");

  const blockedStorage = {
    getItem: () => { throw new Error("blocked"); },
    setItem: () => { throw new Error("blocked"); },
  };
  assert.equal(readSavedMotionPreference(blockedStorage), null);
  assert.equal(writeSavedMotionPreference(blockedStorage, "full"), false);
  assert.equal(urlWithoutMotionOverride("https://example.com/?motion=reduce&canvas=fallback#test"), "/?canvas=fallback#test");

  const [homeComponent, hook, control, meteorOverlay, sceneController, css, layout, storyConfig] = await Promise.all([
    readFile(new URL("src/components/ImmersiveHome.tsx", root), "utf8"),
    readFile(new URL("src/hooks/useMotionPreference.ts", root), "utf8"),
    readFile(new URL("src/components/MotionModeControl.tsx", root), "utf8"),
    readFile(new URL("src/components/MeteorOverlay.tsx", root), "utf8"),
    readFile(new URL("src/interactive/SceneController.ts", root), "utf8"),
    readFile(new URL("src/styles/global.css", root), "utf8"),
    readFile(new URL("src/layouts/BaseLayout.astro", root), "utf8"),
    readFile(new URL("src/config/story.config.ts", root), "utf8"),
  ]);

  assert.match(layout, /MOTION_STORAGE_KEY/);
  assert.match(layout, /queryMode === "full" \|\| queryMode === "reduce"/);
  assert.match(hook, /resolveMotionPreference/);
  assert.match(hook, /history\.replaceState/);
  assert.match(hook, /writeSavedMotionPreference/);
  assert.match(control, /aria-pressed=\{reduced\}/);
  assert.match(control, /系统建议简化动画/);
  assert.match(homeComponent, /data-motion-source=\{motionPreference\.source\}/);
  assert.match(homeComponent, /scrollTriggerRef/);
  assert.match(homeComponent, /trigger\.start/);
  assert.match(homeComponent, /trigger\.end/);
  assert.match(homeComponent, /motionRestoreRevisionRef/);
  assert.match(homeComponent, /data-motion-restoring/);
  assert.match(homeComponent, /end:\s*\(\)\s*=>\s*`\+=\$\{Math\.max\(1, story\.offsetHeight - window\.innerHeight\)\}`/);
  assert.match(homeComponent, /invalidateOnRefresh:\s*true/);
  assert.match(homeComponent, /storyScrollYForProgress\(bounds, preservedProgress\)/);
  assert.doesNotMatch(homeComponent, /document\.documentElement\.scrollHeight[\s\S]*?preservedProgress/);
  assert.match(homeComponent, /articles\.slice\(0, 2\)/);
  assert.match(homeComponent, /programs\.slice\(0, 2\)/);
  assert.match(meteorOverlay, /\[active, reducedMotion\]/);
  assert.doesNotMatch(meteorOverlay, /matchMedia/);
  assert.match(sceneController, /detectQuality\(reducedMotion = false\)/);
  assert.doesNotMatch(sceneController, /detectQuality\(\)[\s\S]*?matchMedia/);
  assert.match(css, /\.motion-mode-control button:focus-visible/);
  assert.match(css, /\.constellation-links\s*\{[\s\S]*?display:\s*grid[\s\S]*?gap:\s*8px/);
  assert.match(css, /\.constellation-links\s*\{[\s\S]*?z-index:\s*4/);
  assert.match(css, /\.constellation-star span\s*\{[\s\S]*?opacity:\s*1/);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.constellation-links\s*\{\s*position:\s*relative/);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.signal-station\s*\{\s*position:\s*relative;\s*top:\s*auto/);
  assert.match(storyConfig, /maxSettleFrames:\s*12/);
  assert.match(storyConfig, /requiredStableFrames:\s*4/);
  assert.match(storyConfig, /progressTolerance:\s*0\.01/);
  assert.doesNotMatch(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
});

test("maps M6 motion-mode restoration through the active story bounds", () => {
  const bounds = { start: 120, end: 8120 };
  for (const progress of [0.64, 0.72, 0.76, 0.79, 0.8, 0.82, 0.9, 1]) {
    const scrollY = storyScrollYForProgress(bounds, progress);
    assert.ok(Math.abs(storyProgressForScrollY(bounds, scrollY) - progress) < 1e-9);
  }
  assert.equal(storyScrollYForProgress(bounds, -1), bounds.start);
  assert.equal(storyScrollYForProgress(bounds, 2), bounds.end);
  assert.equal(storyProgressForScrollY(bounds, bounds.end + 200), 1);
  assert.equal(storyProgressForScrollY({ start: 5, end: 5 }, 5), 0);
  assert.equal(clampStoryProgress(0.5), 0.5);
});
