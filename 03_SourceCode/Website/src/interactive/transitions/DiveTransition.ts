import { Container, Graphics, TilingSprite, type Texture } from "pixi.js";
import { STORY_CONFIG, clamp, getDiveState, getUnderwaterState, lerp, mixColor } from "../../config/story.config";
import { loadM55WaveTextures } from "./m55WaveAssets";

type WaveLayerConfig = {
  readonly amplitude: number;
  readonly wavelength: number;
  readonly phase: number;
  readonly speed: number;
  readonly alpha: number;
  readonly color: number;
  readonly highlight: number;
  readonly pixelStep: number;
  readonly pixelBlock: number;
  readonly verticalOffset: number;
  readonly crestBlocks: number;
  readonly foamWeight: number;
};

type FoamParticle = {
  readonly id: number;
  readonly x: number;
  readonly band: number;
  readonly size: number;
  readonly drift: number;
  readonly opacity: number;
  readonly layer: 0 | 1 | 2;
  readonly phase: number;
};

type TilingMotionConfig = {
  readonly heightRatio: { readonly desktop: number; readonly mobile: number };
  readonly anchorY: number;
  readonly driftPxPerSecond: number;
  readonly phase: number;
  readonly alpha: number;
  readonly bobPx?: number;
  readonly bobSpeed?: number;
};

const bubblePool = Array.from({ length: 34 }, (_, index) => ({
  x: ((index * 61) % 97) / 96,
  y: ((index * 37) % 89) / 88,
  size: 2 + index % 5,
  speed: 0.025 + index % 5 * 0.008,
}));

const foamPool: readonly FoamParticle[] = Array.from({ length: STORY_CONFIG.dive.foam.desktopCount }, (_, index) => ({
  id: index,
  x: ((index * 47) % 101) / 100,
  band: ((index * 73) % 43) / 42,
  size: 3 + index % 5,
  drift: 0.35 + index % 7 * 0.11,
  opacity: 0.54 + index % 5 * 0.09,
  layer: (index % 3) as 0 | 1 | 2,
  phase: index * 0.61,
}));

function pixelNoise(index: number, phase: number) {
  return ((((index * 37 + Math.round(phase * 100)) % 17) + 17) % 17 - 8) / 8;
}

function waveYAt(x: number, baseY: number, time: number, height: number, config: WaveLayerConfig, detailScale: number) {
  const angle = x / config.wavelength * Math.PI * 2 + config.phase + time * config.speed;
  const primary = Math.sin(angle);
  const curl = Math.sin(angle * 2.18 - config.phase * 0.7 - time * config.speed * 0.42) * 0.28;
  const irregular = pixelNoise(Math.floor(x / config.pixelStep), config.phase) * 0.11;
  const amplitude = config.amplitude * Math.min(height, 900) * detailScale;
  return Math.round((baseY + (primary + curl + irregular) * amplitude) / config.pixelBlock) * config.pixelBlock;
}

function drawPixelWaveLayer(graphics: Graphics, width: number, height: number, baseY: number, time: number, presence: number, config: WaveLayerConfig, detailScale: number) {
  if (presence <= 0.001) return;
  const startX = -config.pixelStep * 3;
  const endX = width + config.pixelStep * 3;
  const firstY = waveYAt(startX, baseY, time, height, config, detailScale);
  graphics.moveTo(startX, height + 40).lineTo(startX, firstY);
  for (let x = startX + config.pixelStep; x <= endX; x += config.pixelStep) {
    graphics.lineTo(x, waveYAt(x, baseY, time, height, config, detailScale));
  }
  graphics.lineTo(endX, height + 40).closePath().fill({ color: config.color, alpha: config.alpha * presence * 0.42 });

  graphics.moveTo(startX, firstY);
  for (let x = startX + config.pixelStep; x <= endX; x += config.pixelStep) {
    graphics.lineTo(x, waveYAt(x, baseY, time, height, config, detailScale));
  }
  graphics.stroke({ width: config.pixelBlock, color: config.highlight, alpha: config.alpha * presence });

  const crestSpacing = config.wavelength * 1.08;
  const crestTravel = (time * config.speed * config.wavelength * 0.22) % crestSpacing;
  for (let crestX = -crestSpacing + crestTravel; crestX < width + crestSpacing; crestX += crestSpacing) {
    const crestY = waveYAt(crestX, baseY, time, height, config, detailScale);
    for (let block = 0; block < config.crestBlocks; block += 1) {
      const blockSize = config.pixelBlock + block * 2;
      graphics.rect(
        Math.round(crestX + block * config.pixelBlock * 0.8),
        Math.round(crestY - config.pixelBlock * (1.4 + block * 0.45)),
        blockSize * 1.8,
        config.pixelBlock,
      ).fill({ color: config.highlight, alpha: config.alpha * presence * (0.72 - block * 0.12) });
    }
  }
}

