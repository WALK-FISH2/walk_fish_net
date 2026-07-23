import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = path.join(ROOT, "assets", "reference", "m6-2", "generated-alpha");
const OUTPUT_DIR = path.join(ROOT, "src", "assets", "m6-2");
const CANVAS_SIZE = 384;
const SUBJECT_SIZE = 344;

const ASSETS = [
  ["octopus-land-alpha.png", "octopus-land.png"],
  ["octopus-diver-alpha.png", "octopus-diver.png"],
  ["octopus-astronaut-alpha.png", "octopus-astronaut.png"],
];

async function normalizeSprite(sourceName, outputName) {
  const source = path.join(SOURCE_DIR, sourceName);
  const destination = path.join(OUTPUT_DIR, outputName);
  const trimmed = await sharp(source)
    .ensureAlpha()
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 8 })
    .resize(SUBJECT_SIZE, SUBJECT_SIZE, {
      fit: "inside",
      kernel: sharp.kernel.nearest,
      withoutEnlargement: true,
    })
    .png()
    .toBuffer();
  const metadata = await sharp(trimmed).metadata();
  const left = Math.floor((CANVAS_SIZE - (metadata.width ?? SUBJECT_SIZE)) / 2);
  const top = Math.floor((CANVAS_SIZE - (metadata.height ?? SUBJECT_SIZE)) / 2);

  await sharp({
    create: {
      width: CANVAS_SIZE,
      height: CANVAS_SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: trimmed, left, top }])
    .png({ compressionLevel: 9, palette: true, colours: 256, dither: 0 })
    .toFile(destination);

  console.log(`${sourceName} -> ${path.relative(ROOT, destination)} ${CANVAS_SIZE}x${CANVAS_SIZE}`);
}

await Promise.all(ASSETS.map(([sourceName, outputName]) => normalizeSprite(sourceName, outputName)));
