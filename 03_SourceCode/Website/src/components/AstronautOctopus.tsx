import { useEffect, useRef } from "react";
import astronautOctopusUrl from "../assets/m6-2/octopus-astronaut.png";
import { STORY_CONFIG, getOctopusTravelerState } from "../config/story.config";

type AstronautMode = "hidden" | "entering" | "bouncing" | "reduced";

interface AstronautOctopusProps {
  progressRef: { current: number };
  updateRef: { current: (progress: number) => void };
  reducedMotion: boolean;
}

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function clampToBounds(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function AstronautOctopus({ progressRef, updateRef, reducedMotion }: AstronautOctopusProps) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    const config = STORY_CONFIG.m62.astronaut;
    let mode: AstronautMode = "hidden";
    let animationFrameId = 0;
    let previousTime = 0;
    let x = 0;
    let y = 0;
    let velocityX = 0;
    let velocityY = 0;
    let entryCount = 0;

    const mobile = () => window.innerWidth <= 767;
    const size = () => mobile() ? STORY_CONFIG.m62.sizes.mobile.astronautPx : STORY_CONFIG.m62.sizes.desktop.astronautPx;
    const speed = () => mobile() ? config.speedPxPerSecond.mobile : config.speedPxPerSecond.desktop;
    const padding = () => mobile() ? config.boundsPx.mobile : config.boundsPx.desktop;
    const bounds = (): Bounds => {
      const spriteSize = size();
      const safe = padding();
      const minX = safe.left;
      const maxX = Math.max(minX, window.innerWidth - safe.right - spriteSize);
      const minY = safe.top;
      const maxY = Math.max(minY, window.innerHeight - safe.bottom - spriteSize);
      return { minX, maxX, minY, maxY };
    };
    const entryTarget = () => {
      const safe = bounds();
      const spriteSize = size();
      return {
        x: clampToBounds(window.innerWidth * config.entryX - spriteSize / 2, safe.minX, safe.maxX),
        y: clampToBounds(window.innerHeight * config.entryY - spriteSize / 2, safe.minY, safe.maxY),
      };
    };
    const setDiagnostics = (visibility: number) => {
      image.dataset.mode = mode;
      image.dataset.running = animationFrameId ? "true" : "false";
      image.dataset.visibleProgress = visibility.toFixed(3);
      image.dataset.x = x.toFixed(1);
      image.dataset.y = y.toFixed(1);
      image.dataset.vx = velocityX.toFixed(1);
      image.dataset.vy = velocityY.toFixed(1);
      image.dataset.entryCount = String(entryCount);
    };
    const render = (visibility: number) => {
      const brightness = config.dimBrightness + (1 - config.dimBrightness) * visibility;
      const saturation = config.dimSaturation + (1 - config.dimSaturation) * visibility;
      image.style.opacity = String(visibility);
      image.style.filter = `brightness(${brightness.toFixed(3)}) saturate(${saturation.toFixed(3)})`;
      image.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      setDiagnostics(visibility);
    };
    const stopAnimation = () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
      previousTime = 0;
      image.dataset.running = "false";
    };
    const hide = () => {
      stopAnimation();
      mode = "hidden";
      image.style.opacity = "0";
      image.style.filter = "";
      image.dataset.mode = mode;
      image.dataset.visibleProgress = "0.000";
    };
    const startEntry = () => {
      const target = entryTarget();
      const currentSpeed = speed();
      mode = "entering";
      entryCount += 1;
      x = target.x;
      y = window.innerHeight + size() * 0.08;
      velocityX = currentSpeed.x;
      velocityY = -currentSpeed.y;
    };
    const updatePosition = (visibility: number, deltaSeconds: number) => {
      if (mode === "entering") {
        const target = entryTarget();
        x = target.x;
        y = window.innerHeight + size() * 0.08 + (target.y - window.innerHeight - size() * 0.08) * visibility;
        if (visibility >= 0.995) {
          mode = "bouncing";
          x = target.x;
          y = target.y;
          const currentSpeed = speed();
          velocityX = currentSpeed.x;
          velocityY = -currentSpeed.y;
        }
        return;
      }

      if (mode !== "bouncing") return;
      const safe = bounds();
      x += velocityX * deltaSeconds;
      y += velocityY * deltaSeconds;

      if (x <= safe.minX || x >= safe.maxX) {
        x = clampToBounds(x, safe.minX, safe.maxX);
        velocityX *= -1;
      }
      if (y <= safe.minY || y >= safe.maxY) {
        y = clampToBounds(y, safe.minY, safe.maxY);
        velocityY *= -1;
      }
    };
    const tick = (time: number) => {
      animationFrameId = 0;
      const visibility = getOctopusTravelerState(progressRef.current).astronautVisibility;
      if (visibility <= 0.001) {
        hide();
        return;
      }
      if (document.hidden) {
        render(visibility);
        return;
      }

      const deltaSeconds = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
      previousTime = time;
      updatePosition(visibility, deltaSeconds);
      render(visibility);
      animationFrameId = window.requestAnimationFrame(tick);
      image.dataset.running = "true";
    };
    const ensureAnimation = () => {
      if (!animationFrameId && !document.hidden) {
        previousTime = 0;
        animationFrameId = window.requestAnimationFrame(tick);
        image.dataset.running = "true";
      }
    };
    const synchronize = (progress: number) => {
      const visibility = getOctopusTravelerState(progress).astronautVisibility;
      if (visibility <= 0.001) {
        hide();
        return;
      }

      if (reducedMotion) {
        stopAnimation();
        mode = "reduced";
        const target = entryTarget();
        x = target.x;
        y = target.y;
        render(visibility);
        return;
      }

      if (mode === "hidden" || mode === "reduced") startEntry();
      render(visibility);
      ensureAnimation();
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
        return;
      }
      synchronize(progressRef.current);
    };
    const onResize = () => {
      if (mode === "hidden") return;
      if (mode === "entering" || mode === "reduced") {
        synchronize(progressRef.current);
        return;
      }
      const safe = bounds();
      x = clampToBounds(x, safe.minX, safe.maxX);
      y = clampToBounds(y, safe.minY, safe.maxY);
      render(getOctopusTravelerState(progressRef.current).astronautVisibility);
    };

    updateRef.current = synchronize;
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("resize", onResize);
    synchronize(progressRef.current);

    return () => {
      stopAnimation();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
      updateRef.current = () => {};
    };
  }, [progressRef, reducedMotion, updateRef]);

  return (
    <img
      ref={imageRef}
      className="octopus-astronaut pixel-art"
      src={astronautOctopusUrl.src}
      width={384}
      height={384}
      alt=""
      aria-hidden="true"
      draggable={false}
      data-mode="hidden"
      data-running="false"
      data-visible-progress="0.000"
      data-entry-count="0"
    />
  );
}
