import { Container, Graphics } from "pixi.js";
import { mixColor, STORY_CONFIG } from "../../config/story.config";
import { drawFlower, drawMountain, drawPixelCloud, drawTower, drawTraveler, drawTree } from "../pixel/draw";
import type { PixelScene, SceneFrame } from "./types";

const dustSeeds = Array.from({ length: 42 }, (_, index) => ({
  x: ((index * 43) % 101) / 100,
  y: ((index * 67) % 29) / 28,
  phase: index * 0.43,
  size: 1 + (index % 3),
}));

export class OverworldScene implements PixelScene {
  container = new Container();
  private backdrop = new Graphics();
  private farDecor = new Graphics();
  private midground = new Graphics();
  private nearDecor = new Graphics();
  private foreground = new Graphics();
  private particles = new Graphics();

  constructor() {
    this.container.addChild(this.backdrop, this.farDecor, this.midground, this.nearDecor, this.particles, this.foreground);
  }

  update({ width, height, progress, time, particleScale }: SceneFrame) {
    const groundY = Math.round(height * 0.73);
    const { parallax, traveler } = STORY_CONFIG.overworld;
    const maxTravel = progress * width * parallax.maxTravel;
    const farShift = maxTravel * parallax.far.strength;
    const midShift = maxTravel * parallax.mid.strength;
    const nearShift = maxTravel * parallax.near.strength;
    const foregroundShift = maxTravel * parallax.foreground.strength;

    this.backdrop.clear();
    const bands = 14;
    for (let index = 0; index < bands; index += 1) {
      const t = index / (bands - 1);
      this.backdrop.rect(0, index * height / bands, width, height / bands + 1).fill(mixColor(0x66cfff, 0xd7f6ff, t));
    }
    this.backdrop.rect(0, groundY, width, height - groundY).fill(0x58c65a);
    this.backdrop.circle(width * 0.82, height * 0.17, Math.min(width, height) * 0.075).fill(0xffd25a);
    for (let ray = 0; ray < 8; ray += 1) {
      const angle = ray * Math.PI / 4;
      const x = width * 0.82 + Math.cos(angle) * 70;
      const y = height * 0.17 + Math.sin(angle) * 70;
      this.backdrop.rect(Math.round(x - 5), Math.round(y - 5), 10, 10).fill({ color: 0xfff3c4, alpha: 0.65 });
    }

    this.farDecor.clear();
    for (let index = -1; index < 5; index += 1) {
      const x = index * 300 - ((farShift + time * 5) % 300) - 80;
      drawPixelCloud(this.farDecor, x, 68 + (index % 2) * 50, 2, 0xfff6dd, 0xd6e8e2);
    }
    for (let index = -1; index < 4; index += 1) {
      const x = index * 390 - ((farShift * parallax.far.mountain) % 390);
      drawMountain(this.farDecor, x, groundY + 5, 420, 230 + (index % 2) * 48, index % 2 ? 0x4f8b88 : 0x6ba4a0);
    }
    for (let index = -1; index < 4; index += 1) {
      const x = index * 360 + 130 - ((farShift * parallax.far.lowerCloud + time * 9) % 360);
      drawPixelCloud(this.farDecor, x, 150 + (index % 3) * 34, 1, 0xffffff, 0xd7ece5);
    }

    this.midground.clear();
    this.midground.circle(width * 0.1 - midShift * parallax.mid.hills[0], groundY + 80, 210).fill(0x78c868)
      .circle(width * 0.55 - midShift * parallax.mid.hills[1], groundY + 100, 260).fill(0x61b75c)
      .circle(width * 0.95 - midShift * parallax.mid.hills[2], groundY + 60, 190).fill(0x4aa657);
    drawTower(this.midground, width * 0.69 - midShift * parallax.mid.tower, groundY, Math.max(0.75, Math.min(1.25, width / 1100)));
    for (let index = -1; index < 9; index += 1) {
      drawTree(this.midground, index * 170 + 65 - (midShift % 170), groundY, 0.75 + (index % 3) * 0.12);
    }

    this.nearDecor.clear();
    this.nearDecor.rect(0, groundY, width, 18).fill(0x83df64)
      .rect(0, groundY + 18, width, 35).fill(0x267a40)
      .rect(0, groundY + 53, width, height - groundY - 53).fill(0x92543a);
    const pathStart = width * 0.02 - nearShift * parallax.near.path[0];
    this.nearDecor.moveTo(pathStart, height).lineTo(width * 0.28 - nearShift * parallax.near.path[1], groundY + 25).lineTo(width * 0.48 - nearShift * parallax.near.path[2], groundY + 25).lineTo(width * 0.78, height).fill(0xd29a5f);
    for (let index = -1; index < Math.ceil(width / 28) + 2; index += 1) {
      const x = index * 28 - (nearShift % 28);
      this.nearDecor.rect(x, groundY + 22 + (index % 2) * 12, 14, 10).fill(index % 3 ? 0x74412f : 0xb56b45);
    }
    for (let index = 0; index < 18; index += 1) {
      const x = ((index * 83 - nearShift * parallax.near.flowers) % (width + 80) + width + 80) % (width + 80) - 40;
      drawFlower(this.nearDecor, x, groundY + 12, index % 2 ? 0xf45b5b : 0xffd25a, index % 4 === 0 ? 1.5 : 1);
    }

    const travelerX = Math.round(width * traveler.start + progress * width * traveler.travel);
    drawTraveler(this.nearDecor, travelerX, groundY + 7, Math.round(Math.sin(time * 5 + progress * 20) * 2), 1);

    this.particles.clear();
    const count = Math.round(dustSeeds.length * particleScale);
    for (let index = 0; index < count; index += 1) {
      const dust = dustSeeds[index];
      const dustStrength = parallax.near.dust.base + index % parallax.near.dust.variants * parallax.near.dust.step;
      const x = ((dust.x * width - nearShift * dustStrength) % width + width) % width;
      const y = groundY - 8 - dust.y * 80 + Math.sin(time * 1.8 + dust.phase) * 5;
      this.particles.rect(Math.round(x), Math.round(y), dust.size, dust.size).fill({ color: index % 4 === 0 ? 0xfff3c4 : 0xd29a5f, alpha: 0.45 });
    }

    this.foreground.clear();
    for (let index = -1; index < Math.ceil(width / 54) + 2; index += 1) {
      const x = index * 54 - (foregroundShift % 54);
      const blade = 46 + (index % 4) * 14;
      this.foreground.moveTo(x - 10, height).lineTo(x + 4, height - blade).lineTo(x + 12, height).fill(index % 3 ? 0x1f6339 : 0x174e31);
      if (index % 4 === 0) this.foreground.rect(x + 19, height - 28, 34, 28).fill(0x5e5144).rect(x + 24, height - 32, 22, 8).fill(0x7e7462);
    }
  }

  destroy() { this.container.destroy({ children: true }); }
}
