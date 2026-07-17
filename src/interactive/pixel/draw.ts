import { Graphics } from "pixi.js";

export function drawPixelCloud(g: Graphics, x: number, y: number, scale: number, color = 0xfff6dd, shadow = 0xd7e8df) {
  const s = Math.max(1, Math.round(scale));
  g.rect(x, y + 8 * s, 44 * s, 12 * s).fill(color)
    .rect(x + 8 * s, y, 12 * s, 8 * s).fill(color)
    .rect(x + 20 * s, y + 3 * s, 16 * s, 8 * s).fill(color)
    .rect(x + 5 * s, y + 20 * s, 34 * s, 3 * s).fill(shadow)
    .rect(x + 2 * s, y + 11 * s, 5 * s, 6 * s).fill(0xffffff);
}

export function drawMountain(g: Graphics, x: number, baseline: number, width: number, height: number, color: number, snow = 0xd9f4ed) {
  g.moveTo(x, baseline).lineTo(x + width * 0.2, baseline - height * 0.42).lineTo(x + width * 0.34, baseline - height * 0.3).lineTo(x + width * 0.54, baseline - height).lineTo(x + width * 0.72, baseline - height * 0.45).lineTo(x + width, baseline).fill(color);
  g.moveTo(x + width * 0.43, baseline - height * 0.72).lineTo(x + width * 0.54, baseline - height).lineTo(x + width * 0.66, baseline - height * 0.68).lineTo(x + width * 0.59, baseline - height * 0.72).lineTo(x + width * 0.53, baseline - height * 0.62).lineTo(x + width * 0.49, baseline - height * 0.72).fill(snow);
}

export function drawTree(g: Graphics, x: number, groundY: number, scale = 1, dark = 0x267a40, light = 0x58c65a) {
  const s = scale;
  g.rect(x - 5 * s, groundY - 34 * s, 10 * s, 34 * s).fill(0x75452f)
    .rect(x - 19 * s, groundY - 53 * s, 38 * s, 23 * s).fill(dark)
    .rect(x - 13 * s, groundY - 66 * s, 28 * s, 20 * s).fill(light)
    .rect(x + 10 * s, groundY - 46 * s, 12 * s, 12 * s).fill(light)
    .rect(x - 15 * s, groundY - 62 * s, 7 * s, 7 * s).fill(0x83df64);
}

export function drawTower(g: Graphics, x: number, groundY: number, scale = 1) {
  const s = scale;
  g.rect(x - 20 * s, groundY - 92 * s, 40 * s, 92 * s).fill(0x526b71)
    .rect(x - 24 * s, groundY - 98 * s, 48 * s, 10 * s).fill(0x344c5d)
    .rect(x - 27 * s, groundY - 112 * s, 9 * s, 18 * s).fill(0x344c5d)
    .rect(x - 4 * s, groundY - 118 * s, 8 * s, 22 * s).fill(0x344c5d)
    .rect(x + 18 * s, groundY - 112 * s, 9 * s, 18 * s).fill(0x344c5d)
    .rect(x - 8 * s, groundY - 70 * s, 16 * s, 24 * s).fill(0xffd25a)
    .rect(x - 5 * s, groundY - 67 * s, 10 * s, 18 * s).fill(0x73d7ff)
    .rect(x - 13 * s, groundY - 30 * s, 10 * s, 30 * s).fill(0x263d48)
    .rect(x + 5 * s, groundY - 30 * s, 10 * s, 30 * s).fill(0x263d48)
    .rect(x - 21 * s, groundY - 84 * s, 7 * s, 7 * s).fill(0x83df64);
}

export function drawFlower(g: Graphics, x: number, groundY: number, color: number, scale = 1) {
  const s = Math.max(1, scale);
  g.rect(x, groundY - 10 * s, 2 * s, 10 * s).fill(0x267a40)
    .rect(x - 3 * s, groundY - 14 * s, 4 * s, 4 * s).fill(color)
    .rect(x + 2 * s, groundY - 14 * s, 4 * s, 4 * s).fill(color)
    .rect(x, groundY - 17 * s, 3 * s, 3 * s).fill(0xfff3c4);
}

export function drawTraveler(g: Graphics, x: number, groundY: number, bob = 0, facing = 1) {
  const y = groundY - 51 + bob;
  g.rect(x + 9, y, 24, 6).fill(0xa8463d)
    .rect(x + 13, y - 5, 16, 6).fill(0xf45b5b)
    .rect(x + 12, y + 6, 19, 15).fill(0xffd25a)
    .rect(x + (facing > 0 ? 26 : 13), y + 10, 4, 4).fill(0x18233b)
    .rect(x + 8, y + 21, 27, 22).fill(0x344c7d)
    .rect(x + 4, y + 25, 8, 18).fill(0xf45b5b)
    .rect(x + 8, y + 43, 10, 8).fill(0x18233b)
    .rect(x + 27, y + 43, 10, 8).fill(0x18233b)
    .rect(x + 35, y + 28, 8, 5).fill(0x75533d);
}