function drawReducedWaveCurtain(graphics: Graphics, width: number, height: number, waterY: number, alpha: number) {
  if (alpha <= 0.001 || waterY >= height + 18) return;
  const block = width < 768 ? 10 : 14;
  graphics.moveTo(0, height + block).lineTo(0, waterY);
  for (let x = 0; x <= width + block; x += block) {
    const stepY = waterY + ((Math.floor(x / block) % 4) - 1) * 2;
    graphics.lineTo(x, Math.round(stepY / 2) * 2);
  }
  graphics.lineTo(width + block, height + block).closePath().fill({ color: 0x25bec4, alpha: 0.5 * alpha });
  graphics.moveTo(0, waterY);
  for (let x = 0; x <= width + block; x += block) {
    const stepY = waterY + ((Math.floor(x / block) % 4) - 1) * 2;
    graphics.lineTo(x, Math.round(stepY / 2) * 2);
  }
  graphics.stroke({ width: 5, color: 0xe8ffff, alpha: 0.76 * alpha });
}

function createTilingSprite(texture: Texture) {
  return new TilingSprite({ texture, width: 1, height: 1, roundPixels: true });
}

function updateTilingSprite(
  sprite: TilingSprite,
  width: number,
  height: number,
  baseY: number,
  presence: number,
  time: number,
  mobile: boolean,
  config: TilingMotionConfig,
) {
  const overscan = STORY_CONFIG.m55.waveSprites.overscanPx;
  const displayHeight = Math.max(24, height * (mobile ? config.heightRatio.mobile : config.heightRatio.desktop));
  const textureScale = displayHeight / Math.max(1, sprite.texture.height);
  const bob = Math.sin(time * (config.bobSpeed ?? 0) + config.phase * Math.PI * 2) * (config.bobPx ?? 0);
  sprite.setSize(width + overscan * 2, displayHeight);
  sprite.position.set(-overscan, Math.round(baseY - displayHeight * config.anchorY + bob));
  sprite.tileScale.set(textureScale);
  sprite.tilePosition.set(
    Math.round(config.phase * sprite.texture.width * textureScale + time * config.driftPxPerSecond),
    0,
  );
  sprite.alpha = clamp(presence) * config.alpha;
  sprite.visible = sprite.alpha > 0.001;
}

export class DiveTransition {
  container = new Container();
  private water = new Graphics();
  private farWave = new Graphics();
  private farWaveSprites = new Container();
  private midWave = new Graphics();
  private midWaveSprites = new Container();
  private foregroundWave = new Graphics();
  private foregroundWaveSprites = new Container();
  private bubbleClusterSprites = new Container();
  private foamBandSprites = new Container();
  private mist = new Graphics();
  private foam = new Graphics();
  private bubbles = new Graphics();
  private spriteSet?: {
    far: TilingSprite;
    mid: TilingSprite;
    foreground: TilingSprite;
    foamFront: TilingSprite;
    foamMid: TilingSprite;
    bubbleClusters: TilingSprite;
  };
  private destroyed = false;

  constructor() {
    this.container.addChild(
      this.water,
      this.farWave,
      this.farWaveSprites,
      this.midWave,
      this.midWaveSprites,
      this.bubbleClusterSprites,
      this.foregroundWave,
      this.foregroundWaveSprites,
      this.foamBandSprites,
      this.mist,
      this.foam,
      this.bubbles,
    );
  }

