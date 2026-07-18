"""Build the transparent M5.5 wave and foam sprites from owner-provided refs.

This is an authoring helper, not a production/runtime dependency. It trims the
reference canvases, removes invisible RGB residue, and quantizes visible pixels
to the site's ocean palette while preserving the original alpha silhouettes.
"""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
REFERENCE_DIR = ROOT / "assets" / "reference" / "m5-5"
OUTPUT_DIR = ROOT / "src" / "assets" / "m5-5"
PADDING = 8

ASSETS = {
    "wave-large-01.png": ("wave-front.png", "wave"),
    "wave-medium-02.png": ("wave-mid.png", "wave"),
    "wave-small-03.png": ("wave-back.png", "wave"),
    "bubble-foam-band-01.png": ("foam-band-front.png", "foam"),
    "bubble-clusters-02.png": ("bubble-clusters.png", "foam"),
    "bubble-foam-band-03.png": ("foam-band-mid.png", "foam"),
}

WAVE_PALETTE = (
    (0x14, 0x54, 0x9E),
    (0x1D, 0x91, 0xA9),
    (0x25, 0xBE, 0xC4),
    (0x64, 0xD8, 0xDC),
    (0xE8, 0xFF, 0xFF),
)

FOAM_PALETTE = (
    (0x25, 0xBE, 0xC4),
    (0x64, 0xD8, 0xDC),
    (0x89, 0xF0, 0xD7),
    (0xE8, 0xFF, 0xFF),
)


def quantize_alpha(alpha: int) -> int:
    if alpha < 24:
        return 0
    if alpha < 96:
        return 80
    if alpha < 176:
        return 160
    if alpha < 232:
        return 224
    return 255


def palette_index(red: int, green: int, blue: int, palette_size: int) -> int:
    brightness = red * 0.18 + green * 0.48 + blue * 0.34
    normalized = max(0.0, min(1.0, (brightness - 45) / 205))
    return min(palette_size - 1, round(normalized * (palette_size - 1)))


def process(source: Path, destination: Path, kind: str) -> None:
    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        raise ValueError(f"Reference has no visible pixels: {source}")

    image = image.crop(bbox)
    palette = WAVE_PALETTE if kind == "wave" else FOAM_PALETTE
    pixels = []
    source_pixels = image.get_flattened_data() if hasattr(image, "get_flattened_data") else image.getdata()
    for red, green, blue, alpha_value in source_pixels:
        output_alpha = quantize_alpha(alpha_value)
        if output_alpha == 0:
            pixels.append((0, 0, 0, 0))
            continue
        color = palette[palette_index(red, green, blue, len(palette))]
        pixels.append((*color, output_alpha))
    image.putdata(pixels)

    padded = Image.new("RGBA", (image.width + PADDING * 2, image.height + PADDING * 2), (0, 0, 0, 0))
    padded.alpha_composite(image, (PADDING, PADDING))
    destination.parent.mkdir(parents=True, exist_ok=True)
    padded.save(destination, optimize=True)
    print(f"{source.name} -> {destination.relative_to(ROOT)} {padded.width}x{padded.height}")


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for source_name, (output_name, kind) in ASSETS.items():
        process(REFERENCE_DIR / source_name, OUTPUT_DIR / output_name, kind)


if __name__ == "__main__":
    main()
