import { Container, Graphics } from "pixi.js";
import { STORY_CONFIG, clamp, getDiveState, getUnderwaterState, mixColor } from "../../config/story.config";

const bubblePool = Array.from({ length: 34 }, (_, index) => ({
  x: ((index * 61) % 97) / 96,
  y: ((index * 37) % 89) / 88,
  size: 2 + index % 5,
  speed: 0.025 + index % 5 * 0.008,
}));

function drawWave(graphics: Graphics, width: number, waterY: number, time: number, amplitude: number, offset: number, color: number, alpha: number, widthPx: number) {
  graphics.moveTo(-30, waterY + offset);
  for (let x = -30; x <= width + 30; x += 12) {
    const y = waterY + offset + Math.sin(x * 0.028 + time * 2.7) * amplitude + Math.sin(x * 0.074 - time * 0.9) * amplitude * 0.28;
    graphics.lineTo(x, Math.round(y));
  }
  graphics.stroke({ width: widthPx, color, alpha });
}

export class DiveTransition {
  container = new Container();
  private water = new Graphics();
  private surface = new Graphics();
  private bubbles = new Graphics();

  constructor() { this.container.addChild(this.water, this.surface, this.bubbles); }

  update(width: number, height: number, globalProgress: number, time: number, particleScale: number, reducedMotion: boolean) {
    const dive = getDiveState(globalProgress);
    const underwater = getUnderwaterState(globalProgress);
    const active = dive.surfaceOpacity > 0.001 || (globalProgress >= STORY_CONFIG.dive.timeline.surfaceReveal[0] && globalProgress < STORY_CONFIG.dive.timeline.surfaceRetreat[1]);
    this.container.visible = active;
    if (!active) return;

    const waterY = dive.surfaceY * height;
    const submerged = clamp(1 - dive.surfaceY);
    const animationTime = reducedMotion ? 0 : time;
    const motionScale = reducedMotion ? 0.38 : 1;
    const surfaceAlpha = dive.surfaceOpacity;
    const deepColor = mixColor(0x0b5275, 0x061e3d, underwater.shallow * 0.7);

    this.water.clear();
    if (waterY < height) {
      this.water.rect(0, Math.max(-24, waterY), width, height - waterY + 24).fill({ color: deepColor, alpha: 0.62 + submerged * 0.2 })
        .rect(0, waterY + height * 0.25, width, height).fill({ color: 0x092e55, alpha: 0.28 + submerged * 0.25 })
        .rect(0, waterY, width, Math.min(72, height * 0.09)).fill({ color: 0x73d7ff, alpha: 0.045 * surfaceAlpha });
    }

    this.surface.clear();
    const amplitude = (5 + submerged * 7) * motionScale;
    drawWave(this.surface, width, waterY, animationTime * (1 + submerged * 0.7), amplitude * 0.55, -8, 0x73d7ff, 0.28 * surfaceAlpha, 2);
    drawWave(this.surface, width, waterY, animationTime * (1 + submerged * 0.8), amplitude, 0, 0x89f0d7, 0.82 * surfaceAlpha, 5);
    drawWave(this.surface, width, waterY, animationTime * (1 + submerged), amplitude * 0.7, 9, 0xe5faff, 0.36 * surfaceAlpha, 3);
    for (let x = -24; x < width + 36; x += 48) {
      const offset = Math.sin(x * 0.05 + animationTime * 1.4) * amplitude;
      this.surface.rect(x, Math.round(waterY - 5 + offset), 18 + (Math.abs(x / 48) % 3) * 4, 3).fill({ color: 0xe5faff, alpha: 0.48 * surfaceAlpha });
      if (dive.refraction > 0.02) this.surface.rect(x + 8, Math.round(waterY + 17 - offset * 0.35), 13, 3).fill({ color: 0x73d7ff, alpha: 0.28 * dive.refraction });
    }

    this.bubbles.clear();
    const count = Math.round(bubblePool.length * particleScale * clamp((submerged - 0.42) * 2.1));
    for (let index = 0; index < count; index += 1) {
      const bubble = bubblePool[index];
      const y = ((bubble.y - animationTime * bubble.speed - dive.overall * 0.2) % 1 + 1) % 1;
      const px = bubble.x * width + Math.sin(animationTime + index * 0.7) * 3 * motionScale;
      const py = waterY + y * Math.max(0, height - waterY);
      this.bubbles.circle(px, py, bubble.size).stroke({ width: 1, color: 0xe5faff, alpha: 0.5 });
    }
  }

  destroy() { this.container.destroy({ children: true }); }
}
