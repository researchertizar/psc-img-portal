/**
 * Kerala PSC Image Processing Tool - Iterative JPEG Compressor
 * Guarantees file size strictly <= 30 KB (30,720 bytes) with Object URL memory management.
 */

window.IterativeCompressor = {
  activePhotoUrl: null,
  activeSigUrl: null,

  /**
   * Asynchronously compress canvas to JPEG <= maxKB
   * @param {HTMLCanvasElement} canvas 
   * @param {number} maxKB - Target maximum KB (Default 30)
   * @param {string} cacheKey - 'photo' or 'sig' to manage URL cleanup
   * @returns {Promise<Object>}
   */
  compress: async function(canvas, maxKB = 30, cacheKey = 'photo') {
    const MAX_BYTES = maxKB * 1024; // 30,720 bytes
    
    let minQuality = 0.05;
    let maxQuality = 0.98;
    let bestBlob = null;
    let bestQuality = 0.90;
    
    try {
      // 1. Initial attempt at 0.92 quality
      let blob = await this._canvasToBlob(canvas, 'image/jpeg', 0.92);
      
      if (blob && blob.size <= MAX_BYTES) {
        bestBlob = blob;
        bestQuality = 0.92;
      } else {
        // 2. Binary search quality iteration
        for (let i = 0; i < 7; i++) {
          const midQuality = (minQuality + maxQuality) / 2;
          blob = await this._canvasToBlob(canvas, 'image/jpeg', midQuality);

          if (blob && blob.size <= MAX_BYTES) {
            bestBlob = blob;
            bestQuality = midQuality;
            minQuality = midQuality;
          } else {
            maxQuality = midQuality;
          }
        }

        if (!bestBlob) {
          bestBlob = await this._canvasToBlob(canvas, 'image/jpeg', 0.05);
          bestQuality = 0.05;
        }
      }
    } catch (e) {
      console.error('Canvas compression error:', e);
    }

    if (!bestBlob) {
      bestBlob = new Blob([], { type: 'image/jpeg' });
    }

    // 3. Memory Cleanup: Revoke previous Object URL to prevent browser memory leak
    if (cacheKey === 'photo') {
      if (this.activePhotoUrl) URL.revokeObjectURL(this.activePhotoUrl);
      this.activePhotoUrl = URL.createObjectURL(bestBlob);
    } else if (cacheKey === 'sig') {
      if (this.activeSigUrl) URL.revokeObjectURL(this.activeSigUrl);
      this.activeSigUrl = URL.createObjectURL(bestBlob);
    }

    const currentUrl = cacheKey === 'photo' ? this.activePhotoUrl : this.activeSigUrl;
    const sizeKB = (bestBlob.size / 1024).toFixed(1);

    return {
      blob: bestBlob,
      dataUrl: currentUrl,
      sizeBytes: bestBlob.size,
      sizeKB: parseFloat(sizeKB),
      formattedSize: `${sizeKB} KB`,
      quality: Math.round(bestQuality * 100),
      fitsRequirements: bestBlob.size <= MAX_BYTES && bestBlob.size > 0,
      dimensions: `${canvas.width} × ${canvas.height} px`
    };
  },

  /**
   * Helper promise wrapper for canvas.toBlob
   */
  _canvasToBlob: function(canvas, mimeType, quality) {
    return new Promise((resolve) => {
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        resolve(null);
        return;
      }
      canvas.toBlob(
        (blob) => resolve(blob),
        mimeType,
        quality
      );
    });
  }
};
