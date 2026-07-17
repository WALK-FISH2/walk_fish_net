export const STORY_CONFIG = {
  scrollHeightVh: 900,
  sections: {
    overworld: [0, 0.3],
    dive: [0.3, 0.38],
    underwater: [0.38, 0.66],
    oceanToSpace: [0.66, 0.8],
    space: [0.8, 1],
  },
  quality: {
    high: { particles: 150, dpr: 2 },
    medium: { particles: 90, dpr: 1.5 },
    low: { particles: 45, dpr: 1 },
  },
} as const;

export type QualityLevel = keyof typeof STORY_CONFIG.quality;

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function mapProgress(
  progress: number,
  range: readonly [number, number],
) {
  return clamp((progress - range[0]) / (range[1] - range[0]));
}

export function smoothstep(value: number) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}
