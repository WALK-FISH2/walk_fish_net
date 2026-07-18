import { Container, Graphics } from "pixi.js";
import { STORY_CONFIG, getUnderwaterState, mixColor } from "../../config/story.config";
import { drawFish, drawJellyfish, drawKelp, drawRuin } from "../pixel/draw";
import type { PixelScene, SceneFrame } from "./types";

const farFishPool = Array.from({ length: 11 }, (_, index) => ({ x: index * 179, y: 0.21 + (index % 4) * 0.09, scale: 0.45 + (index % 3) * 0.1, direction: (index % 2 ? -1 : 1) as 1 | -1 }));
const midFishPool = Array.from({ length: 8 }, (_, index) => ({ x: index * 241, y: 0.36 + (index % 5) * 0.08, scale: 0.8 + (index % 3) * 0.22, direction: (index % 3 === 0 ? -1 : 1) as 1 | -1 }));
const jellyfishPool = Array.from({ length: 5 }, (_, index) => ({ x: 0.12 + index * 0.21, y: 0.22 + (index % 3) * 0.13, scale: 0.75 + (index % 2) * 0.35 }));

function wrap(value: number, size: number) { return ((value % size) + size) % size; }

function drawCoral(graphics: Graphics, x: number, groundY: number, scale: number, color: number) {
  const stem = 9 * scale;
  graphics.rect(x - stem / 2, groundY - 54 * scale, stem, 54 * scale).fill(color)
    .rect(x - 22 * scale, groundY - 39 * scale, 23 * scale, stem).fill(color)
    .rect(x - 25 * scale, groundY - 58 * scale, stem, 26 * scale).fill(color)
    .rect(x + 2 * scale, groundY - 28 * scale, 22 * scale, stem).fill(color)
    .rect(x + 17 * scale, groundY - 47 * scale, stem, 27 * scale).fill(color);
}

function drawRock(graphics: Graphics, x: number, groundY: number, radius: number, color: number) {
  graphics.moveTo(x - radius, groundY).lineTo(x - radius * 0.72, groundY - radius * 0.66).lineTo(x - radius * 0.2, groundY - radius).lineTo(x + radius * 0.58, groundY - radius * 0.72).lineTo(x + radius, groundY).fill(color)
    .rect(x - radius * 0.3, groundY - radius * 0.72, radius * 0.48, Math.max(2, radius * 0.12)).fill({ color: 0x31596b, alpha: 0.42 });
}

export class UnderwaterScene implements PixelScene {
  container = new Container();
  private backdrop = new Graphics();
  private farDecor = new Graphics();
  private midground = new Graphics();
  private nearDecor = new Graphics();
  private foreground = new Graphics();

  constructor() { this.container.addChild(this.backdrop, this.farDecor, this.midground, this.nearDecor, this.foreground); }

