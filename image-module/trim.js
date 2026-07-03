/**
 * Trims an image by removing transparent borders.
 * @param {HTMLImageElement} img - The loaded image to trim.
 * @returns {HTMLCanvasElement} - A canvas containing the cropped image.
 */
export function trimImage(img) {
  // Object destructuring for cleaner variables
  const { naturalWidth: width, naturalHeight: height } = img;

  // 1. Create a workspace canvas and draw the original image
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  // 2. Get the pixel data
  const { data } = ctx.getImageData(0, 0, width, height);

  // 3. Initialize bounds
  let left = width, right = 0, top = height, bottom = 0;
  let foundPixel = false;

  // 4. Scan pixels (Optimized Loop)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Calculate alpha index directly to save operations
      const alpha = data[(y * width + x) * 4 + 3];

      // If pixel is visible
      if (alpha > 0) {
        foundPixel = true;
        // Optimization: Raw 'if' statements are significantly faster 
        // than Math.min/Math.max inside loops scanning millions of pixels
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }

  // 5. Handle empty image case (fully transparent)
  if (!foundPixel) return canvas;

  // 6. Calculate new cropped dimensions
  const trimWidth = right - left + 1;
  const trimHeight = bottom - top + 1;

  // Optimization: If no transparent borders were found, return the original canvas early
  if (trimWidth === width && trimHeight === height) {
    return canvas;
  }

  // 7. Crop and return
  const croppedCanvas = document.createElement("canvas");
  croppedCanvas.width = trimWidth;
  croppedCanvas.height = trimHeight;
  
  const croppedCtx = croppedCanvas.getContext("2d");
  croppedCtx.drawImage(
    canvas,
    left, top, trimWidth, trimHeight, // Source (x, y, width, height)
    0, 0, trimWidth, trimHeight       // Destination (x, y, width, height)
  );

  return croppedCanvas;
}