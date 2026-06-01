const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const MAX_IMAGE_DIMENSION = 4096;

/**
 * Process an uploaded image: validate dimensions and strip EXIF metadata.
 *
 * @param {string} filePath — absolute path to the uploaded image on disk
 * @returns {{width: number, height: number}} — processed image dimensions
 * @throws {Error} — if dimensions exceed limit or sharp fails to process
 */
async function processUploadedImage(filePath) {
  let metadata;
  try {
    metadata = await sharp(filePath).metadata();
  } catch (err) {
    throw new Error("Error al procesar la imagen. Verificá que el archivo no esté corrupto.");
  }

  if (!metadata.width || !metadata.height) {
    throw new Error("Error al procesar la imagen. Verificá que el archivo no esté corrupto.");
  }

  if (metadata.width > MAX_IMAGE_DIMENSION || metadata.height > MAX_IMAGE_DIMENSION) {
    throw new Error(
      `La imagen excede las dimensiones máximas permitidas (${MAX_IMAGE_DIMENSION}×${MAX_IMAGE_DIMENSION} píxeles). ` +
      `Dimensiones detectadas: ${metadata.width}×${metadata.height}.`
    );
  }

  const tempPath = `${filePath}.tmp`;
  try {
    await sharp(filePath)
      .rotate()                 // auto-rotate based on EXIF orientation
      .withMetadata(false)      // strip all EXIF / ICC / XMP metadata
      .toFile(tempPath);

    fs.renameSync(tempPath, filePath);
  } catch (err) {
    // Clean up temp file if it exists
    try {
      fs.unlinkSync(tempPath);
    } catch (_) {
      // ignore ENOENT or other cleanup errors
    }
    throw new Error("Error al procesar la imagen. Verificá que el archivo no esté corrupto.");
  }

  return { width: metadata.width, height: metadata.height };
}

module.exports = {
  MAX_IMAGE_DIMENSION,
  processUploadedImage,
};
