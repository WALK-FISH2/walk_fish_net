import { Application, Container, Graphics, TextureStyle, type Ticker } from "pixi.js";
import { STORY_CONFIG, mapProgress, smoothstep, type QualityLevel } from "../config/story.config";
import { OverworldScene } from "./scenes/OverworldScene";
import { SpaceScene } from "./scenes/SpaceScene";
import { UnderwaterScene } from "./scenes/UnderwaterScene";
import type { PixelScene } from "./scenes/types";

export interface SceneControllerOptions {
  onContextLost?: () => void;
}

export class SceneController {
  private app = new Application();
  private world = new Container();
  private transitionFx = new Graphics();
  private scenes: PixelScene[] = [];
  private progress = 0;
  private elapsed = 0;
  private width = 0;
  private height = 0;
  private quality: QualityLevel = "high";
  private reducedMotion = false;
  private pointerX = 0.5;
  private pointerY = 0.5;
  private canvas?: HTMLCanvasElement;
  private destroyed = false;
  private readonly onContextLost?: () => void;

  constructor(options: SceneControllerOptions = {}) {
    this.onContextLost = options.onContextLost;
  }

  async init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    TextureStyle.defaultOptions.scaleMode = "nearest";
    const dpr = Math.min(window.devicePixelRatio || 1, STORY_CONFIG.quality[this.quality].dpr);
    await this.app.init({
      canvas,
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: dpr,
      autoDensity: true,
      antialias: false,
      backgroundAlpha: 0,
      preference: "webgl",
    });

    const overworld = new OverworldScene();
    const underwater = new UnderwaterScene();
    const space = new SpaceScene();
    this.scenes = [overworld, underwater, space];
    this.world.addChild(overworld.container, underwater.container, space.container, this.transitionFx);
    this.app.stage.addChild(this.world);
    this.app.ticker.add(this.tick);
    canvas.addEventListener("webglcontextlost", this.handleContextLost);
    document.addEventListener("visibilitychange", this.handleVisibility);
    this.resize(window.innerWidth, window.innerHeight, dpr);
  }

  resize(width: number, height: number, dpr = 1) {
    if (this.destroyed) return;
    this.width = width;
    this.height = height;
    this.app.renderer.resolution = Math.min(dpr, STORY_CONFIG.quality[this.quality].dpr);
    this.app.renderer.resize(width, height);
    this.world.pivot.set(width / 2, height / 2);
    this.world.position.set(width / 2, height / 2);
    this.renderFrame();
  }

  update(progress: number) {
    this.progress = Math.min(1, Math.max(0, progress));
    this.renderFrame();
  }

  setQuality(level: QualityLevel) {
    this.quality = level;
    this.renderFrame();
  }

  setReducedMotion(reduced: boolean) {
    this.reducedMotion = reduced;
    if (reduced) this.app.ticker.stop();
    else this.app.ticker.start();
    this.renderFrame();
  }

  setPointer(x: number, y: number) {
    this.pointerX = x;
    this.pointerY = y;
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.app.ticker.remove(this.tick);
    this.canvas?.removeEventListener("webglcontextlost", this.handleContextLost);
    document.removeEventListener("visibilitychange", this.handleVisibility);
    for (const scene of this.scenes) scene.destroy();
    this.scenes = [];
    this.app.destroy(false, { children: true, texture: false, textureSource: false });
  }

  private tick = (ticker: Ticker) => {
    this.elapsed += Math.min(ticker.deltaMS / 1000, 0.05);
    this.renderFrame();
  };

  private renderFrame() {
    if (this.destroyed || this.scenes.length !== 3 || this.width === 0) return;
    const [overworld, underwater, space] = this.scenes;
    const dive = smoothstep(mapProgress(this.progress, STORY_CONFIG.sections.dive));
    const transform = smoothstep(mapProgress(this.progress, STORY_CONFIG.sections.oceanToSpace));
    const seaExit = smoothstep(Math.min(1, transform * 1.45));
    const particleScale = this.quality === "high" ? 1 : this.quality === "medium" ? 0.62 : 0.32;

    overworld.container.alpha = 1 - dive;
    underwater.container.alpha = Math.min(dive, 1 - seaExit);
    space.container.alpha = transform;

    const localFrames = [
      mapProgress(this.progress, STORY_CONFIG.sections.overworld),
      mapProgress(this.progress, STORY_CONFIG.sections.underwater),
      mapProgress(this.progress, STORY_CONFIG.sections.space),
    ];
    this.scenes.forEach((scene, index) => scene.update({
      width: this.width,
      height: this.height,
      progress: localFrames[index],
      time: this.elapsed,
      pointerX: this.pointerX,
      pointerY: this.pointerY,
      particleScale,
    }));

    const maxRotation = this.width < 768 ? (Math.PI * 2) / 3 : Math.PI;
    this.world.rotation = this.reducedMotion ? 0 : transform * maxRotation;

    const wave = Math.sin(transform * Math.PI);
    const centerY = this.height * (0.86 - transform * 0.74);
    this.transitionFx.clear();
    if (wave > 0.02) {
      for (let layer = 0; layer < 3; layer += 1) {
        const amplitude = (28 + layer * 18) * wave;
        const offsetY = centerY + layer * 18;
        this.transitionFx.moveTo(-80, offsetY);
        for (let x = -80; x <= this.width + 100; x += 24) {
          const y = offsetY + Math.sin(x * 0.022 + transform * 16 + layer) * amplitude;
          this.transitionFx.lineTo(x, y);
        }
        this.transitionFx.lineTo(this.width + 100, offsetY + 80).lineTo(-80, offsetY + 80);
        this.transitionFx.fill({ color: layer === 0 ? 0xe5faff : layer === 1 ? 0x25bec4 : 0x5e8cff, alpha: 0.52 - layer * 0.09 });
      }
    }
  }

  private handleContextLost = (event: Event) => {
    event.preventDefault();
    this.onContextLost?.();
  };

  private handleVisibility = () => {
    if (document.hidden) this.app.ticker.stop();
    else if (!this.reducedMotion) this.app.ticker.start();
  };
}

export function detectQuality(): QualityLevel {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "low";
  const cores = navigator.hardwareConcurrency ?? 4;
  const touch = navigator.maxTouchPoints > 0;
  if (window.innerWidth < 768 || cores <= 4) return "low";
  if (touch || cores <= 8 || window.devicePixelRatio > 2) return "medium";
  return "high";
}
