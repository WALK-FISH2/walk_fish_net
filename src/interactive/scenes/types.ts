import type { Container } from "pixi.js";

export interface SceneFrame {
  width: number;
  height: number;
  progress: number;
  time: number;
  pointerX: number;
  pointerY: number;
  particleScale: number;
}

export interface PixelScene {
  container: Container;
  update(frame: SceneFrame): void;
  destroy(): void;
}
