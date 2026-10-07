const Jimp = require('jimp');

async function processImage() {
  try {
    const img = await Jimp.read('C:/Users/nihal/.gemini/antigravity/brain/27a5a5e0-d83f-4874-b91f-e01c79bbc065/.user_uploaded/media_1791146939788.png');
    
    // We are no longer cropping the image. We keep the full V icon and "VYRA CONNECT" text.

    // Make dark pixels transparent
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      // If pixel is very dark (close to black background)
      if (r < 30 && g < 30 && b < 30) {
        this.bitmap.data[idx + 3] = 0; // Transparent
      } else if (r < 70 && g < 70 && b < 70) {
        // Anti-aliasing fade
        const alpha = Math.max(0, Math.min(255, (r - 30) * 6));
        this.bitmap.data[idx + 3] = alpha;
      }
    });

    await img.writeAsync('public/logo-transparent.png');
    console.log("Processed successfully");
  } catch(e) {
    console.error(e);
  }
}

processImage();
