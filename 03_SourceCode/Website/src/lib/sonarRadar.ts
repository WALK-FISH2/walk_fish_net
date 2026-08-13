export const SONAR_RADAR_CONFIG = {
  sweepDurationMs: 4_000,
  fadeDurationMs: [1_100, 2_100] as const,
  radialRange: [0.22, 0.68] as const,
  minimumTargetDistance: 0.2,
  maximumPlacementAttempts: 32,
} as const;

export interface SonarTargetPosition {
  angle: number;
  x: number;
  y: number;
}

export function normalizeSonarAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}

export function didSonarSweepCrossTarget(previousAngle: number, currentAngle: number, targetAngle: number) {
  const previous = normalizeSonarAngle(previousAngle);
  const current = normalizeSonarAngle(currentAngle);
  const target = normalizeSonarAngle(targetAngle);
  return previous <= current
    ? target > previous && target <= current
    : target > previous || target <= current;
}

export function randomSonarTargetPosition(random: () => number = Math.random): SonarTargetPosition {
  const [minimumRadius, maximumRadius] = SONAR_RADAR_CONFIG.radialRange;
  const angle = random() * 360;
  const radius = minimumRadius + Math.sqrt(random()) * (maximumRadius - minimumRadius);
  const radians = angle * Math.PI / 180;

  return {
    angle,
    x: 0.5 + Math.cos(radians) * radius * 0.5,
    y: 0.5 + Math.sin(radians) * radius * 0.5,
  };
}

export function randomSonarFadeDuration(random: () => number = Math.random) {
  const [minimum, maximum] = SONAR_RADAR_CONFIG.fadeDurationMs;
  return minimum + random() * (maximum - minimum);
}
