import { Container, Graphics } from "pixi.js";
import { STORY_CONFIG, clamp, getOceanSpaceMorphState, lerp, mixColor, smoothstep } from "../../config/story.config";
import { drawPixelStar } from "../pixel/draw";
import { MORPH_PARTICLES, type MorphParticle } from "./morphParticles";

const STREAM_CENTERS_DESKTOP = [0.22, 0.5, 0.78] as const;
const STREAM_CENTERS_MOBILE = [0.33, 0.67] as const;
const LIGHT_BANDS = [
  { start: 0.08, width: 0.095, phase: 0.2, color: 0x5e8cff },
  { start: 0.34, width: 0.075, phase: 1.7, color: 0x5b4cb5 },
  { start: 0.62, width: 0.11, phase: 3.1, color: 0xc16de0 },
] as const;

function wrap(value: number) {
  return ((value % 1) + 1) % 1;
}

function particleStreamX(particle: MorphParticle, mobile: boolean) {
  const centers = mobile ? STREAM_CENTERS_MOBILE : STREAM_CENTERS_DESKTOP;
  return centers[particle.streamIndex % centers.length] + particle.streamOffset * (mobile ? 0.72 : 1);
}

function particleStarX(particle: MorphParticle, mobile: boolean) {
  if (!mobile) return particle.starX;
  const desktopCenter = STREAM_CENTERS_DESKTOP[particle.streamIndex % STREAM_CENTERS_DESKTOP.length];
  return clamp(particleStreamX(particle, true) + (particle.starX - desktopCenter) * 0.62, 0.03, 0.97);
}

export class OceanToSpaceTransition {
  container = new Container();
  private colorWash = new Graphics();
  private galaxy = new Graphics();
  private streamGuides = new Graphics();
  private meteorTrails = new Graphics();
  private particles = new Graphics();

  constructor() {
    this.container.addChild(this.colorWash, this.galaxy, this.streamGuides, this.meteorTrails, this.particles);
  }

  update(width: number, height: number, globalProgress: number, time: number, particleScale: number, reducedMotion: boolean) {
    const state = getOceanSpaceMorphState(globalProgress);
    const config = STORY_CONFIG.oceanToSpace;
    const mobile = width < 768;
    const activeScale = particleScale * (mobile ? config.particles.mobileDensityScale : 1);
    const activeCount = Math.max(1, Math.round(MORPH_PARTICLES.length * activeScale));
    const densityProgress = Math.max(state.bubbleDensity, state.preheat * 0.18);
    const densityCeiling = reducedMotion
      ? config.particles.baseDensity + densityProgress * 0.16
      : lerp(config.particles.baseDensity, 1, densityProgress);
    const streamStrength = Math.max(state.bubbleDensity, state.preheat * 0.12) * (reducedMotion ? 0.35 : 1);
    const ambientWeight = reducedMotion ? 0 : 1 - state.deterministicLock;
    const meteorRatio = reducedMotion
      ? config.particles.meteorRatio.reducedMotion
      : mobile ? config.particles.meteorRatio.mobile : config.particles.meteorRatio.desktop;

    this.container.visible = globalProgress >= STORY_CONFIG.sections.underwater[0];
    if (!this.container.visible) return;

    this.drawColorWash(width, height, state.spaceBlend);
    this.drawGalaxy(width, height, state.nebula, state.settleSpace);
    this.drawStreamGuides(width, height, time, state.bubbleDensity, state.bubbleToStar, mobile, reducedMotion);

    this.meteorTrails.clear();
    this.particles.clear();
    for (let index = 0; index < activeCount; index += 1) {
      const particle = MORPH_PARTICLES[index];
      const reveal = smoothstep(clamp((densityCeiling - particle.revealAt) / 0.08));
      if (reveal <= 0.001) continue;

      const travelProgress = Math.max(0, globalProgress - STORY_CONFIG.sections.underwater[0]);
      const bubbleY = wrap(
        particle.oceanY
        - travelProgress * particle.oceanSpeed * 2.4
        - state.preheat * particle.oceanSpeed * STORY_CONFIG.underwater.preheat.bubbleSpeedBoost
        - time * particle.oceanSpeed * 0.17 * ambientWeight,
      );
      const ambientDrift = Math.sin(time * 0.72 + particle.phase) * particle.oceanDrift * ambientWeight;
      const progressDrift = Math.sin(particle.phase + globalProgress * 18) * particle.oceanDrift;
      const streamX = particleStreamX(particle, mobile);
      const bubbleX = lerp(particle.oceanX, streamX, streamStrength) + ambientDrift + progressDrift;
      const starX = particleStarX(particle, mobile);
      const morph = state.bubbleToStar;
      const xBeforeMeteor = lerp(bubbleX, starX, morph) * width;
      const yBeforeMeteor = lerp(bubbleY, particle.starY, morph) * height;

      const eligible = particle.meteorRank < meteorRatio;
      const meteorOrder = eligible && meteorRatio > 0 ? particle.meteorRank / meteorRatio : 1;
      const meteorProgress = eligible
        ? smoothstep(clamp((state.starToMeteor - meteorOrder * 0.28) / 0.72))
        : 0;
      const travel = (mobile ? config.particles.meteorTravel.mobile : config.particles.meteorTravel.desktop)
        * width * Math.pow(meteorProgress, 1.35);
      const x = xBeforeMeteor + particle.meteorDirectionX * travel;
      const y = yBeforeMeteor + particle.meteorDirectionY * travel;

      if (meteorProgress > 0.001) {
        this.drawMeteorTail(particle, x, y, meteorProgress, mobile, reveal);
      }
      this.drawParticle(particle, x, y, morph, state.brighten, meteorProgress, reveal, time, reducedMotion);
    }
  }

