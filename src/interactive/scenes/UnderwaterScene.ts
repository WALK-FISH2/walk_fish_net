import { Container, Graphics } from "pixi.js";
import { mixColor } from "../../config/story.config";
import { drawFish, drawJellyfish, drawKelp, drawRuin } from "../pixel/draw";
import type { PixelScene, SceneFrame } from "./types";

const bubbleSeeds = Array.from({ length: 88 }, (_, index) => ({ x: ((index * 47) % 101) / 100, y: ((index * 71) % 97) / 96, size: 2 + (index % 6), speed: 0.025 + (index % 8) * 0.007, phase: index * 0.53 }));

export class UnderwaterScene implements PixelScene {
  container = new Container();
  private backdrop = new Graphics();
  private farDecor = new Graphics();
  private midground = new Graphics();
  private nearDecor = new Graphics();
  private particles = new Graphics();
  private foreground = new Graphics();

  constructor() { this.container.addChild(this.backdrop, this.farDecor, this.midground, this.nearDecor, this.particles, this.foreground); }

  update({ width, height, progress, time, pointerX, pointerY, particleScale }: SceneFrame) {
    const bedY = height * 0.88;
    this.backdrop.clear();
    const bands = 18;
    for (let index = 0; index < bands; index += 1) {
      const t = index / (bands - 1);
      this.backdrop.rect(0, index * height / bands, width, height / bands + 1).fill(mixColor(0x126b88, 0x031126, Math.pow(t, 0.82)));
    }
    this.backdrop.rect(0, bedY, width, height - bedY).fill(0x020c1d);

    this.farDecor.clear();
    const rayLean = (pointerX - 0.5) * 35;
    for (let index = 0; index < 5; index += 1) {
      const x = width * (0.04 + index * 0.23);
      this.farDecor.moveTo(x, -20).lineTo(x + width * 0.12, -20).lineTo(x + width * 0.24 + rayLean, height * 0.83).lineTo(x + width * 0.13 + rayLean, height * 0.83).fill({ color: 0x89f0d7, alpha: 0.025 + (index % 2) * 0.018 });
    }
    drawRuin(this.farDecor, width * 0.22 - progress * 35, bedY, 0.65, 0x25bec4);
    drawRuin(this.farDecor, width * 0.76 - progress * 60, bedY, 0.9, 0x5e8cff);
    for (let index = 0; index < 11; index += 1) {
      const direction = index % 2 ? -1 : 1;
      const x = ((index * 179 + progress * 90 * direction + time * 9 * direction) % (width + 130)) - 65;
      drawFish(this.farDecor, x, height * (0.21 + (index % 4) * 0.09), 0.45 + (index % 3) * 0.1, direction as 1 | -1, 0x5c91a4, 0.28);
    }

    this.midground.clear();
    for (let index = 0; index < 8; index += 1) {
      const direction = index % 3 === 0 ? -1 : 1;
      const x = ((index * 241 + progress * 170 * direction + time * 18 * direction) % (width + 170)) - 85;
      drawFish(this.midground, x, height * (0.36 + (index % 5) * 0.08), 0.8 + (index % 3) * 0.22, direction as 1 | -1, index % 2 ? 0x8db9cb : 0x25bec4, 0.48);
    }
    for (let index = 0; index < 5; index += 1) {
      const x = width * (0.12 + index * 0.21) + Math.sin(time * 0.8 + index) * 11;
      const y = height * (0.22 + (index % 3) * 0.13) + Math.cos(time * 0.65 + index) * 14;
      drawJellyfish(this.midground, x, y, 0.75 + (index % 2) * 0.35, index % 2 ? 0xc16de0 : 0x89f0d7, 0.58);
    }

    this.nearDecor.clear();
    for (let index = 0; index < 18; index += 1) {
      const x = index / 17 * width;
      const sway = Math.sin(time * 1.2 + index * 0.7 + progress * 5) * (10 + index % 3 * 3);
      drawKelp(this.nearDecor, x, bedY + 8, 50 + (index % 5) * 18, sway, index % 4 === 0 ? 0xff806e : index % 3 === 0 ? 0x0a6b6d : 0x075b5d, 7 + index % 3);
    }
    for (let index = 0; index < 12; index += 1) {
      const x = index / 11 * width + 18;
      this.nearDecor.circle(x, bedY + 10, 13 + index % 4 * 7).fill(index % 5 === 0 ? 0x6b3858 : 0x163b4a);
    }

    this.particles.clear();
    const count = Math.round(bubbleSeeds.length * particleScale);
    for (let index = 0; index < count; index += 1) {
      const bubble = bubbleSeeds[index];
      const y = ((bubble.y - time * bubble.speed - progress * 0.17) % 1 + 1) % 1;
      const avoid = Math.max(0, 1 - Math.abs(y - pointerY) * 7);
      const x = bubble.x * width + (bubble.x > pointerX ? 1 : -1) * avoid * 10 + Math.sin(time + bubble.phase) * 2;
      this.particles.circle(Math.round(x), Math.round(y * height), bubble.size).stroke({ width: 1.2, color: 0x89f0d7, alpha: 0.35 + (index % 4) * 0.08 });
      if (index % 9 === 0) this.particles.rect(Math.round(x + 8), Math.round(y * height - 3), 2, 2).fill({ color: 0x89f0d7, alpha: 0.65 });
    }

    this.foreground.clear();
    for (let index = -1; index < Math.ceil(width / 75) + 2; index += 1) {
      const x = index * 75 - (progress * width * 0.45 % 75);
      drawKelp(this.foreground, x, height + 8, 100 + (index % 4) * 35, Math.sin(time + index) * 18, index % 3 ? 0x032b3c : 0x063c46, 13);
    }
    this.foreground.rect(0, bedY + 26, width, height - bedY).fill({ color: 0x010918, alpha: 0.44 });
  }

  destroy() { this.container.destroy({ children: true }); }
}