export function drawFish(g: Graphics, x: number, y: number, scale: number, direction: 1 | -1, color: number, alpha = 1) {
  const s = scale * direction;
  g.moveTo(x - 15 * s, y).lineTo(x, y - 8 * scale).lineTo(x + 18 * s, y).lineTo(x, y + 8 * scale).fill({ color, alpha })
    .moveTo(x - 15 * s, y).lineTo(x - 25 * s, y - 9 * scale).lineTo(x - 25 * s, y + 9 * scale).fill({ color, alpha: alpha * 0.78 })
    .rect(x + 7 * s - (direction < 0 ? 2 : 0), y - 2, 3, 3).fill({ color: 0xe5faff, alpha });
}

export function drawJellyfish(g: Graphics, x: number, y: number, scale: number, color = 0x89f0d7, alpha = 0.75) {
  g.moveTo(x - 13 * scale, y).lineTo(x - 9 * scale, y - 12 * scale).lineTo(x, y - 18 * scale).lineTo(x + 9 * scale, y - 12 * scale).lineTo(x + 13 * scale, y).fill({ color, alpha })
    .rect(x - 12 * scale, y, 24 * scale, 5 * scale).fill({ color, alpha: alpha * 0.75 });
  for (let i = -2; i <= 2; i += 1) {
    g.moveTo(x + i * 5 * scale, y + 5 * scale).lineTo(x + i * 5 * scale + (i % 2) * 4 * scale, y + 19 * scale).stroke({ width: Math.max(1, scale), color, alpha: alpha * 0.65 });
  }
}

export function drawKelp(g: Graphics, x: number, groundY: number, height: number, sway: number, color: number, width = 9) {
  g.moveTo(x - width, groundY).lineTo(x + sway * 0.28, groundY - height * 0.35).lineTo(x - sway * 0.18, groundY - height * 0.68).lineTo(x + sway, groundY - height).lineTo(x + sway + width, groundY - height + 3).lineTo(x + width, groundY).fill(color);
}

export function drawRuin(g: Graphics, x: number, groundY: number, scale = 1, glow = 0x25bec4) {
  const s = scale;
  g.rect(x - 45 * s, groundY - 78 * s, 90 * s, 78 * s).fill(0x153c50)
    .rect(x - 50 * s, groundY - 84 * s, 100 * s, 10 * s).fill(0x214d5c)
    .rect(x - 34 * s, groundY - 56 * s, 28 * s, 56 * s).fill(0x092e55)
    .rect(x + 8 * s, groundY - 56 * s, 28 * s, 56 * s).fill(0x092e55)
    .rect(x - 28 * s, groundY - 49 * s, 16 * s, 34 * s).fill({ color: glow, alpha: 0.42 })
    .rect(x + 14 * s, groundY - 49 * s, 16 * s, 34 * s).fill({ color: glow, alpha: 0.42 })
    .rect(x - 54 * s, groundY - 20 * s, 12 * s, 20 * s).fill(0x0a6b6d)
    .rect(x + 42 * s, groundY - 34 * s, 12 * s, 34 * s).fill(0xff806e);
}

export function drawPixelStar(g: Graphics, x: number, y: number, size: number, color: number, alpha = 1) {
  g.rect(x - size, y, size * 3, size).fill({ color, alpha })
    .rect(x, y - size, size, size * 3).fill({ color, alpha });
}

export function drawPlanet(g: Graphics, x: number, y: number, radius: number) {
  g.circle(x, y, radius).fill(0x312b76)
    .circle(x - radius * 0.24, y - radius * 0.2, radius * 0.72).fill(0x5e8cff)
    .circle(x - radius * 0.36, y - radius * 0.34, radius * 0.18).fill(0xc16de0)
    .ellipse(x, y + radius * 0.1, radius * 1.55, radius * 0.34).stroke({ width: Math.max(2, radius * 0.08), color: 0xfff3c4, alpha: 0.7 });
}

export function drawFloatingIsland(g: Graphics, x: number, y: number, scale = 1) {
  const s = scale;
  g.moveTo(x - 70 * s, y).lineTo(x + 72 * s, y).lineTo(x + 50 * s, y + 24 * s).lineTo(x + 14 * s, y + 48 * s).lineTo(x - 10 * s, y + 68 * s).lineTo(x - 28 * s, y + 37 * s).lineTo(x - 55 * s, y + 24 * s).fill(0x181443)
    .rect(x - 70 * s, y - 12 * s, 142 * s, 14 * s).fill(0x5e8cff)
    .rect(x - 35 * s, y - 62 * s, 42 * s, 50 * s).fill(0x2c2868)
    .rect(x - 25 * s, y - 50 * s, 22 * s, 27 * s).fill({ color: 0xfff3c4, alpha: 0.7 })
    .rect(x + 20 * s, y - 39 * s, 8 * s, 27 * s).fill(0xaaa8cc)
    .rect(x + 12 * s, y - 45 * s, 25 * s, 7 * s).fill(0xc16de0);
}
