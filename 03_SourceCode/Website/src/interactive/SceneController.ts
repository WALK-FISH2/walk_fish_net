import { Application, Container, TextureStyle, type Ticker } from "pixi.js";
import { STORY_CONFIG, getDiveState, mapProgress, mixColor, smoothstep, type QualityLevel } from "../config/story.config";
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
  private initialized = false;
  private destroyed = false;
  constructor(private readonly onContextLost?: () => void) {}

  async init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    TextureStyle.defaultOptions.scaleMode = "nearest";
    const dpr = Math.min(window.devicePixelRatio || 1, STORY_CONFIG.quality[this.quality].dpr);
    await this.app.init({ canvas, width: window.innerWidth, height: window.innerHeight, resolution: dpr, autoDensity: true, antialias: false, backgroundAlpha: 0, preference: "webgl" });
    if (this.destroyed) {
      this.app.destroy(false, { children: true, texture: false, textureSource: false });
      return;
    }
    this.initialized = true;
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
    if (this.destroyed || !this.initialized) return;
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
    if (!this.initialized) {
      this.diveTransition.destroy();
      this.oceanTransition.destroy();
      return;
    }
    this.app.ticker.remove(this.tick);
    this.canvas?.removeEventListener("webglcontextlost", this.handleContextLost);
    document.removeEventListener("visibilitychange", this.handleVisibility);
    this.scenes.forEach((scene) => scene.destroy());
    this.diveTransition.destroy();
    this.oceanTransition.destroy();
    this.app.destroy(false, { children: true, texture: false, textureSource: false });
    this.initialized = false;
  }

  private tick = (ticker: Ticker) => { this.elapsed += Math.min(ticker.deltaMS / 1000, 0.05); this.renderFrame(); };
  private renderFrame() {
    if (this.destroyed || this.scenes.length !== 3 || this.width === 0) return;
    const [overworld, underwater, space] = this.scenes;
    const diveState = getDiveState(this.progress);
    const depth = mapProgress(this.progress, STORY_CONFIG.sections.underwater);
    const transform = smoothstep(mapProgress(this.progress, STORY_CONFIG.sections.oceanToSpace));
    const particleScale = this.quality === "high" ? 1 : this.quality === "medium" ? 0.62 : 0.32;
    const landFade = diveState.landFade;
    overworld.container.alpha = 1 - landFade;
    overworld.container.tint = mixColor(0xffffff, 0x7396a0, diveState.landOmen * 0.48 + landFade * 0.42);
    overworld.container.y = -diveState.cameraDescent * this.height * STORY_CONFIG.dive.camera.landTravel;
    const landScale = 1 - diveState.cameraDescent * STORY_CONFIG.dive.camera.landScaleLoss;
    overworld.container.scale.set(landScale);
    underwater.container.alpha = Math.min(diveState.underwaterReveal, 1 - smoothstep(Math.max(0, (transform - 0.42) / 0.5)));
    underwater.container.y = (1 - diveState.cameraDescent) * this.height * STORY_CONFIG.dive.camera.underwaterOffset;
    space.container.alpha = smoothstep(Math.max(0, (transform - 0.48) / 0.52));
    const locals = [mapProgress(this.progress, STORY_CONFIG.sections.overworld), depth, mapProgress(this.progress, STORY_CONFIG.sections.space)];
    this.scenes.forEach((scene, index) => scene.update({ width: this.width, height: this.height, globalProgress: this.progress, progress: locals[index], time: this.elapsed, pointerX: this.pointerX, pointerY: this.pointerY, particleScale, reducedMotion: this.reducedMotion }));
    this.diveTransition.update(this.width, this.height, this.progress, this.elapsed, particleScale, this.reducedMotion);
    this.oceanTransition.update(this.width, this.height, transform, this.elapsed, particleScale, this.reducedMotion);
    // Product invariant: every world remains upright while colors, light and
    // particles morph continuously between the ocean and space scenes.
    this.world.rotation = 0;
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
