// lib/image/cropImage.ts

export const CARD_ASPECT_RATIO = 5 / 7; // width / height — locked ratio for all card art
export const CARD_TARGET_WIDTH = 1050; // px, master resolution (5:7 at ~150dpi)
export const CARD_TARGET_HEIGHT = 1470;
export const CARD_THUMB_WIDTH = 300; // for marketplace grid/listing views
export const CARD_THUMB_HEIGHT = 420;

export type PixelCrop = { x: number; y: number; width: number; height: number };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Canvas export failed")),
      type,
      quality,
    );
  });
}

/**
 * Crops the source image to the pixel box selected by the crop UI,
 * then resizes it down to a fixed canonical resolution and re-encodes as WebP.
 * Always outputs exactly CARD_TARGET_WIDTH x CARD_TARGET_HEIGHT — no drift, no distortion.
 */
export async function cropAndResizeImage(
  imageSrc: string,
  pixelCrop: PixelCrop,
  outputWidth = CARD_TARGET_WIDTH,
  outputHeight = CARD_TARGET_HEIGHT,
): Promise<File> {
  const image = await loadImage(imageSrc);

  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Draw only the cropped region, scaled to fill the canonical output size.
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  const blob = await canvasToBlob(canvas, "image/webp", 0.9);
  return new File([blob], "card-image.webp", { type: "image/webp" });
}

/** Generates a lightweight thumbnail from the same crop for grid/listing views. */
export async function generateThumbnail(
  imageSrc: string,
  pixelCrop: PixelCrop,
): Promise<File> {
  const blob = await cropAndResizeImage(
    imageSrc,
    pixelCrop,
    CARD_THUMB_WIDTH,
    CARD_THUMB_HEIGHT,
  );
  return new File([blob], "card-thumb.webp", { type: "image/webp" });
}

/** Rejects source images that are too small to safely crop to card resolution without upscaling blur. */
export async function validateMinResolution(
  file: File,
  minWidth = 100,
  minHeight = 100,
) {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    if (img.width < minWidth || img.height < minHeight) {
      throw new Error(
        `Image too small (${img.width}×${img.height}). Minimum is ${minWidth}×${minHeight} for sharp card art.`,
      );
    }
  } finally {
    URL.revokeObjectURL(url);
  }
}
