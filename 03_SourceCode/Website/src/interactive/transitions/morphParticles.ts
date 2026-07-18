import { STORY_CONFIG } from "../../config/story.config";

export type MorphParticle = {
  readonly id: number;
  readonly seed: number;
  readonly oceanX: number;
  readonly oceanY: number;
  readonly oceanRadius: number;
  readonly oceanSpeed: number;
  readonly oceanDrift: number;
  readonly streamIndex: number;
  readonly streamOffset: number;
  readonly revealAt: number;
  readonly starX: number;
  readonly starY: number;
  readonly starRadius: number;
  readonly starBrightness: number;
  readonly meteorDirectionX: number;
  readonly meteorDirectionY: number;
  readonly meteorLength: number;
  readonly meteorRank: number;
  readonly phase: number;
  readonly depthLayer: number;
};

function createSeededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ result >>> 15, result | 1);
    result ^= result + Math.imul(result ^ result >>> 7, result | 61);
    return ((result ^ result >>> 14) >>> 0) / 4294967296;
  };
}

function wrap(value: number) {
  return ((value % 1) + 1) % 1;
}

const random = createSeededRandom(0x50495845);
const config = STORY_CONFIG.oceanToSpace.particles;

export const MORPH_PARTICLES: readonly MorphParticle[] = Array.from({ length: config.maxCount }, (_, id) => {
  const seed = Math.floor(random() * 0xffffffff);
  const oceanX = 0.03 + random() * 0.94;
  const oceanY = random();
  const oceanSpeed = 0.16 + random() * 0.22;
  const streamIndex = id % config.streamCount.desktop;
  const streamOffset = (random() - 0.5) * 0.13;
  const oceanAtMorph = wrap(oceanY - (STORY_CONFIG.oceanToSpace.timeline.bubbleToStar[0] - STORY_CONFIG.sections.underwater[0]) * oceanSpeed * 2.4);
  const streamCenters = [0.22, 0.5, 0.78] as const;
  const streamX = streamCenters[streamIndex] + streamOffset;
  const starX = Math.min(0.97, Math.max(0.03, streamX + (random() - 0.5) * 0.12));
  const starY = wrap(oceanAtMorph - 0.04 - random() * 0.12);
  const directionX = 0.82 + random() * 0.16;
  const directionY = 0.32 + random() * 0.16;

  return {
    id,
    seed,
    oceanX,
    oceanY,
    oceanRadius: 1.7 + random() * 4.8,
    oceanSpeed,
    oceanDrift: 0.006 + random() * 0.018,
    streamIndex,
    streamOffset,
    revealAt: random(),
    starX,
    starY,
    starRadius: 1 + Math.floor(random() * 2.4),
    starBrightness: 0.58 + random() * 0.4,
    meteorDirectionX: directionX,
    meteorDirectionY: directionY,
    meteorLength: 0.72 + random() * 0.28,
    meteorRank: ((id * 47) % config.maxCount + 0.5) / config.maxCount,
    phase: random() * Math.PI * 2,
    depthLayer: id % 3,
  };
});
