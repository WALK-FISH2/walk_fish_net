import { Container, Graphics } from "pixi.js";
import { clamp } from "../../config/story.config";

const bubbleSeeds = Array.from({ length: 34 }, (_, index) => ({ x: ((index * 61) % 97) / 96, y: ((index * 37) % 89) / 88, size: 2 + index % 5 }));

export class DiveTransition {
  container = new Container();
  private water = new Graphics();
  private surface = new Graphics();
  private bubbles = new Graphics();

  constructor() { this.container.addChild(this.water, this.surface, this.bubbles); }

  update(width: number, height: number, dive: number, depth: number, time: number, particleScale: number) {
    const active = dive > 0.001 || depth < 0.13;
    this.container.visible = active;
    if (!active) return;
    const submerged = clamp(dive);
    const retreat = dive >= 0.999 ? clamp(depth / 0.13) : 0;
    const waterY = dive < 0.999 ? height * (1 - submerged) : -retreat * height * 0.16;
    this.water.clear();
    if (waterY < height) {
      this.water.rect(0, waterY, width, height - waterY + 20).fill({ color: 0x0b5275, alpha: 0.62 + submerged * 0.2 })
        .rect(0, waterY + height * 0.25, width, height).fill({ color: 0x092e55, alpha: 0.28 + submerged * 0.25 });
    }

    this.surface.clear();
    const amplitude = 5 + submerged * 7;
    this.surface.moveTo(-30, waterY);
    for (let x = -30; x <= width + 30; x += 12) {
      const y = waterY + Math.sin(x * 0.028 + time * (1.2 + submerged * 2.2)) * amplitude + Math.sin(x * 0.074 - time * 0.9) * 3;
      this.surface.lineTo(x, Math.round(y));
      if (x % 48 === 0) this.surface.rect(x, y - 3, 16 + (x % 3) * 4, 3).fill({ color: 0xe5faff, alpha: 0.45 });
    }
    this.surface.stroke({ width: 5, color: 0x89f0d7, alpha: 0.78 })
      .rect(0, waterY + 10, width, 3).fill({ color: 0x73d7ff, alpha: 0.34 });

    this.bubbles.clear();
    const count = Math.round(bubbleSeeds.length * particleScale * clamp((submerged - 0.45) * 2));
    for (let index = 0; index < count; index += 1) {
      const seed = bubbleSeeds[index];
      const y = ((seed.y - time * (0.025 + index % 5 * 0.008) - submerged * 0.2) % 1 + 1) % 1;
      const px = seed.x * width;
      const py = waterY + y * Math.max(0, height - waterY);
      this.bubbles.circle(px, py, seed.size).stroke({ width: 1, color: 0xe5faff, alpha: 0.5 });
    }
  }

  destroy() { this.container.destroy({ children: true }); }
}
