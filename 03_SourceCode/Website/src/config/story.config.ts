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
      cooling: [0.3, 0.315],
      farWave: [0.315, 0.328],
      waveApproach: [0.328, 0.342],
      waveBreak: [0.342, 0.355],
      foamCover: [0.355, 0.368],
      underwaterSettle: [0.368, 0.38],
      surfaceRetreat: [0.38, 0.43],
    },
    surface: {
      belowViewport: 1.08,
      revealed: 0.82,
      middle: 0.5,
      submerged: 0.08,
      top: 0.025,
      distant: -0.12,
      farWaveVisible: 0.92,
      frontWaveApproach: 0.88,
      frontWaveMiddle: 0.56,
      frontWaveExit: -0.08,
    },
    waves: {
      far: {
        amplitude: 0.012,
        wavelength: 112,
        phase: 0.35,
        speed: 0.32,
        alpha: 0.42,
        color: 0x1d91a9,
        highlight: 0x64d8dc,
        pixelStep: 18,
        pixelBlock: 4,
        verticalOffset: 0.08,
        crestBlocks: 1,
        foamWeight: 0.08,
      },
      mid: {
        amplitude: 0.024,
        wavelength: 82,
        phase: 1.25,
        speed: 0.56,
        alpha: 0.68,
        color: 0x25bec4,
        highlight: 0x89f0d7,
        pixelStep: 14,
        pixelBlock: 5,
        verticalOffset: 0.025,
        crestBlocks: 2,
        foamWeight: 0.28,
      },
      foreground: {
        amplitude: 0.052,
        wavelength: 58,
        phase: 2.15,
        speed: 0.9,
        alpha: 0.9,
        color: 0x64d8dc,
        highlight: 0xe8ffff,
        pixelStep: 10,
        pixelBlock: 6,
        verticalOffset: 0,
        crestBlocks: 3,
        foamWeight: 1,
      },
    },
    foam: {
      desktopCount: 96,
      mobileScale: 0.38,
      coverSpread: 0.38,
      drift: 0.018,
      mistAlpha: 0.16,
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
  oceanToSpace: {
    timeline: {
      preheat: [0.64, 0.66],
      bubbleDensity: [0.66, 0.69],
      brighten: [0.69, 0.72],
      bubbleToStar: [0.72, 0.755],
      starToMeteor: [0.755, 0.785],
      settleSpace: [0.785, 0.8],
    },
    particles: {
      maxCount: 180,
      baseDensity: 0.49,
      streamCount: {
        desktop: 3,
        mobile: 2,
      },
      mobileDensityScale: 0.86,
      meteorRatio: {
        desktop: 0.055,
        mobile: 0.022,
        reducedMotion: 0,
      },
      meteorTravel: {
        desktop: 0.13,
        mobile: 0.08,
      },
      meteorTail: {
        desktop: 58,
        mobile: 32,
      },
      deterministicLock: [0.59, 0.64],
    },
    colors: {
      deepSea: 0x04162f,
      nightBlue: 0x07112d,
      indigo: 0x181443,
      purple: 0x32245d,
      nebula: 0x5b4cb5,
      bubble: 0x89f0d7,
      bubbleHighlight: 0xe5faff,
      star: 0xfff3c4,
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

export function getLandOceanTransitionState(progress: number) {
  const timeline = STORY_CONFIG.dive.timeline;
  const surface = STORY_CONFIG.dive.surface;
  const cooling = smoothstep(mapProgress(progress, timeline.cooling));
  const farWaveProgress = smoothstep(mapProgress(progress, timeline.farWave));
  const farWave = progress >= timeline.farWave[0] ? 0.32 + farWaveProgress * 0.68 : 0;
  const waveApproach = smoothstep(mapProgress(progress, timeline.waveApproach));
  const waveBreak = smoothstep(mapProgress(progress, timeline.waveBreak));
  const foamCover = smoothstep(mapProgress(progress, timeline.foamCover));
  const underwaterSettle = smoothstep(mapProgress(progress, timeline.underwaterSettle));
  const surfaceRetreat = smoothstep(mapProgress(progress, timeline.surfaceRetreat));
  const seamCover = foamCover * (1 - underwaterSettle);

  let frontWaveY: number = surface.frontWaveApproach;
  if (progress >= timeline.waveBreak[0]) frontWaveY = lerp(surface.frontWaveApproach, surface.frontWaveMiddle, waveBreak);
  if (progress >= timeline.foamCover[0]) frontWaveY = lerp(surface.frontWaveMiddle, surface.frontWaveExit, foamCover);
  if (progress >= timeline.underwaterSettle[0]) frontWaveY = lerp(surface.frontWaveExit, surface.frontWaveExit - 0.06, underwaterSettle);

  return {
    cooling,
    farWave,
    farWaveProgress,
    waveApproach,
    waveBreak,
    foamCover,
    underwaterSettle,
    surfaceRetreat,
    seamCover,
    frontWaveY,
  };
}

export function getDiveState(progress: number) {
  const timeline = STORY_CONFIG.dive.timeline;
  const surface = STORY_CONFIG.dive.surface;
  const transition = getLandOceanTransitionState(progress);
  const landOmen = transition.cooling;
  const surfaceReveal = transition.farWave;
  const riseToMiddle = transition.waveApproach;
  const crossContent = transition.waveBreak;
  const fullSubmerge = transition.foamCover;
  const cameraDescent = transition.underwaterSettle;
  const surfaceRetreat = transition.surfaceRetreat;
  const landFade = smoothstep(mapProgress(progress, [timeline.foamCover[0], timeline.underwaterSettle[1]]));
  const underwaterReveal = smoothstep(mapProgress(progress, [timeline.waveApproach[0], timeline.foamCover[1]]));
  let surfaceY: number = surface.belowViewport;
  if (progress >= timeline.farWave[0]) surfaceY = lerp(surface.belowViewport, surface.revealed, transition.farWaveProgress);
  if (progress >= timeline.waveApproach[0]) surfaceY = lerp(surface.revealed, surface.middle, riseToMiddle);
  if (progress >= timeline.waveBreak[0]) surfaceY = lerp(surface.middle, surface.submerged, crossContent);
  if (progress >= timeline.foamCover[0]) surfaceY = lerp(surface.submerged, surface.top, fullSubmerge);
  if (progress >= timeline.underwaterSettle[0]) surfaceY = lerp(surface.top, surface.top * 0.72, cameraDescent);
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
    refraction: surfaceOpacity * smoothstep(mapProgress(progress, [timeline.waveApproach[0], timeline.waveBreak[1]])),
    transition,
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

export function getOceanSpaceMorphState(progress: number) {
  const timeline = STORY_CONFIG.oceanToSpace.timeline;
  const preheat = smoothstep(mapProgress(progress, timeline.preheat));
  const bubbleDensity = smoothstep(mapProgress(progress, timeline.bubbleDensity));
  const brighten = smoothstep(mapProgress(progress, timeline.brighten));
  const bubbleToStar = smoothstep(mapProgress(progress, timeline.bubbleToStar));
  const starToMeteor = smoothstep(mapProgress(progress, timeline.starToMeteor));
  const settleSpace = smoothstep(mapProgress(progress, timeline.settleSpace));

  return {
    preheat,
    bubbleDensity,
    brighten,
    bubbleToStar,
    starToMeteor,
    settleSpace,
    deterministicLock: smoothstep(mapProgress(progress, STORY_CONFIG.oceanToSpace.particles.deterministicLock)),
    oceanExit: smoothstep(mapProgress(progress, [timeline.brighten[0], timeline.settleSpace[1]])),
    spaceBlend: smoothstep(mapProgress(progress, [timeline.brighten[0], timeline.settleSpace[1]])),
    nebula: smoothstep(mapProgress(progress, [timeline.bubbleToStar[0], timeline.settleSpace[1]])),
    programsExit: smoothstep(mapProgress(progress, [timeline.brighten[0], timeline.starToMeteor[1]])),
    aboutEnter: settleSpace,
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