  private drawColorWash(width: number, height: number, spaceBlend: number) {
    this.colorWash.clear();
    if (spaceBlend <= 0) return;
    const colors = STORY_CONFIG.oceanToSpace.colors;
    const color = mixColor(colors.nightBlue, colors.indigo, spaceBlend);
    this.colorWash.rect(0, 0, width, height).fill({ color, alpha: 0.08 + spaceBlend * 0.1 });
  }

  private drawGalaxy(width: number, height: number, nebula: number, settleSpace: number) {
    this.galaxy.clear();
    if (nebula <= 0.001) return;

    for (let bandIndex = 0; bandIndex < LIGHT_BANDS.length; bandIndex += 1) {
      const band = LIGHT_BANDS[bandIndex];
      const oceanStartX = width * band.start;
      const oceanStartY = -height * 0.04;
      const oceanEndX = width * (band.start + band.width + 0.12);
      const oceanEndY = height * 0.86;
      const spaceStartX = -width * (0.18 - bandIndex * 0.035);
      const spaceStartY = height * (0.9 - bandIndex * 0.035);
      const spaceEndX = width * (0.93 + bandIndex * 0.04);
      const spaceEndY = height * (0.08 + bandIndex * 0.03);
      const startX = lerp(oceanStartX, spaceStartX, nebula);
      const startY = lerp(oceanStartY, spaceStartY, nebula);
      const endX = lerp(oceanEndX, spaceEndX, nebula);
      const endY = lerp(oceanEndY, spaceEndY, nebula);
      const blocks = 24;

      for (let step = 0; step <= blocks; step += 1) {
        const t = step / blocks;
        const wave = Math.sin(t * Math.PI * 4 + band.phase) * (3 + nebula * 8);
        const x = lerp(startX, endX, t) + wave;
        const y = lerp(startY, endY, t) - wave * 0.35;
        const blockWidth = 12 + bandIndex * 4 + settleSpace * (18 + bandIndex * 3);
        const blockHeight = 5 + bandIndex * 2 + settleSpace * 4;
        const alpha = nebula * (0.022 + bandIndex * 0.008 + settleSpace * 0.025);
        this.galaxy.rect(Math.round(x / 4) * 4, Math.round(y / 4) * 4, blockWidth, blockHeight)
          .fill({ color: band.color, alpha });
      }
    }
  }

