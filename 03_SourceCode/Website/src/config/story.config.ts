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
  m55: {
    dynamicMeteors: {
      intervalMs: { min: 1000, max: 3000 }, //流星出现频率时间范围
      durationMs: { min: 300, max: 900 },
      angleDeg: { min: 24, max: 36 },
      speedPxPerSecond: { min: 1050, max: 1750 },
      tailPx: { desktop: [46, 86], mobile: [28, 52] },
      maxActive: { desktop: 2, mobile: 1 },
      doubleChance: 0.24,
      headPx: { min: 3, max: 5 },
      dprCap: 1.5,
    },
    planetHalo: {
      innerScale: 1.12,
      outerScale: 1.48,
      scatterScale: 1.72,
      ringXScale: 1.62,
      ringYScale: 0.38,
      innerAlpha: 0.2,
      outerAlpha: 0.075,
      scatterAlpha: 0.12,
      rearRingAlpha: 0.34,
      frontRingAlpha: 0.84,
      ringWidthRatio: 0.07,
    },
    waveSprites: {
      back: {
        heightRatio: { desktop: 0.16, mobile: 0.13 },
        anchorY: 0.7,
        driftPxPerSecond: -8,
        bobPx: 2,
        bobSpeed: 0.42,
        phase: 0.16,
        alpha: 0.52,
      },
      mid: {
        heightRatio: { desktop: 0.23, mobile: 0.18 },
        anchorY: 0.72,
        driftPxPerSecond: 13,
        bobPx: 3,
        bobSpeed: 0.58,
        phase: 0.47,
        alpha: 0.72,
      },
      foreground: {
        heightRatio: { desktop: 0.34, mobile: 0.26 },
        anchorY: 0.76,
        driftPxPerSecond: -21,
        bobPx: 5,
        bobSpeed: 0.78,
        phase: 0.79,
        alpha: 0.96,
      },
      foamFront: {
        heightRatio: { desktop: 0.2, mobile: 0.15 },
        anchorY: 0.7,
        driftPxPerSecond: 19,
        phase: 0.28,
        alpha: 0.78,
      },
      foamMid: {
        heightRatio: { desktop: 0.14, mobile: 0.11 },
        anchorY: 0.72,
        driftPxPerSecond: -11,
        phase: 0.63,
        alpha: 0.5,
      },
      bubbleClusters: {
        heightRatio: { desktop: 0.28, mobile: 0.21 },
        driftPxPerSecond: 12,
        alpha: 0.34,
      },
      supplementalFoamScale: 0.3,
      supplementalBubbleScale: 0.24,
      overscanPx: 48,
    },
  },
  m6: {
    motionRestore: {
      maxSettleFrames: 12,
      requiredStableFrames: 4,
      boundsTolerancePx: 0.5,
      progressTolerance: 0.01,
    },
  },
  m61: {
    programsArchive: {
      titleFade: [0.59, 0.64],
      titleRisePx: 12,
      titleColor: {
        sea: 0xe5faff,
        night: 0x181443,
      },
    },
  },
  m62: {
    timeline: {
      land: [0, 0.3],
      leap: [0.3, 0.328],
      drop: [0.328, 0.355],
      waveCover: [0.355, 0.368],
      diverEnter: [0.368, 0.38],
      diverTravel: [0.38, 0.62],
      diverExit: [0.62, 0.66],
      astronautGate: [0.8, 0.83],
    },
    land: {
      startX: 0.13,
      endX: 0.59,
      groundY: 0.73,
      leapApexX: 0.64,
      waveEntryX: 0.67,
      leapApexY: 0.48,
      waveEntryY: 0.64,
      coveredY: 0.76,
    },
    diver: {
      enterX: 0.72,
      enterY: 0.72,
      startX: 0.82,
      startY: 0.2,
      endX: 0.22,
      endY: 0.68,
      exitY: 1.16,
    },
    mobile: {
      land: {
        leapApexX: 0.9,
        waveEntryX: 0.82,
        leapApexY: 0.55,
      },
      diver: {
        enterX: 0.76,
        enterY: 0.7,
        startX: 0.86,
        startY: 0.24,
        endX: 0.28,
        endY: 0.64,
        exitY: 1.12,
        travelXDelay: 0.55,
      },
    },
    sizes: {
      desktop: {
        landPx: 72,
        diverPx: 118,
        astronautPx: 132,
      },
      mobile: {
        landPx: 58,
        diverPx: 88,
        astronautPx: 94,
      },
    },
    bob: {
      landPx: 2,
      diverPx: 4,
      durationMs: 1600,
    },
    astronaut: {
      entryX: 0.68,
      entryY: 0.68,
      speedPxPerSecond: {
        desktop: { x: 86, y: 68 },
        mobile: { x: 52, y: 44 },
      },
      boundsPx: {
        desktop: { top: 96, right: 88, bottom: 82, left: 18 },
        mobile: { top: 84, right: 18, bottom: 118, left: 10 },
      },
      dimBrightness: 0.38,
      dimSaturation: 0.58,
      dprCap: 1.5,
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

export function getProgramsArchiveState(progress: number) {
  const config = STORY_CONFIG.m61.programsArchive;
  const titleExitProgress = smoothstep(mapProgress(progress, config.titleFade));

  return {
    titleExitProgress,
    titleOpacity: 1 - titleExitProgress,
    titleRisePx: Math.round(titleExitProgress * config.titleRisePx),
    titleColor: mixColor(config.titleColor.sea, config.titleColor.night, titleExitProgress),
  };
}

export type OctopusForm = "land" | "diver" | "astronaut" | "hidden";

export function getOctopusTravelerState(progress: number, mobile = false) {
  const timeline = STORY_CONFIG.m62.timeline;
  const land = STORY_CONFIG.m62.land;
  const diver = STORY_CONFIG.m62.diver;
  const landPath = mobile ? { ...land, ...STORY_CONFIG.m62.mobile.land } : land;
  const diverPath = mobile ? { ...diver, ...STORY_CONFIG.m62.mobile.diver } : diver;
  const astronautVisibility = smoothstep(mapProgress(progress, timeline.astronautGate));
  let form: OctopusForm = "hidden";
  let worldX: number = land.startX;
  let worldY: number = land.groundY;
  let landOpacity: number = 0;
  let diverOpacity: number = 0;

  if (progress <= timeline.land[1]) {
    const local = smoothstep(mapProgress(progress, timeline.land));
    form = "land";
    worldX = lerp(land.startX, land.endX, local);
    worldY = land.groundY;
    landOpacity = 1;
  } else if (progress <= timeline.leap[1]) {
    const local = smoothstep(mapProgress(progress, timeline.leap));
    form = "land";
    worldX = lerp(land.endX, landPath.leapApexX, local);
    worldY = lerp(land.groundY, landPath.leapApexY, local);
    landOpacity = 1;
  } else if (progress <= timeline.drop[1]) {
    const local = smoothstep(mapProgress(progress, timeline.drop));
    form = "land";
    worldX = lerp(landPath.leapApexX, landPath.waveEntryX, local);
    worldY = lerp(landPath.leapApexY, land.waveEntryY, local);
    landOpacity = 1;
  } else if (progress <= timeline.waveCover[1]) {
    const local = smoothstep(mapProgress(progress, timeline.waveCover));
    form = "land";
    worldX = landPath.waveEntryX;
    worldY = lerp(land.waveEntryY, land.coveredY, local);
    landOpacity = 1 - local;
  } else if (progress <= timeline.diverEnter[1]) {
    const local = smoothstep(mapProgress(progress, timeline.diverEnter));
    form = "diver";
    worldX = lerp(diverPath.enterX, diverPath.startX, local);
    worldY = lerp(diverPath.enterY, diverPath.startY, local);
    diverOpacity = local;
  } else if (progress <= timeline.diverTravel[1]) {
    const local = smoothstep(mapProgress(progress, timeline.diverTravel));
    const horizontal = mobile
      ? smoothstep(mapProgress(local, [STORY_CONFIG.m62.mobile.diver.travelXDelay, 1]))
      : local;
    form = "diver";
    worldX = lerp(diverPath.startX, diverPath.endX, horizontal);
    worldY = lerp(diverPath.startY, diverPath.endY, local);
    diverOpacity = 1;
  } else if (progress <= timeline.diverExit[1]) {
    const local = smoothstep(mapProgress(progress, timeline.diverExit));
    form = "diver";
    worldX = diverPath.endX;
    worldY = lerp(diverPath.endY, diverPath.exitY, local);
    diverOpacity = 1 - smoothstep(mapProgress(local, [0.72, 1]));
  } else if (astronautVisibility > 0) {
    form = "astronaut";
  }

  return {
    form,
    worldX,
    worldY,
    landOpacity,
    diverOpacity,
    astronautVisibility,
    aboveContent: progress > timeline.land[1] && progress <= timeline.drop[1],
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
