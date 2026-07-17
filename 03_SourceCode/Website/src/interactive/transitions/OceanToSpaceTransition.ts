import { Container, Graphics } from "pixi.js";
import { clamp, smoothstep } from "../../config/story.config";
import { drawPixelStar } from "../pixel/draw";

const foamSeeds = Array.from({ length: 64 }, (_, index) => ({
  waveX: ((index * 47) % 101) / 100,
  waveY: ((index * 73) % 37) / 36,
  starX: ((index * 89) % 103) / 102,
  starY: ((index * 59) % 97) / 96,
  size: 2 + index % 4,
  phase: index * 0.41,
}));

export class OceanToSpaceTransition {
  container = new Container();
  private waves = new Graphics();
  private foam = new Graphics();
  private galaxy = new Graphics();
  constructor() { this.container.addChild(this.galaxy, this.waves, this.foam); }

  update(width: number, height: number, progress: number, time: number, particleScale: number, reducedMotion: boolean) {
    const p = clamp(progress);
    this.container.visible = p > 0.001 && p < 0.999;
    if (!this.container.visible) return;
    const waveIn = smoothstep(clamp((p - 0.12) / 0.35));
    const waveOut = 1 - smoothstep(clamp((p - 0.68) / 0.3));
    const waveAlpha = waveIn * waveOut;
    const centerY = height * (0.88 - p * 0.73);

    this.waves.clear();
    if (!reducedMotion) {
      const layerConfig = [
        { offset: 34, amplitude: 25, color: 0x0b5275, alpha: 0.48, step: 20, speed: 7 },
        { offset: 15, amplitude: 38, color: 0x25bec4, alpha: 0.6, step: 16, speed: 10 },
        { offset: -8, amplitude: 53, color: 0xe5faff, alpha: 0.7, step: 12, speed: 14 },
      ];
      layerConfig.forEach((layer, layerIndex) => {
        const base = centerY + layer.offset;
        this.waves.moveTo(-80, base);
        for (let x = -80; x <= width + 90; x += layer.step) {
          const harmonic = Math.sin(x * 0.018 + p * layer.speed + time * 0.18) + Math.sin(x * 0.043 - p * (layer.speed * 0.7) + layerIndex - time * 0.12) * 0.42 + Math.sin(x * 0.091 + layerIndex * 2) * 0.16;
          this.waves.lineTo(x, Math.round(base + harmonic * layer.amplitude * waveAlpha));
        }
        this.waves.lineTo(width + 90, base + 110).lineTo(-80, base + 110).fill({ color: layer.color, alpha: layer.alpha * waveAlpha });
      });
    } else {
      const wipeY = height * (1 - p);
      this.waves.rect(0, wipeY, width, 12).fill({ color: 0xc16de0, alpha: 0.65 }).rect(0, wipeY + 12, width, height).fill({ color: 0x181443, alpha: 0.36 });
    }

    this.foam.clear();
    const morph = smoothstep(clamp((p - 0.6) / 0.36));
    const count = Math.round(foamSeeds.length * particleScale);
    for (let index = 0; index < count; index += 1) {
      const seed = foamSeeds[index];
      const waveX = seed.waveX * width;
      const waveY = centerY + (seed.waveY - 0.5) * 115 * waveAlpha + Math.sin(seed.phase + p * 16) * 10;
      const starX = seed.starX * width;
      const starY = seed.starY * height;
      const x = waveX + (starX - waveX) * morph;
      const y = waveY + (starY - waveY) * morph;
      if (morph < 0.58) this.foam.rect(Math.round(x), Math.round(y), seed.size * 2, seed.size).fill({ color: 0xe5faff, alpha: waveAlpha * 0.8 });
      else drawPixelStar(this.foam, Math.round(x), Math.round(y), Math.max(1, seed.size - 1), 0xfff3c4, 0.45 + morph * 0.5);
    }

    this.galaxy.clear();
    const galaxyAlpha = smoothstep(clamp((p - 0.7) / 0.28));
    if (galaxyAlpha > 0) {
      this.galaxy.moveTo(-width * 0.15, height * 0.85).lineTo(width * 0.95, height * 0.08).stroke({ width: 34, color: 0x5e8cff, alpha: 0.08 * galaxyAlpha })
        .moveTo(-width * 0.1, height * 0.82).lineTo(width, height * 0.05).stroke({ width: 5, color: 0xfff3c4, alpha: 0.16 * galaxyAlpha });
    }
  }

  destroy() { this.container.destroy({ children: true }); }
}
