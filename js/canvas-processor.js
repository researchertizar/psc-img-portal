/**
 * Kerala PSC Image Processing Tool - Canvas Processor Engine
 * Professional, high-precision canvas rendering with coordinate guards,
 * high-DPI font scaling, and universal date formatting.
 */

window.CanvasProcessor = {

  /**
   * Render PSC Compliant Photograph onto a 150 x 200 canvas
   * @param {HTMLCanvasElement} canvas 
   * @param {HTMLImageElement|HTMLCanvasElement} sourceImg 
   * @param {Object} crop - {x, y, width, height}
   * @param {string} candidateName - Candidate Name (rendered UPPERCASE)
   * @param {string} dateTaken - Date photograph was taken
   */
  renderPhoto: function(canvas, sourceImg, crop, candidateName, dateTaken) {
    const TARGET_WIDTH = 150;
    const TARGET_HEIGHT = 200;
    const STRIP_HEIGHT = 35; // Bottom white strip height
    const PHOTO_HEIGHT = TARGET_HEIGHT - STRIP_HEIGHT; // 165px

    canvas.width = TARGET_WIDTH;
    canvas.height = TARGET_HEIGHT;
    const ctx = canvas.getContext('2d');

    // 1. Enable high-quality smoothing for crisp photo rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 2. Fill entire canvas background with pure white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

    // 3. Safely draw cropped photograph in top 150x165 region
    if (sourceImg) {
      const naturalW = sourceImg.naturalWidth || sourceImg.width || TARGET_WIDTH;
      const naturalH = sourceImg.naturalHeight || sourceImg.height || PHOTO_HEIGHT;

      let sx = 0, sy = 0, sw = naturalW, sh = naturalH;
      if (crop && crop.width > 0 && crop.height > 0) {
        sx = Math.max(0, Math.min(naturalW - 1, crop.x || 0));
        sy = Math.max(0, Math.min(naturalH - 1, crop.y || 0));
        sw = Math.max(1, Math.min(naturalW - sx, crop.width));
        sh = Math.max(1, Math.min(naturalH - sy, crop.height));
      }

      ctx.drawImage(
        sourceImg,
        sx, sy, sw, sh,
        0, 0, TARGET_WIDTH, PHOTO_HEIGHT
      );
    }

    // 4. Draw Bottom White Strip (Height = 35px, Y = 165 to 200)
    const stripY = PHOTO_HEIGHT;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, stripY, TARGET_WIDTH, STRIP_HEIGHT);

    // Top border of strip
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, stripY + 0.5);
    ctx.lineTo(TARGET_WIDTH, stripY + 0.5);
    ctx.stroke();

    // 5. Render Candidate Name (Upper Line) & Date Taken (Lower Line)
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Format Name (Uppercase, fallback to CANDIDATE NAME)
    const formattedName = (candidateName || 'CANDIDATE NAME').trim().toUpperCase();

    // Format Date Taken
    const formattedDate = this.formatDate(dateTaken);

    // Dynamic font size fitting for Candidate Name (fits within 140px width)
    let nameFontSize = 11;
    ctx.font = `700 ${nameFontSize}px Arial, -apple-system, sans-serif`;
    while (ctx.measureText(formattedName).width > 140 && nameFontSize > 6.5) {
      nameFontSize -= 0.5;
      ctx.font = `700 ${nameFontSize}px Arial, -apple-system, sans-serif`;
    }

    // Render Name at Y = 176px
    ctx.fillText(formattedName, TARGET_WIDTH / 2, stripY + 11);

    // Render Date at Y = 189px
    ctx.font = `700 10px Arial, -apple-system, sans-serif`;
    ctx.fillText(formattedDate, TARGET_WIDTH / 2, stripY + 24);

    return canvas;
  },

  /**
   * Render PSC Compliant Signature onto a 150 x 100 canvas
   * @param {HTMLCanvasElement} canvas 
   * @param {HTMLImageElement|HTMLCanvasElement} sourceImg 
   * @param {Object} crop - {x, y, width, height}
   * @param {number} contrastThreshold - 0 to 100 paper cleanup slider
   */
  renderSignature: function(canvas, sourceImg, crop, contrastThreshold = 0) {
    const TARGET_WIDTH = 150;
    const TARGET_HEIGHT = 100;

    canvas.width = TARGET_WIDTH;
    canvas.height = TARGET_HEIGHT;
    const ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Fill background with white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

    if (sourceImg) {
      const naturalW = sourceImg.naturalWidth || sourceImg.width || TARGET_WIDTH;
      const naturalH = sourceImg.naturalHeight || sourceImg.height || TARGET_HEIGHT;

      let sx = 0, sy = 0, sw = naturalW, sh = naturalH;
      if (crop && crop.width > 0 && crop.height > 0) {
        sx = Math.max(0, Math.min(naturalW - 1, crop.x || 0));
        sy = Math.max(0, Math.min(naturalH - 1, crop.y || 0));
        sw = Math.max(1, Math.min(naturalW - sx, crop.width));
        sh = Math.max(1, Math.min(naturalH - sy, crop.height));
      }

      ctx.drawImage(
        sourceImg,
        sx, sy, sw, sh,
        0, 0, TARGET_WIDTH, TARGET_HEIGHT
      );

      // Paper cleanup / contrast boost filter
      if (contrastThreshold > 0) {
        const imgData = ctx.getImageData(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
        const data = imgData.data;
        const cutoff = 255 - (contrastThreshold * 1.8);

        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (avg > cutoff) {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
          } else {
            // Darken ink strokes
            data[i] = Math.max(0, data[i] * 0.7);
            data[i + 1] = Math.max(0, data[i + 1] * 0.7);
            data[i + 2] = Math.max(0, data[i + 2] * 0.7);
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }
    }

    return canvas;
  },

  /**
   * Helper date formatter: converts date string/input into DD/MM/YYYY
   */
  formatDate: function(dateStr) {
    if (!dateStr) {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    }

    const str = String(dateStr).trim();

    // If input is YYYY-MM-DD from HTML date input
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      const p = str.split('-');
      return `${p[2]}/${p[1]}/${p[0]}`;
    }

    // If input is already DD/MM/YYYY or DD-MM-YYYY
    if (/^\d{2}[/\-]\d{2}[/\-]\d{4}$/.test(str)) {
      return str.replace(/-/g, '/');
    }

    return str;
  }
};