  private drawStreamGuides(width: number, height: number, time: number, density: number, morph: number, mobile: boolean, reducedMotion: boolean) {
    this.streamGuides.clear();
    if (reducedMotion || density <= 0.01 || morph >= 0.9) return;
    const centers = mobile ? STREAM_CENTERS_MOBILE : STREAM_CENTERS_DESKTOP;
    const alpha = density * (1 - morph) * 0.1;
    for (let stream = 0; stream < centers.length; stream += 1) {
      for (let step = 0; step < 9; step += 1) {
        const y = wrap(step / 9 - time * 0.035 - stream * 0.13) * height;
        const x = centers[stream] * width + Math.sin(step * 1.7 + stream) * 9;
        this.streamGuides.rect(Math.round(x), Math.round(y), 3 + stream % 2, 18 + step % 3 * 6)
          .fill({ color: STORY_CONFIG.oceanToSpace.colors.bubble, alpha });
      }
    }
  }

  private drawMeteorTail(particle: MorphParticle, x: number, y: number, progress: number, mobile: boolean, alpha: number) {
    const config = STORY_CONFIG.oceanToSpace;
    const maximum = mobile ? config.particles.meteorTail.mobile : config.particles.meteorTail.desktop;
    const length = maximum * particle.meteorLength * progress;
    const steps = Math.max(1, Math.ceil(length / 7));
    for (let step = 1; step <= steps; step += 1) {
      const distance = Math.min(length, step * 7);
      const tailAlpha = alpha * progress * (1 - step / (steps + 1)) * 0.68;
      const block = step < 3 ? 4 : 3;
      this.meteorTrails.rect(
        Math.round(x - particle.meteorDirectionX * distance),
        Math.round(y - particle.meteorDirectionY * distance),
        block * 2,
        block,
      ).fill({ color: config.colors.star, alpha: tailAlpha });
    }
  }

  private drawParticle(particle: MorphParticle, x: number, y: number, morph: number, brighten: number, meteor: number, reveal: number, time: number, reducedMotion: boolean) {
    const colors = STORY_CONFIG.oceanToSpace.colors;
    const ringFade = 1 - smoothstep(clamp((morph - 0.18) / 0.7));
    const starReveal = smoothstep(clamp((morph - 0.22) / 0.72));
    const radius = lerp(particle.oceanRadius, particle.starRadius, morph);
    const ringColor = mixColor(colors.bubble, colors.bubbleHighlight, brighten);
    const ringAlpha = reveal * ringFade * (0.34 + brighten * 0.4);

    if (ringAlpha > 0.001) {
      this.particles.circle(Math.round(x), Math.round(y), Math.max(1, radius))
        .stroke({ width: lerp(1.25, 0.55, morph), color: ringColor, alpha: ringAlpha });
    }

    const highlightAlpha = reveal * (0.16 + brighten * 0.48) * (1 - morph * 0.35);
    if (morph < 0.92 && highlightAlpha > 0.001) {
      const highlightSize = Math.max(1, Math.round(lerp(1, particle.starRadius, brighten)));
      this.particles.rect(Math.round(x - radius * 0.3), Math.round(y - radius * 0.45), highlightSize, highlightSize)
        .fill({ color: colors.bubbleHighlight, alpha: highlightAlpha });
    }

    if (starReveal > 0.001) {
      const twinkle = reducedMotion ? 0 : (Math.sin(time * 0.7 + particle.phase) + 1) * 0.055;
      const starAlpha = reveal * starReveal * Math.min(1, particle.starBrightness + twinkle + meteor * 0.18);
      drawPixelStar(this.particles, Math.round(x), Math.round(y), particle.starRadius, colors.star, starAlpha);
    }
  }

  destroy() {
    this.container.destroy({ children: true });
  }
}
