/**
 * Kerala PSC Image Processing Tool - Cropper Manager
 * Integrates CropperJS with container guards and aspect-ratio locks.
 */

window.CropperManager = {
  photoCropper: null,
  signatureCropper: null,

  /**
   * Initialize Cropper for Photo (Aspect 150/165)
   */
  initPhotoCropper: function(imgElement, onChangeCallback) {
    if (this.photoCropper) {
      this.photoCropper.destroy();
      this.photoCropper = null;
    }

    if (typeof Cropper === 'undefined' || !imgElement) {
      if (onChangeCallback) onChangeCallback();
      return;
    }

    // Wait until image is ready
    const initFn = () => {
      this.photoCropper = new Cropper(imgElement, {
        aspectRatio: 150 / 165,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 0.9,
        restore: false,
        guides: true,
        center: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
        ready: function() {
          if (onChangeCallback) onChangeCallback();
        },
        cropend: function() {
          if (onChangeCallback) onChangeCallback();
        },
        zoom: function() {
          if (onChangeCallback) onChangeCallback();
        }
      });
    };

    if (imgElement.complete && imgElement.naturalWidth > 0) {
      initFn();
    } else {
      imgElement.onload = initFn;
    }
  },

  /**
   * Initialize Cropper for Signature (Aspect 150/100)
   */
  initSignatureCropper: function(imgElement, onChangeCallback) {
    if (this.signatureCropper) {
      this.signatureCropper.destroy();
      this.signatureCropper = null;
    }

    if (typeof Cropper === 'undefined' || !imgElement) {
      if (onChangeCallback) onChangeCallback();
      return;
    }

    const initFn = () => {
      this.signatureCropper = new Cropper(imgElement, {
        aspectRatio: 150 / 100,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 0.95,
        restore: false,
        guides: true,
        center: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
        ready: function() {
          if (onChangeCallback) onChangeCallback();
        },
        cropend: function() {
          if (onChangeCallback) onChangeCallback();
        },
        zoom: function() {
          if (onChangeCallback) onChangeCallback();
        }
      });
    };

    if (imgElement.complete && imgElement.naturalWidth > 0) {
      initFn();
    } else {
      imgElement.onload = initFn;
    }
  },

  getPhotoCropData: function() {
    if (this.photoCropper) {
      const data = this.photoCropper.getData(true);
      return {
        x: Math.max(0, data.x),
        y: Math.max(0, data.y),
        width: Math.max(1, data.width),
        height: Math.max(1, data.height)
      };
    }
    return null;
  },

  getSignatureCropData: function() {
    if (this.signatureCropper) {
      const data = this.signatureCropper.getData(true);
      return {
        x: Math.max(0, data.x),
        y: Math.max(0, data.y),
        width: Math.max(1, data.width),
        height: Math.max(1, data.height)
      };
    }
    return null;
  },

  rotatePhoto: function(degree) {
    if (this.photoCropper) {
      this.photoCropper.rotate(degree);
    }
  },

  rotateSignature: function(degree) {
    if (this.signatureCropper) {
      this.signatureCropper.rotate(degree);
    }
  }
};
