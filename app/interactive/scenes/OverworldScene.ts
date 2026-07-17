import { Container, Graphics } from "pixi.js";
import type { PixelScene, SceneFrame } from "./types";

export class OverworldScene implements PixelScene {
  container = new Container();
  private sky = new Graphics();
  private scenery = new Graphics();
  private foreground = new Graphics();

  constructor() {
    this.container.addChild(this.sky, this.scenery, this.foreground);
  }

  update({ width, height, progress, time }: SceneFrame) {
    const horizon = Math.round(height * 0.68);
    const travel = progress * width * 0.24;

    this.sky
      .clear()
      .rect(0, 0, width, height)
      .fill(0x73d7ff)
      .rect(0, height * 0.48, width, height * 0.28)
      .fill(0xc8f2ff);

    this.scenery.clear();
    for (let index = -1; index < 5; index += 1) {
      const x = index * 260 + ((time * 8 + progress * 90) % 260) - 100;
      const y = 78 + (index % 2) * 55;
      this.scenery
        .rect(Math.round(x), y, 94, 24)
        .fill(0xfff6dd)
        .rect(Math.round(x + 18), y - 18, 58, 18)
        .fill(0xfff6dd)
        .rect(Math.round(x + 12), y + 24, 70, 7)
        .fill(0xd5e9dc);
    }

    this.scenery
      .moveTo(-40 - travel * 0.15, horizon)
      .lineTo(width * 0.18 - travel * 0.15, height * 0.32)
      .lineTo(width * 0.42 - travel * 0.15, horizon)
      .fill(0x5fa6a0)
      .moveTo(width * 0.25 - travel * 0.2, horizon)
      .lineTo(width * 0.56 - travel * 0.2, height * 0.28)
      .lineTo(width * 0.9 - travel * 0.2, horizon)
      .fill(0x438a77)
      .circle(width * 0.12 - travel * 0.4, horizon + 30, 150)
      .fill(0x73c95e)
      .circle(width * 0.7 - travel * 0.4, horizon + 42, 210)
      .fill(0x58b95a);

    this.foreground
      .clear()
      .rect(0, horizon, width, height - horizon)
      .fill(0x267a40)
      .rect(0, horizon, width, 16)
      .fill(0x58c65a)
      .rect(0, horizon + 42, width, height - horizon - 42)
      .fill(0xa85f3f);

    for (let x = -16; x < width + 24; x += 32) {
      const offset = Math.round((x - progress * width * 1.1) % (width + 32));
      this.foreground
        .rect(offset, horizon + 16, 16, 12)
        .fill(0x3e9145)
        .rect(offset + 16, horizon + 28, 16, 14)
        .fill(0x7d472f);
    }

    const travelerX = Math.round(width * 0.18 + progress * width * 0.35);
    const bob = Math.round(Math.sin(time * 5) * 2);
    const travelerY = horizon - 48 + bob;
    this.foreground
      .rect(travelerX + 12, travelerY, 20, 14)
      .fill(0xffd25a)
      .rect(travelerX + 8, travelerY + 14, 28, 22)
      .fill(0xf45b5b)
      .rect(travelerX + 4, travelerY + 36, 14, 12)
      .fill(0x18233b)
      .rect(travelerX + 28, travelerY + 36, 14, 12)
      .fill(0x18233b)
      .rect(travelerX + 28, travelerY + 5, 4, 4)
      .fill(0x18233b);
  }

  destroy() {
    this.container.destroy({ children: true });
  }
}
