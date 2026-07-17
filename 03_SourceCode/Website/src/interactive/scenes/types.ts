import type { Container } from "pixi.js";

export interface SceneFrame {
  width: number;
  height: number;
  globalProgress: number;
  progress: number;
  time: number;
  pointerX: number;
  pointerY: number;
  particleScale: number;
  reducedMotion: boolean;
}

export interface PixelScene {
  container: Container;
  update(frame: SceneFrame): void;
  destroy(): void;
}
