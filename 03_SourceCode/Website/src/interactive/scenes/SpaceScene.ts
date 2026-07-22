import { Container, Graphics } from "pixi.js";
import { getOceanSpaceMorphState, mixColor } from "../../config/story.config";
import { drawFloatingIsland, drawPixelStar, drawPlanet } from "../pixel/draw";
import type { PixelScene, SceneFrame } from "./types";

const nebulaSeeds = Array.from({ length: 38 }, (_, index) => ({ x: ((index * 73) % 101) / 100, y: ((index * 41) % 97) / 96, size: 12 + index % 7 * 5 }));

export class SpaceScene implements PixelScene {
  container = new Container();
  private backdrop = new Graphics();
  private farDecor = new Graphics();
  private midground = new Graphics();
  private nearDecor = new Graphics();
  private particles = new Graphics();
  private foreground = new Graphics();
  constructor() { this.container.addChild(this.backdrop, this.farDecor, this.midground, this.nearDecor, this.particles, this.foreground); }

  update({ width, height, globalProgress, progress, time, particleScale, reducedMotion }: SceneFrame) {
    const morphState = getOceanSpaceMorphState(globalProgress);
    const animationTime = reducedMotion ? 0 : time;
    this.farDecor.alpha = morphState.nebula;
    this.midground.alpha = morphState.settleSpace;
    this.nearDecor.alpha = morphState.settleSpace;
    this.particles.alpha = morphState.settleSpace;
    this.foreground.alpha = morphState.settleSpace;
    this.backdrop.clear();
    const bands = 14;
    for (let index = 0; index < bands; index += 1) {
      const t = index / (bands - 1);
      this.backdrop.rect(0, index * height / bands, width, height / bands + 1).fill(mixColor(0x121039, 0x03020c, t));
    }
    this.backdrop.moveTo(-width * 0.2, height * 0.85).lineTo(width * 0.15, height * 0.22).lineTo(width * 0.37, height * 0.06).lineTo(width * 0.07, height * 0.72).fill({ color: 0x5e8cff, alpha: 0.055 });

    this.farDecor.clear();
    for (const seed of nebulaSeeds) {
      const x = seed.x * width + Math.sin(seed.y * 9) * width * 0.08;
      const y = seed.y * height;
      const color = seed.x > 0.55 ? 0xc16de0 : 0x5b4cb5;
      this.farDecor.rect(Math.round(x), Math.round(y), seed.size * 2.2, seed.size).fill({ color, alpha: 0.025 + (seed.size % 5) * 0.008 });
    }
    for (let index = 0; index < 26; index += 1) {
      const x = index / 25 * width;
      const y = height * (0.8 - index / 25 * 0.62) + Math.sin(index * 1.6) * 24;
      this.farDecor.rect(x, y, 24 + index % 4 * 8, 6 + index % 3 * 2).fill({ color: index % 2 ? 0xc16de0 : 0x5e8cff, alpha: 0.08 });
    }

    this.midground.clear();
    const constellation = [[0.14, 0.3], [0.22, 0.23], [0.31, 0.34], [0.42, 0.26], [0.49, 0.39]] as const;
    constellation.forEach(([x, y], index) => {
      drawPixelStar(this.midground, x * width, y * height, 3, 0xfff3c4, 0.9);
      if (index > 0) {
        const previous = constellation[index - 1];
        this.midground.moveTo(previous[0] * width, previous[1] * height).lineTo(x * width, y * height).stroke({ width: 1, color: 0xaaa8cc, alpha: 0.32 });
      }
    });

    this.nearDecor.clear();
    drawPlanet(this.nearDecor, width * 0.84, height * 0.2, Math.min(width, height) * 0.09);
    drawFloatingIsland(this.nearDecor, width * 0.73 + Math.sin(animationTime * 0.22) * 10, height * 0.63 + Math.cos(animationTime * 0.3) * 7, Math.max(0.75, Math.min(1.15, width / 1100)));

    this.particles.clear();
    for (let index = 0; index < Math.round(50 * particleScale); index += 1) {
      const x = ((index * 113 + animationTime * (3 + index % 4)) % (width + 40)) - 20;
      const y = ((index * 59 + progress * 120 + Math.sin(animationTime + index) * 8) % height + height) % height;
      this.particles.rect(Math.round(x), Math.round(y), 2 + index % 2, 2 + index % 2).fill({ color: index % 4 === 0 ? 0xc16de0 : 0x5e8cff, alpha: 0.38 });
    }

    this.foreground.clear();
    for (let index = 0; index < 14; index += 1) {
      const x = ((index * 151 - progress * width * 0.33) % (width + 80) + width + 80) % (width + 80) - 40;
      const y = height * (0.08 + (index % 7) * 0.13);
      this.foreground.rect(x, y, 5 + index % 4 * 2, 3 + index % 3 * 2).fill({ color: 0x322b69, alpha: 0.7 });
    }
  }
  destroy() { this.container.destroy({ children: true }); }
}
