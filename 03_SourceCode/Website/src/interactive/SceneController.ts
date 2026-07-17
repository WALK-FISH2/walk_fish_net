import { Application, Container, TextureStyle, type Ticker } from "pixi.js";
import { STORY_CONFIG, mapProgress, smoothstep, type QualityLevel } from "../config/story.config";
import { OverworldScene } from "./scenes/OverworldScene";
import { SpaceScene } from "./scenes/SpaceScene";
import { UnderwaterScene } from "./scenes/UnderwaterScene";
import type { PixelScene } from "./scenes/types";
import { DiveTransition } from "./transitions/DiveTransition";
import { OceanToSpaceTransition } from "./transitions/OceanToSpaceTransition";

export class SceneController {
  private app = new Application();
  private world = new Container();
  private scenes: PixelScene[] = [];
  private diveTransition = new DiveTransition();
  private oceanTransition = new OceanToSpaceTransition();
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
  constructor(private readonly onContextLost?: () => void) {}

  async init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    TextureStyle.defaultOptions.scaleMode = "nearest";
    const dpr = Math.min(window.devicePixelRatio || 1, STORY_CONFIG.quality[this.quality].dpr);
    await this.app.init({ canvas, width: window.innerWidth, height: window.innerHeight, resolution: dpr, autoDensity: true, antialias: false, backgroundAlpha: 0, preference: "webgl" });
    const overworld = new OverworldScene();
    const underwater = new UnderwaterScene();
    const space = new SpaceScene();
    this.scenes = [overworld, underwater, space];
    this.world.addChild(overworld.container, underwater.container, space.container, this.diveTransition.container, this.oceanTransition.container);
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
  update(progress: number) { this.progress = Math.min(1, Math.max(0, progress)); this.renderFrame(); }
  setQuality(level: QualityLevel) { this.quality = level; this.renderFrame(); }
  setReducedMotion(reduced: boolean) { this.reducedMotion = reduced; if (reduced) this.app.ticker.stop(); else this.app.ticker.start(); this.renderFrame(); }
  setPointer(x: number, y: number) { this.pointerX = x; this.pointerY = y; }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.app.ticker.remove(this.tick);
    this.canvas?.removeEventListener("webglcontextlost", this.handleContextLost);
    document.removeEventListener("visibilitychange", this.handleVisibility);
    this.scenes.forEach((scene) => scene.destroy());
    this.diveTransition.destroy();
    this.oceanTransition.destroy();
    this.app.destroy(false, { children: true, texture: false, textureSource: false });
  }

  private tick = (ticker: Ticker) => { this.elapsed += Math.min(ticker.deltaMS / 1000, 0.05); this.renderFrame(); };
  private renderFrame() {
    if (this.destroyed || this.scenes.length !== 3 || this.width === 0) return;
    const [overworld, underwater, space] = this.scenes;
    const dive = smoothstep(mapProgress(this.progress, STORY_CONFIG.sections.dive));
    const depth = mapProgress(this.progress, STORY_CONFIG.sections.underwater);
    const transform = smoothstep(mapProgress(this.progress, STORY_CONFIG.sections.oceanToSpace));
    const particleScale = this.quality === "high" ? 1 : this.quality === "medium" ? 0.62 : 0.32;
    overworld.container.alpha = 1 - smoothstep(Math.max(0, (dive - 0.65) / 0.35));
    underwater.container.alpha = Math.min(smoothstep(dive * 1.35), 1 - smoothstep(Math.max(0, (transform - 0.42) / 0.5)));
    space.container.alpha = smoothstep(Math.max(0, (transform - 0.48) / 0.52));
    const locals = [mapProgress(this.progress, STORY_CONFIG.sections.overworld), depth, mapProgress(this.progress, STORY_CONFIG.sections.space)];
    this.scenes.forEach((scene, index) => scene.update({ width: this.width, height: this.height, progress: locals[index], time: this.elapsed, pointerX: this.pointerX, pointerY: this.pointerY, particleScale }));
    this.diveTransition.update(this.width, this.height, dive, depth, this.elapsed, particleScale);
    this.oceanTransition.update(this.width, this.height, transform, this.elapsed, particleScale, this.reducedMotion);
    const maxRotation = this.width < 768 ? Math.PI * 0.58 : Math.PI * 0.94;
    this.world.rotation = this.reducedMotion ? 0 : Math.sin(transform * Math.PI) * maxRotation;
    if (this.reducedMotion) this.app.render();
  }
  private handleContextLost = (event: Event) => { event.preventDefault(); this.onContextLost?.(); };
  private handleVisibility = () => { if (document.hidden) this.app.ticker.stop(); else if (!this.reducedMotion) this.app.ticker.start(); };
}

export function detectQuality(): QualityLevel {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "low";
  const cores = navigator.hardwareConcurrency ?? 4;
  const touch = navigator.maxTouchPoints > 0;
  if (window.innerWidth < 768 || cores <= 4) return "low";
  if (touch || cores <= 8 || window.devicePixelRatio > 2) return "medium";
  return "high";
}
