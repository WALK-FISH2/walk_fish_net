import { Container, Graphics } from "pixi.js";
import type { PixelScene, SceneFrame } from "./types";

const starSeeds = Array.from({ length: 180 }, (_, index) => ({
  x: ((index * 67) % 181) / 180,
  y: ((index * 97) % 173) / 172,
  size: index % 19 === 0 ? 3 : index % 7 === 0 ? 2 : 1,
  phase: (index * 0.37) % Math.PI,
}));

export class SpaceScene implements PixelScene {
  container = new Container();
  private voidLayer = new Graphics();
  private stars = new Graphics();
  private islands = new Graphics();

  constructor() {
    this.container.addChild(this.voidLayer, this.stars, this.islands);
  }

  update({ width, height, progress, time, particleScale }: SceneFrame) {
    this.voidLayer
      .clear()
      .rect(0, 0, width, height)
      .fill(0x050411)
      .circle(width * 0.78, height * 0.25, Math.max(width, height) * 0.28)
      .fill({ color: 0x5b4cb5, alpha: 0.14 })
      .circle(width * 0.25, height * 0.68, Math.max(width, height) * 0.22)
      .fill({ color: 0xc16de0, alpha: 0.09 });

    this.stars.clear();
    const activeStars = Math.round(starSeeds.length * particleScale);
    for (let index = 0; index < activeStars; index += 1) {
      const star = starSeeds[index];
      const drift = (progress * (index % 4) * 14) % height;
      const alpha = 0.38 + (Math.sin(time * 1.6 + star.phase) + 1) * 0.25;
      this.stars
        .rect(
          Math.round(star.x * width),
          Math.round((star.y * height + drift) % height),
          star.size,
          star.size,
        )
        .fill({ color: 0xfff3c4, alpha });
    }

    const orbit = time * 0.06 + progress * 0.5;
    const islandX = width * 0.72 + Math.cos(orbit) * 22;
    const islandY = height * 0.58 + Math.sin(orbit) * 12;
    this.islands
      .clear()
      .rect(islandX - 42, islandY, 84, 18)
      .fill(0x5e8cff)
      .rect(islandX - 28, islandY + 18, 56, 12)
      .fill(0x181443)
      .rect(islandX - 14, islandY + 30, 28, 9)
      .fill(0x181443)
      .rect(islandX - 22, islandY - 20, 8, 20)
      .fill(0xaaa8cc)
      .rect(islandX - 30, islandY - 28, 24, 8)
      .fill(0xfff3c4);

    const meteorX = ((time * 52 + progress * width * 0.4) % (width + 160)) - 80;
    this.islands
      .moveTo(meteorX, height * 0.22)
      .lineTo(meteorX - 46, height * 0.22 - 34)
      .stroke({ width: 2, color: 0x89f0d7, alpha: 0.7 })
      .rect(meteorX, height * 0.22, 5, 5)
      .fill(0xfff3c4);
  }

  destroy() {
    this.container.destroy({ children: true });
  }
}