  update({ width, height, globalProgress, progress, time, pointerX, particleScale, reducedMotion }: SceneFrame) {
    const bedY = height * 0.88;
    const state = getUnderwaterState(globalProgress);
    const parallax = STORY_CONFIG.underwater.parallax;
    const preheatConfig = STORY_CONFIG.underwater.preheat;
    const animationTime = reducedMotion ? 0 : time;
    const farShift = progress * width * parallax.far.strength;
    const midShift = progress * width * parallax.mid.strength;
    const nearShift = progress * width * parallax.near.strength;
    const fishExit = state.preheat * width * preheatConfig.fishExitTravel;
    const currentDrift = state.preheat * width * preheatConfig.currentBoost;

    this.backdrop.clear();
    const bands = 18;
    const surfaceColor = mixColor(0x167691, 0x0b4b69, state.established);
    const abyssColor = mixColor(0x092744, 0x02091c, state.tail * 0.78);
    for (let index = 0; index < bands; index += 1) {
      const t = index / (bands - 1);
      this.backdrop.rect(0, index * height / bands, width, height / bands + 1).fill(mixColor(surfaceColor, abyssColor, Math.pow(t, 0.82)));
    }
    this.backdrop.moveTo(0, bedY + 12);
    for (let x = 0; x <= width + 48; x += 48) this.backdrop.lineTo(x, bedY + Math.sin(x * 0.027) * 12 + (x / 48 % 3) * 4);
    this.backdrop.lineTo(width, height).lineTo(0, height).fill(0x020c1d);

    this.farDecor.clear();
    const rayLean = (pointerX - 0.5) * 35 + state.preheat * width * preheatConfig.rayLean;
    const rayCount = particleScale < 0.5 ? 3 : 5;
    for (let index = 0; index < rayCount; index += 1) {
      const x = width * (0.04 + index * 0.23);
      this.farDecor.moveTo(x, -20).lineTo(x + width * 0.12, -20).lineTo(x + width * 0.24 + rayLean, height * 0.83).lineTo(x + width * 0.13 + rayLean, height * 0.83).fill({ color: 0x89f0d7, alpha: 0.025 + (index % 2) * 0.018 });
    }
    drawRuin(this.farDecor, width * 0.22 - farShift * parallax.far.ruin[0], bedY, 0.65, 0x25bec4);
    drawRuin(this.farDecor, width * 0.76 - farShift * parallax.far.ruin[1], bedY, 0.9, 0x5e8cff);
    const farFishCount = Math.max(5, Math.round(farFishPool.length * (0.35 + particleScale * 0.65)));
    for (let index = 0; index < farFishCount; index += 1) {
      const fish = farFishPool[index];
      const travel = farShift * parallax.far.fish + animationTime * 9;
      const x = wrap(fish.x + travel * fish.direction, width + 130) - 65 + fishExit * fish.direction;
      drawFish(this.farDecor, x, height * fish.y, fish.scale, fish.direction, 0x5c91a4, 0.28 * (1 - state.preheat * 0.72));
    }

    this.midground.clear();
    const midFishCount = Math.max(3, Math.round(midFishPool.length * (0.32 + particleScale * 0.68)));
    for (let index = 0; index < midFishCount; index += 1) {
      const fish = midFishPool[index];
      const travel = midShift * parallax.mid.fish + animationTime * 18;
      const x = wrap(fish.x + travel * fish.direction, width + 170) - 85 + fishExit * fish.direction;
      drawFish(this.midground, x, height * fish.y, fish.scale, fish.direction, index % 2 ? 0x8db9cb : 0x25bec4, 0.48 * (1 - state.preheat * 0.62));
    }
    const jellyfishCount = Math.max(2, Math.round(jellyfishPool.length * (0.36 + particleScale * 0.64)));
    for (let index = 0; index < jellyfishCount; index += 1) {
      const jellyfish = jellyfishPool[index];
      const x = width * jellyfish.x - midShift * parallax.mid.jellyfish + Math.sin(animationTime * 0.8 + index) * 11 + currentDrift * 0.16;
      const y = height * jellyfish.y + Math.cos(animationTime * 0.65 + index) * 14;
      drawJellyfish(this.midground, x, y, jellyfish.scale, index % 2 ? 0xc16de0 : 0x89f0d7, 0.58);
    }

    this.nearDecor.clear();
    const kelpCount = particleScale < 0.5 ? 10 : particleScale < 0.8 ? 14 : 18;
    const kelpSwayBoost = 1 + state.preheat * preheatConfig.kelpBoost;
    for (let index = 0; index < kelpCount; index += 1) {
      const x = wrap(index / Math.max(1, kelpCount - 1) * width - nearShift * parallax.near.kelp + 35, width + 70) - 35;
      const sway = Math.sin(animationTime * 1.2 + index * 0.7 + progress * 5) * (10 + index % 3 * 3) * kelpSwayBoost;
      drawKelp(this.nearDecor, x, bedY + 8, 50 + (index % 5) * 18, sway, index % 3 === 0 ? 0x0a6b6d : 0x075b5d, 7 + index % 3);
    }
    const rockCount = particleScale < 0.5 ? 7 : 12;
    for (let index = 0; index < rockCount; index += 1) {
      const x = wrap(index / Math.max(1, rockCount - 1) * width + 18 - nearShift * parallax.near.terrain + 32, width + 64) - 32;
      drawRock(this.nearDecor, x, bedY + 13, 13 + index % 4 * 7, index % 5 === 0 ? 0x6b3858 : 0x163b4a);
      if (index % 4 === 0) drawCoral(this.nearDecor, x + 20, bedY + 8, 0.55 + (index % 3) * 0.12, index % 2 ? 0xc95a67 : 0xff806e);
    }

    this.foreground.clear();
    const foregroundTravel = progress * width * parallax.foreground.travel * parallax.foreground.strength;
    for (let index = -1; index < Math.ceil(width / 75) + 2; index += 1) {
      const x = index * 75 - foregroundTravel % 75;
      const sway = Math.sin(animationTime + index) * 18 * kelpSwayBoost;
      drawKelp(this.foreground, x, height + 8, 100 + (index % 4) * 35, sway, index % 3 ? 0x032b3c : 0x063c46, 13);
    }
    drawCoral(this.foreground, width * 0.9, height + 8, 1.35, 0x371f48);
    this.foreground.rect(0, bedY + 26, width, height - bedY).fill({ color: 0x010918, alpha: 0.44 });
  }

  destroy() { this.container.destroy({ children: true }); }
}