  async loadAssets() {
    try {
      const textures = await loadM55WaveTextures();
      if (this.destroyed) return;
      const far = createTilingSprite(textures.waveBack);
      const mid = createTilingSprite(textures.waveMid);
      const foreground = createTilingSprite(textures.waveFront);
      const foamFront = createTilingSprite(textures.foamBandFront);
      const foamMid = createTilingSprite(textures.foamBandMid);
      const bubbleClusters = createTilingSprite(textures.bubbleClusters);
      this.farWaveSprites.addChild(far);
      this.midWaveSprites.addChild(mid);
      this.foregroundWaveSprites.addChild(foreground);
      this.foamBandSprites.addChild(foamMid, foamFront);
      this.bubbleClusterSprites.addChild(bubbleClusters);
      this.spriteSet = { far, mid, foreground, foamFront, foamMid, bubbleClusters };
    } catch {
      // The deterministic Graphics baseline remains as the visual fallback if
      // an authored sprite cannot be decoded on a particular device.
      this.spriteSet = undefined;
    }
  }

  update(width: number, height: number, globalProgress: number, time: number, particleScale: number, reducedMotion: boolean) {
    const dive = getDiveState(globalProgress);
    const transition = dive.transition;
    const underwater = getUnderwaterState(globalProgress);
    const timeline = STORY_CONFIG.dive.timeline;
    const active = dive.surfaceOpacity > 0.001 || (globalProgress >= timeline.farWave[0] && globalProgress < timeline.surfaceRetreat[1]);
    this.container.visible = active;
    if (!active) return;

    const waterY = dive.surfaceY * height;
    const submerged = clamp(1 - dive.surfaceY);
    const animationTime = reducedMotion ? 0 : time;
    const surfaceAlpha = dive.surfaceOpacity;
    const deepColor = mixColor(0x0b5275, 0x061e3d, underwater.shallow * 0.7);
    const isMobile = width < 768;
    const detailScale = isMobile ? 0.72 : 1;

    this.water.clear();
    if (waterY < height) {
      this.water.rect(0, Math.max(-24, waterY), width, height - waterY + 24).fill({ color: deepColor, alpha: 0.62 + submerged * 0.2 })
        .rect(0, waterY + height * 0.25, width, height).fill({ color: 0x092e55, alpha: 0.28 + submerged * 0.25 })
        .rect(0, waterY, width, Math.min(72, height * 0.09)).fill({ color: 0x73d7ff, alpha: 0.045 * surfaceAlpha });
    }

    this.farWave.clear();
    this.midWave.clear();
    this.foregroundWave.clear();
    this.mist.clear();
    this.foam.clear();
    this.bubbles.clear();

    if (reducedMotion) {
      this.farWaveSprites.visible = false;
      this.midWaveSprites.visible = false;
      this.foregroundWaveSprites.visible = false;
      this.foamBandSprites.visible = false;
      this.bubbleClusterSprites.visible = false;
      drawReducedWaveCurtain(this.midWave, width, height, waterY, surfaceAlpha);
      return;
    }

    this.farWaveSprites.visible = true;
    this.midWaveSprites.visible = true;
    this.foregroundWaveSprites.visible = true;
    this.foamBandSprites.visible = true;
    this.bubbleClusterSprites.visible = true;

    const waves = STORY_CONFIG.dive.waves;
    const settleFade = 1 - transition.underwaterSettle;
    const farPresence = transition.farWave * (1 - transition.surfaceRetreat) * (0.56 + settleFade * 0.44);
    const midEntrance = globalProgress >= timeline.waveApproach[0] ? 0.16 + transition.waveApproach * 0.84 : 0;
    const midPresence = midEntrance * (1 - transition.surfaceRetreat) * (0.42 + settleFade * 0.58);
    const frontPresence = Math.max(transition.waveBreak, transition.foamCover) * settleFade;
    const farBaseY = Math.min(waterY + height * waves.far.verticalOffset, height * STORY_CONFIG.dive.surface.farWaveVisible);
    const midBaseY = waterY + height * (waves.mid.verticalOffset + (1 - midEntrance) * 0.04);
    const frontBaseY = transition.frontWaveY * height;

    const spriteConfig = STORY_CONFIG.m55.waveSprites;
    if (this.spriteSet) {
      this.farWave.rect(0, farBaseY, width, Math.max(0, height - farBaseY + 24))
        .fill({ color: waves.far.color, alpha: waves.far.alpha * farPresence * 0.15 });
      this.midWave.rect(0, midBaseY, width, Math.max(0, height - midBaseY + 24))
        .fill({ color: waves.mid.color, alpha: waves.mid.alpha * midPresence * 0.2 });
      this.foregroundWave.rect(0, frontBaseY, width, Math.max(0, height - frontBaseY + 24))
        .fill({ color: waves.foreground.color, alpha: waves.foreground.alpha * frontPresence * 0.24 });
      updateTilingSprite(this.spriteSet.far, width, height, farBaseY, farPresence, animationTime, isMobile, spriteConfig.back);
      updateTilingSprite(this.spriteSet.mid, width, height, midBaseY, midPresence, animationTime, isMobile, spriteConfig.mid);
      updateTilingSprite(this.spriteSet.foreground, width, height, frontBaseY, frontPresence, animationTime, isMobile, spriteConfig.foreground);
    } else {
      drawPixelWaveLayer(this.farWave, width, height, farBaseY, animationTime, farPresence, waves.far, detailScale);
      drawPixelWaveLayer(this.midWave, width, height, midBaseY, animationTime, midPresence, waves.mid, detailScale);
      drawPixelWaveLayer(this.foregroundWave, width, height, frontBaseY, animationTime, frontPresence, waves.foreground, detailScale);
    }

    const foamVisibility = Math.max(transition.waveBreak * 0.42, transition.seamCover) * settleFade;
    const foamQualityScale = isMobile ? STORY_CONFIG.dive.foam.mobileScale : 1;
    const supplementalFoamScale = this.spriteSet ? spriteConfig.supplementalFoamScale : 1;
    const foamCount = Math.round(foamPool.length * particleScale * foamQualityScale * supplementalFoamScale);
    const layerBases = [farBaseY, midBaseY, frontBaseY] as const;
    const layerConfigs = [waves.far, waves.mid, waves.foreground] as const;
    const coverCenterY = height * 0.48;
    for (let index = 0; index < foamCount; index += 1) {
      const particle = foamPool[index];
      const config = layerConfigs[particle.layer];
      const travel = animationTime * STORY_CONFIG.dive.foam.drift * particle.drift;
      const normalizedX = ((particle.x + travel) % 1 + 1) % 1;
      const x = normalizedX * width;
      const crestY = waveYAt(x, layerBases[particle.layer], animationTime + particle.phase * 0.03, height, config, detailScale);
      const coverY = coverCenterY + (particle.band - 0.5) * height * STORY_CONFIG.dive.foam.coverSpread;
      const seamMix = Math.sqrt(transition.seamCover) * (particle.layer === 2 ? 0.96 : 0.82);
      const y = crestY + (coverY - crestY) * seamMix + Math.sin(particle.phase + animationTime * particle.drift) * 4;
      const layerWeight = config.foamWeight;
      const alpha = foamVisibility * particle.opacity * (0.35 + layerWeight * 0.65);
      const size = Math.max(2, Math.round(particle.size * detailScale));
      const color = particle.id % 4 === 0 ? 0x89f0d7 : 0xe8ffff;
      this.foam.rect(Math.round(x), Math.round(y), size * 2, size).fill({ color, alpha });
      if (particle.id % 3 === 0) this.foam.rect(Math.round(x + size * 1.5), Math.round(y - size), size, size).fill({ color, alpha: alpha * 0.78 });
      if (particle.id % 7 === 0) this.foam.rect(Math.round(x - size), Math.round(y + size), size, Math.max(2, size - 1)).fill({ color: 0xb9f7f1, alpha: alpha * 0.62 });
      if (transition.seamCover > 0.08 && particle.id < 32) {
        const breakY = coverCenterY + (particle.band - 0.5) * height * STORY_CONFIG.dive.foam.coverSpread;
        this.foam.rect(Math.round(x - size * 2), Math.round(breakY), size * 6, Math.max(3, size))
          .fill({ color: 0xe8ffff, alpha: alpha * transition.seamCover * 0.9 });
        if (particle.id % 4 === 0) this.foam.rect(Math.round(x + size * 3), Math.round(breakY - size), size * 2, size)
          .fill({ color: 0xb9f7f1, alpha: alpha * transition.seamCover * 0.68 });
      }
    }

    if (this.spriteSet) {
      const seamMix = Math.sqrt(transition.seamCover);
      const frontFoamY = lerp(frontBaseY, coverCenterY, seamMix);
      const midFoamY = lerp(midBaseY, coverCenterY, seamMix * 0.78);
      updateTilingSprite(this.spriteSet.foamFront, width, height, frontFoamY, foamVisibility, animationTime, isMobile, spriteConfig.foamFront);
      updateTilingSprite(this.spriteSet.foamMid, width, height, midFoamY, foamVisibility * (isMobile ? 0.72 : 1), animationTime, isMobile, spriteConfig.foamMid);
    }

    if (!isMobile && transition.seamCover > 0.01) {
      for (let index = 0; index < 9; index += 1) {
        const widthRatio = 0.12 + index % 4 * 0.045;
        const mistX = ((index * 0.173 + animationTime * 0.006 * (index % 2 === 0 ? 1 : -1)) % 1 + 1) % 1 * width;
        const mistY = coverCenterY + (index - 4) * height * 0.038;
        this.mist.rect(Math.round(mistX), Math.round(mistY), Math.round(width * widthRatio), 4 + index % 3 * 2)
          .fill({ color: index % 2 === 0 ? 0xe8ffff : 0x89f0d7, alpha: STORY_CONFIG.dive.foam.mistAlpha * transition.seamCover });
      }
    }

    const supplementalBubbleScale = this.spriteSet ? spriteConfig.supplementalBubbleScale : 1;
    const bubbleCount = Math.round(bubblePool.length * particleScale * supplementalBubbleScale * clamp((submerged - 0.42) * 2.1));
    for (let index = 0; index < bubbleCount; index += 1) {
      const bubble = bubblePool[index];
      const y = ((bubble.y - animationTime * bubble.speed - dive.overall * 0.2) % 1 + 1) % 1;
      const px = bubble.x * width + Math.sin(animationTime + index * 0.7) * 3;
      const py = waterY + y * Math.max(0, height - waterY);
      this.bubbles.circle(px, py, bubble.size).stroke({ width: 1, color: 0xe5faff, alpha: 0.5 });
    }

    if (this.spriteSet) {
      const clusterConfig = spriteConfig.bubbleClusters;
      const clusterPresence = clamp((submerged - 0.3) * 1.9) * (1 - transition.surfaceRetreat * 0.54);
      const displayHeight = Math.max(32, height * (isMobile ? clusterConfig.heightRatio.mobile : clusterConfig.heightRatio.desktop));
      const textureScale = displayHeight / Math.max(1, this.spriteSet.bubbleClusters.texture.height);
      const overscan = spriteConfig.overscanPx;
      const waterDepth = Math.max(0, height - Math.max(0, waterY));
      this.spriteSet.bubbleClusters.setSize(width + overscan * 2, Math.min(displayHeight, waterDepth));
      this.spriteSet.bubbleClusters.position.set(-overscan, Math.max(0, waterY) + Math.max(12, height * 0.05));
      this.spriteSet.bubbleClusters.tileScale.set(textureScale);
      this.spriteSet.bubbleClusters.tilePosition.set(
        Math.round(width * 0.07 - animationTime * clusterConfig.driftPxPerSecond),
        Math.round(-animationTime * clusterConfig.driftPxPerSecond),
      );
      this.spriteSet.bubbleClusters.alpha = clusterPresence * clusterConfig.alpha;
      this.spriteSet.bubbleClusters.visible = clusterPresence > 0.001 && waterDepth > 16;
    }
  }

  destroy() {
    this.destroyed = true;
    this.container.destroy({ children: true });
  }
}
