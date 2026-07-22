import { useEffect, useRef } from "react";
import { STORY_CONFIG } from "../config/story.config";

type Meteor = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  startedAt: number;
  duration: number;
  tailLength: number;
  headSize: number;
};

function between(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function MeteorOverlay({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const config = STORY_CONFIG.m55.dynamicMeteors;
    let disposed = false;
    let running = false;
    let timerId = 0;
    let animationFrameId = 0;
    let meteors: Meteor[] = [];
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;

    const isMobile = () => viewportWidth < 768;
    const maximumActive = () => isMobile() ? config.maxActive.mobile : config.maxActive.desktop;
    const motionReduced = () => reducedMotion;

    const resizeCanvas = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, config.dprCap);
      canvas.width = Math.max(1, Math.round(viewportWidth * dpr));
      canvas.height = Math.max(1, Math.round(viewportHeight * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.imageSmoothingEnabled = false;
    };

    const updateDebugState = () => {
      canvas.dataset.running = String(running);
      canvas.dataset.meteorCount = String(meteors.length);
    };

    const clearFrame = () => {
      context.clearRect(0, 0, viewportWidth, viewportHeight);
    };

    const stop = () => {
      running = false;
      window.clearTimeout(timerId);
      window.cancelAnimationFrame(animationFrameId);
      timerId = 0;
      animationFrameId = 0;
      meteors = [];
      clearFrame();
      updateDebugState();
    };

    const draw = (now: number) => {
      if (!running || disposed) return;
      clearFrame();
      meteors = meteors.filter((meteor) => {
        const elapsed = now - meteor.startedAt;
        if (elapsed < 0) return true;
        const life = elapsed / meteor.duration;
        if (life >= 1) return false;

        const seconds = elapsed / 1000;
        const x = meteor.x + meteor.velocityX * seconds;
        const y = meteor.y + meteor.velocityY * seconds;
        const speed = Math.hypot(meteor.velocityX, meteor.velocityY);
        const directionX = meteor.velocityX / speed;
        const directionY = meteor.velocityY / speed;
        const fade = life < 0.12 ? life / 0.12 : Math.pow(1 - life, 1.65);
        const blocks = Math.max(4, Math.round(meteor.tailLength / 7));

        for (let block = blocks; block >= 1; block -= 1) {
          const distance = block / blocks * meteor.tailLength;
          const alpha = fade * (1 - block / (blocks + 1)) * 0.72;
          const size = block < 3 ? 4 : 3;
          context.fillStyle = `rgba(255, 243, 196, ${alpha})`;
          context.fillRect(
            Math.round(x - directionX * distance),
            Math.round(y - directionY * distance),
            size * 2,
            size,
          );
        }

        context.fillStyle = `rgba(255, 255, 238, ${Math.min(1, fade * 1.35)})`;
        context.fillRect(Math.round(x), Math.round(y), meteor.headSize * 2, meteor.headSize);
        context.fillStyle = `rgba(137, 240, 215, ${fade * 0.72})`;
        context.fillRect(Math.round(x + meteor.headSize), Math.round(y + meteor.headSize), meteor.headSize, 2);
        return true;
      });
      updateDebugState();
      animationFrameId = meteors.length > 0 ? window.requestAnimationFrame(draw) : 0;
    };

    const spawn = () => {
      if (!running || disposed || document.hidden || motionReduced()) return;
      const available = maximumActive() - meteors.length;
      const requested = !isMobile() && Math.random() < config.doubleChance ? 2 : 1;
      const count = Math.min(available, requested);
      const now = performance.now();
      for (let index = 0; index < count; index += 1) {
        const angle = between(config.angleDeg.min, config.angleDeg.max) * Math.PI / 180;
        const speed = between(config.speedPxPerSecond.min, config.speedPxPerSecond.max);
        const tailRange = isMobile() ? config.tailPx.mobile : config.tailPx.desktop;
        meteors.push({
          x: between(-viewportWidth * 0.06, viewportWidth * 0.58) - index * viewportWidth * 0.12,
          y: between(-viewportHeight * 0.05, viewportHeight * 0.5) - index * viewportHeight * 0.08,
          velocityX: Math.cos(angle) * speed,
          velocityY: Math.sin(angle) * speed,
          startedAt: now + index * 70,
          duration: between(config.durationMs.min, config.durationMs.max),
          tailLength: between(tailRange[0], tailRange[1]),
          headSize: Math.round(between(config.headPx.min, config.headPx.max)),
        });
      }
      if (meteors.length > 0 && animationFrameId === 0) animationFrameId = window.requestAnimationFrame(draw);
      updateDebugState();
      schedule();
    };

    const schedule = () => {
      if (!running || disposed) return;
      window.clearTimeout(timerId);
      timerId = window.setTimeout(spawn, between(config.intervalMs.min, config.intervalMs.max));
    };

    const start = () => {
      if (running || !active || document.hidden || motionReduced()) return;
      running = true;
      updateDebugState();
      schedule();
    };

    const synchronize = () => {
      if (active && !document.hidden && !motionReduced()) start();
      else stop();
    };

    const onVisibilityChange = () => synchronize();
    const onResize = () => resizeCanvas();

    resizeCanvas();
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("resize", onResize);
    synchronize();

    return () => {
      disposed = true;
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
    };
  }, [active, reducedMotion]);

  return <canvas ref={canvasRef} className="meteor-overlay pixel-art" aria-hidden="true" data-running="false" data-meteor-count="0" />;
}
