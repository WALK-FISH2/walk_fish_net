import { Container, Graphics } from "pixi.js";
import type { PixelScene, SceneFrame } from "./types";

const bubbleSeeds = Array.from({ length: 54 }, (_, index) => ({
  x: ((index * 47) % 101) / 100,
  y: ((index * 71) % 97) / 96,
  size: 2 + (index % 5) * 1.4,
  speed: 0.04 + (index % 7) * 0.008,
}));

export class UnderwaterScene implements PixelScene {
  container = new Container();
  private water = new Graphics();
  private life = new Graphics();
  private foreground = new Graphics();

  constructor() {
    this.container.addChild(this.water, this.life, this.foreground);
  }

  update({ width, height, progress, time, pointerX, pointerY, particleScale }: SceneFrame) {
    this.water
      .clear()
      .rect(0, 0, width, height)
      .fill(0x0b5275)
      .rect(0, height * 0.35, width, height * 0.65)
      .fill(0x092e55)
      .rect(0, height * 0.72, width, height * 0.28)
      .fill(0x04162f)
      .moveTo(width * 0.06, 0)
      .lineTo(width * 0.28, 0)
      .lineTo(width * 0.5, height * 0.78)
      .lineTo(width * 0.34, height * 0.78)
      .fill({ color: 0x89f0d7, alpha: 0.08 })
      .moveTo(width * 0.5, 0)
      .lineTo(width * 0.64, 0)
      .lineTo(width * 0.74, height * 0.68)
      .lineTo(width * 0.6, height * 0.68)
      .fill({ color: 0x89f0d7, alpha: 0.05 });

    this.life.clear();
    const activeBubbles = Math.round(bubbleSeeds.length * particleScale);
    for (let index = 0; index < activeBubbles; index += 1) {
      const bubble = bubbleSeeds[index];
      const y = ((bubble.y - time * bubble.speed - progress * 0.24) % 1 + 1) % 1;
      const x = bubble.x * width + (pointerX - 0.5) * 10 * (bubble.size / 8);
      this.life
        .circle(Math.round(x), Math.round(y * height), bubble.size)
        .stroke({ width: 1.4, color: 0x89f0d7, alpha: 0.52 });
    }

    for (let index = 0; index < 8; index += 1) {
      const direction = index % 2 === 0 ? 1 : -1;
      const x = ((index * 173 + time * 20 * direction + progress * 180) % (width + 120)) - 60;
      const y = height * (0.28 + (index % 5) * 0.085) + Math.sin(time + index) * 8;
      this.life
        .moveTo(x - 18 * direction, y)
        .lineTo(x, y - 7)
        .lineTo(x + 16 * direction, y)
        .lineTo(x, y + 7)
        .fill({ color: 0x89b9cb, alpha: 0.45 })
        .moveTo(x - 18 * direction, y)
        .lineTo(x - 27 * direction, y - 8)
        .lineTo(x - 27 * direction, y + 8)
        .fill({ color: 0x89b9cb, alpha: 0.32 });
    }

    this.foreground.clear();
    const sway = Math.sin(time * 1.4 + progress * 4) * 12 + (pointerY - 0.5) * 5;
    for (let index = 0; index < 13; index += 1) {
      const x = (index / 12) * width;
      const heightScale = 44 + (index % 4) * 18;
      this.foreground
        .moveTo(x - 10, height)
        .lineTo(x + sway, height - heightScale)
        .lineTo(x + 10, height)
        .fill(index % 3 === 0 ? 0xff806e : 0x0a6b6d);
    }
    this.foreground
      .rect(0, height - 24, width, 24)
      .fill(0x031024);
  }

  destroy() {
    this.container.destroy({ children: true });
  }
}
