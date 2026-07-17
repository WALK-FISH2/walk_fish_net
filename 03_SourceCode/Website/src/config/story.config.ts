export const STORY_CONFIG = {
  scrollHeightVh: 860,
  sections: {
    overworld: [0, 0.3],
    dive: [0.3, 0.38],
    underwater: [0.38, 0.66],
    oceanToSpace: [0.66, 0.8],
    space: [0.8, 1],
  },
  overworld: {
    parallax: {
      // Fractions of the viewport width. Layer strengths match the documented
      // far/mid/near/foreground bands while preserving the existing travel.
      maxTravel: 0.54,
      far: {
        strength: 0.13,
        mountain: 0.7,
        lowerCloud: 1.5,
      },
      mid: {
        strength: 0.35,
        hills: [0.3, 0.35, 0.28],
        tower: 0.55,
      },
      near: {
        strength: 0.74,
        path: [0.16, 0.06, 0.03],
        flowers: 0.7,
        dust: {
          base: 0.3,
          step: 0.08,
          variants: 3,
        },
      },
      foreground: {
        strength: 1,
      },
    },
    traveler: {
      start: 0.13,
      travel: 0.46,
    },
  },
  dive: {
    timeline: {
      landOmen: [0.3, 0.315],
      surfaceReveal: [0.315, 0.33],
      riseToMiddle: [0.33, 0.345],
      crossContent: [0.345, 0.36],
      fullSubmerge: [0.36, 0.37],
      cameraDescent: [0.37, 0.38],
      surfaceRetreat: [0.38, 0.43],
    },
    surface: {
      belowViewport: 1.08,
      revealed: 0.82,
      middle: 0.5,
      submerged: 0.08,
      top: 0.025,
      distant: -0.12,
    },
    camera: {
      landTravel: 0.14,
      landScaleLoss: 0.035,
      underwaterOffset: 0.08,
    },
  },
  underwater: {
    timeline: {
      shallow: [0.38, 0.43],
      established: [0.43, 0.5],
      programs: [0.5, 0.59],
      tail: [0.59, 0.64],
      preheat: [0.64, 0.66],
    },
    parallax: {
      far: {
        strength: 0.16,
        ruin: [0.18, 0.31],
        fish: 0.46,
      },
      mid: {
        strength: 0.42,
        fish: 0.34,
        jellyfish: 0.18,
      },
      near: {
        strength: 0.74,
        kelp: 0.08,
        terrain: 0.13,
        bubbles: 0.32,
      },
      foreground: {
        strength: 1.06,
        travel: 0.45,
      },
    },
    preheat: {
      currentBoost: 0.34,
      kelpBoost: 0.72,
      bubbleSpeedBoost: 0.28,
      fishExitTravel: 0.34,
      rayLean: 0.08,
    },
  },
  quality: {
    high: { particles: 220, dpr: 2 },
    medium: { particles: 130, dpr: 1.5 },
    low: { particles: 64, dpr: 1 },
  },
} as const;

export type QualityLevel = keyof typeof STORY_CONFIG.quality;

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function mapProgress(progress: number, range: readonly [number, number]) {
  return clamp((progress - range[0]) / (range[1] - range[0]));
}

export function smoothstep(value: number) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

export function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * clamp(amount);
}

export function getDiveState(progress: number) {
  const timeline = STORY_CONFIG.dive.timeline;
  const surface = STORY_CONFIG.dive.surface;
  const landOmen = smoothstep(mapProgress(progress, timeline.landOmen));
  const surfaceReveal = smoothstep(mapProgress(progress, timeline.surfaceReveal));
  const riseToMiddle = smoothstep(mapProgress(progress, timeline.riseToMiddle));
  const crossContent = smoothstep(mapProgress(progress, timeline.crossContent));
  const fullSubmerge = smoothstep(mapProgress(progress, timeline.fullSubmerge));
  const cameraDescent = smoothstep(mapProgress(progress, timeline.cameraDescent));
  const surfaceRetreat = smoothstep(mapProgress(progress, timeline.surfaceRetreat));
  const landFade = smoothstep(mapProgress(progress, [timeline.fullSubmerge[0], timeline.cameraDescent[1]]));
  const underwaterReveal = smoothstep(mapProgress(progress, [timeline.riseToMiddle[0], timeline.fullSubmerge[1]]));
  let surfaceY: number = surface.belowViewport;
  if (progress >= timeline.surfaceReveal[0]) surfaceY = lerp(surface.belowViewport, surface.revealed, surfaceReveal);
  if (progress >= timeline.riseToMiddle[0]) surfaceY = lerp(surface.revealed, surface.middle, riseToMiddle);
  if (progress >= timeline.crossContent[0]) surfaceY = lerp(surface.middle, surface.submerged, crossContent);
  if (progress >= timeline.fullSubmerge[0]) surfaceY = lerp(surface.submerged, surface.top, fullSubmerge);
  if (progress >= timeline.cameraDescent[0]) surfaceY = lerp(surface.top, surface.top * 0.72, cameraDescent);
  if (progress >= timeline.surfaceRetreat[0]) surfaceY = lerp(surface.top * 0.72, surface.distant, surfaceRetreat);
  const surfaceOpacity = surfaceReveal * (1 - surfaceRetreat);

  return {
    overall: mapProgress(progress, STORY_CONFIG.sections.dive),
    landOmen,
    surfaceReveal,
    riseToMiddle,
    crossContent,
    fullSubmerge,
    cameraDescent,
    surfaceRetreat,
    landFade,
    underwaterReveal,
    surfaceY,
    surfaceOpacity,
    refraction: surfaceOpacity * smoothstep(mapProgress(progress, [timeline.riseToMiddle[0], timeline.crossContent[1]])),
  };
}

export function getUnderwaterState(progress: number) {
  const timeline = STORY_CONFIG.underwater.timeline;
  return {
    shallow: smoothstep(mapProgress(progress, timeline.shallow)),
    established: smoothstep(mapProgress(progress, timeline.established)),
    programs: smoothstep(mapProgress(progress, timeline.programs)),
    tail: smoothstep(mapProgress(progress, timeline.tail)),
    preheat: smoothstep(mapProgress(progress, timeline.preheat)),
  };
}

export function mixColor(from: number, to: number, amount: number) {
  const t = clamp(amount);
  const fr = (from >> 16) & 0xff;
  const fg = (from >> 8) & 0xff;
  const fb = from & 0xff;
  const tr = (to >> 16) & 0xff;
  const tg = (to >> 8) & 0xff;
  const tb = to & 0xff;
  return ((Math.round(fr + (tr - fr) * t) << 16) | (Math.round(fg + (tg - fg) * t) << 8) | Math.round(fb + (tb - fb) * t));
}
