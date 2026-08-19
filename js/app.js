/**
 * PSC Image Studio - Enterprise Engine
 * Service Worker Registration, File Validation Guards & Accessibility Event Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Register Service Worker for PWA & Offline Support
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch((err) => {
        console.warn('Service worker registration skipped:', err);
      });
    });
  }

  // Theme Toggle Elements
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');

  // Navigation Tabs
  const tabPhotoBtn = document.getElementById('tabPhotoBtn');
  const tabSigBtn = document.getElementById('tabSigBtn');
  const photoSection = document.getElementById('photoSection');
  const sigSection = document.getElementById('sigSection');

  // Download Buttons
  const mobileDownloadPhotoBtn = document.getElementById('mobileDownloadPhotoBtn');
  const mobileDownloadSigBtn = document.getElementById('mobileDownloadSigBtn');
  const desktopDownloadPhotoBtn = document.getElementById('desktopDownloadPhotoBtn');
  const desktopDownloadSigBtn = document.getElementById('desktopDownloadSigBtn');

  // Photo Controls
  const photoDropzone = document.getElementById('photoDropzone');
  const photoFileInput = document.getElementById('photoFileInput');
  const loadSamplePhotoBtn = document.getElementById('loadSamplePhotoBtn');
  const photoCropperImg = document.getElementById('photoCropperImg');
  const cropperWrapperPhoto = document.getElementById('cropperWrapperPhoto');
  const photoToolbar = document.getElementById('photoToolbar');
  const candidateNameInput = document.getElementById('candidateName');
  const dateTakenInput = document.getElementById('dateTaken');
  const photoRotateBtn = document.getElementById('photoRotateBtn');
  const changePhotoBtn = document.getElementById('changePhotoBtn');

  const photoCanvas = document.getElementById('photoPreviewCanvas');
  const photoCanvasFrame = document.getElementById('photoCanvasFrame');
  const photoStatusBadge = document.getElementById('photoStatusBadge');
  const photoSizeBadge = document.getElementById('photoSizeBadge');

  // Signature Controls
  const sigDropzone = document.getElementById('sigDropzone');
  const sigFileInput = document.getElementById('sigFileInput');
  const loadSampleSigBtn = document.getElementById('loadSampleSigBtn');
  const sigCropperImg = document.getElementById('sigCropperImg');
  const cropperWrapperSig = document.getElementById('cropperWrapperSig');
  const sigToolbar = document.getElementById('sigToolbar');
  const sigContrastSlider = document.getElementById('sigContrastSlider');
  const sigContrastVal = document.getElementById('sigContrastVal');
  const sigRotateBtn = document.getElementById('sigRotateBtn');
  const changeSigBtn = document.getElementById('changeSigBtn');

  const sigCanvas = document.getElementById('sigPreviewCanvas');
  const sigCanvasFrame = document.getElementById('sigCanvasFrame');
  const sigStatusBadge = document.getElementById('sigStatusBadge');
  const sigSizeBadge = document.getElementById('sigSizeBadge');

  // State Trackers
  let currentPhotoImg = null;
  let currentSigImg = null;
  let currentPhotoBlob = null;
  let currentSigBlob = null;

  // Initialize Default Date to Today
  if (dateTakenInput) {
    dateTakenInput.value = new Date().toISOString().split('T')[0];
  }

  // --- 1. DUAL THEME LOGIC ---
  const savedTheme = localStorage.getItem('psc_studio_theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme') || 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      localStorage.setItem('psc_studio_theme', nextTheme);
    });
  }

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  // --- 2. TAB NAVIGATION ---
  tabPhotoBtn.addEventListener('click', () => {
    tabPhotoBtn.classList.add('active');
    tabPhotoBtn.setAttribute('aria-selected', 'true');
    tabSigBtn.classList.remove('active');
    tabSigBtn.setAttribute('aria-selected', 'false');

    photoSection.classList.add('active');
    sigSection.classList.remove('active');

    mobileDownloadPhotoBtn.classList.remove('hidden');
    mobileDownloadSigBtn.classList.add('hidden');

    updatePhotoPreview();
  });

  tabSigBtn.addEventListener('click', () => {
    tabSigBtn.classList.add('active');
    tabSigBtn.setAttribute('aria-selected', 'true');
    tabPhotoBtn.classList.remove('active');
    tabPhotoBtn.setAttribute('aria-selected', 'false');

    sigSection.classList.add('active');
    photoSection.classList.remove('active');

    mobileDownloadSigBtn.classList.remove('hidden');
    mobileDownloadPhotoBtn.classList.add('hidden');

    updateSigPreview();
  });

  // --- 3. PHOTO UPLOAD & RENDER ---
  setupDropzone(photoDropzone, photoFileInput, (img) => {
    loadPhotoSource(img);
  });

  if (loadSamplePhotoBtn) {
    loadSamplePhotoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      generateSamplePhoto((img) => loadPhotoSource(img));
    });
  }

  if (changePhotoBtn) {
    changePhotoBtn.addEventListener('click', () => {
      photoFileInput.click();
    });
  }

  function loadPhotoSource(img) {
    currentPhotoImg = img;
    photoCropperImg.src = img.src;

    photoDropzone.classList.add('hidden');
    cropperWrapperPhoto.classList.remove('hidden');
    if (photoToolbar) photoToolbar.classList.remove('hidden');

    CropperManager.initPhotoCropper(photoCropperImg, () => {
      updatePhotoPreview();
    });
    updatePhotoPreview();
  }

  candidateNameInput.addEventListener('input', () => updatePhotoPreview());
  dateTakenInput.addEventListener('change', () => updatePhotoPreview());

  if (photoRotateBtn) {
    photoRotateBtn.addEventListener('click', () => {
      CropperManager.rotatePhoto(90);
      updatePhotoPreview();
    });
  }

  async function updatePhotoPreview() {
    if (!currentPhotoImg) {
      const ctx = photoCanvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 150, 200);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No Photo Loaded', 75, 100);
      return;
    }

    const cropData = CropperManager.getPhotoCropData();
    const candidateName = candidateNameInput.value;
    const dateTaken = dateTakenInput.value;

    CanvasProcessor.renderPhoto(photoCanvas, currentPhotoImg, cropData, candidateName, dateTaken);

    const result = await IterativeCompressor.compress(photoCanvas, 30, 'photo');
    currentPhotoBlob = result.blob;

    photoSizeBadge.textContent = result.formattedSize;

    if (result.fitsRequirements) {
      photoStatusBadge.className = 'badge-status';
      photoStatusBadge.innerHTML = '✓ PSC Compliant (Under 30 KB)';
    } else {
      photoStatusBadge.className = 'badge-status';
      photoStatusBadge.style.background = '#fef2f2';
      photoStatusBadge.style.color = '#dc2626';
      photoStatusBadge.innerHTML = '⚠ Exceeds 30 KB Limit';
    }

    triggerCanvasAnimation(photoCanvasFrame);
  }

  // --- 4. SIGNATURE UPLOAD & RENDER ---
  setupDropzone(sigDropzone, sigFileInput, (img) => {
    loadSigSource(img);
  });

  if (loadSampleSigBtn) {
    loadSampleSigBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      generateSampleSignature((img) => loadSigSource(img));
    });
  }

  if (changeSigBtn) {
    changeSigBtn.addEventListener('click', () => {
      sigFileInput.click();
    });
  }

  function loadSigSource(img) {
    currentSigImg = img;
    sigCropperImg.src = img.src;

    sigDropzone.classList.add('hidden');
    cropperWrapperSig.classList.remove('hidden');
    if (sigToolbar) sigToolbar.classList.remove('hidden');

    CropperManager.initSignatureCropper(sigCropperImg, () => {
      updateSigPreview();
    });
    updateSigPreview();
  }

  sigContrastSlider.addEventListener('input', (e) => {
    sigContrastVal.textContent = `${e.target.value}%`;
    updateSigPreview();
  });

  if (sigRotateBtn) {
    sigRotateBtn.addEventListener('click', () => {
      CropperManager.rotateSignature(90);
      updateSigPreview();
    });
  }

  async function updateSigPreview() {
    if (!currentSigImg) {
      const ctx = sigCanvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 150, 100);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No Signature Loaded', 75, 50);
      return;
    }

    const cropData = CropperManager.getSignatureCropData();
    const contrastVal = parseInt(sigContrastSlider.value, 10);

    CanvasProcessor.renderSignature(sigCanvas, currentSigImg, cropData, contrastVal);

    const result = await IterativeCompressor.compress(sigCanvas, 30, 'sig');
    currentSigBlob = result.blob;

    sigSizeBadge.textContent = result.formattedSize;

    if (result.fitsRequirements) {
      sigStatusBadge.className = 'badge-status';
      sigStatusBadge.innerHTML = '✓ PSC Compliant (Under 30 KB)';
    } else {
      sigStatusBadge.className = 'badge-status';
      sigStatusBadge.style.background = '#fef2f2';
      sigStatusBadge.style.color = '#dc2626';
      sigStatusBadge.innerHTML = '⚠ Exceeds 30 KB Limit';
    }

    triggerCanvasAnimation(sigCanvasFrame);
  }

  function triggerCanvasAnimation(frameElement) {
    if (!frameElement) return;
    frameElement.classList.remove('updated');
    void frameElement.offsetWidth;
    frameElement.classList.add('updated');
  }

  // --- 5. DOWNLOAD ACTIONS (Mobile & Desktop) ---
  const handlePhotoDownload = () => {
    if (!currentPhotoBlob || currentPhotoBlob.size === 0) {
      alert('Please upload or select a photo first!');
      return;
    }
    const rawName = candidateNameInput.value.trim() || 'Candidate';
    const cleanName = rawName.replace(/[^a-zA-Z0-9]/g, '_');
    triggerDownload(currentPhotoBlob, `Kerala_PSC_Photo_${cleanName}.jpg`);
  };

  const handleSigDownload = () => {
    if (!currentSigBlob || currentSigBlob.size === 0) {
      alert('Please upload or select a signature first!');
      return;
    }
    const rawName = candidateNameInput.value.trim() || 'Candidate';
    const cleanName = rawName.replace(/[^a-zA-Z0-9]/g, '_');
    triggerDownload(currentSigBlob, `Kerala_PSC_Signature_${cleanName}.jpg`);
  };

  mobileDownloadPhotoBtn.addEventListener('click', handlePhotoDownload);
  desktopDownloadPhotoBtn.addEventListener('click', handlePhotoDownload);

  mobileDownloadSigBtn.addEventListener('click', handleSigDownload);
  desktopDownloadSigBtn.addEventListener('click', handleSigDownload);

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // --- 6. DROPZONE SETUP WITH FILE VALIDATION & A11Y ---
  function setupDropzone(dropzoneEl, fileInputEl, onImageLoaded) {
    dropzoneEl.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') {
        fileInputEl.click();
      }
    });

    // Keyboard accessibility trigger (Enter / Space)
    dropzoneEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInputEl.click();
      }
    });

    fileInputEl.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        validateAndLoadFile(e.target.files[0], onImageLoaded);
      }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzoneEl.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzoneEl.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzoneEl.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzoneEl.classList.remove('drag-over');
      });
    });

    dropzoneEl.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files && files[0]) {
        validateAndLoadFile(files[0], onImageLoaded);
      }
    });
  }

  function validateAndLoadFile(file, callback) {
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }
    // Check file size (Warn if > 25MB)
    if (file.size > 25 * 1024 * 1024) {
      alert('The selected file is very large (> 25 MB). Processing may take a few seconds.');
    }
    handleFile(file, callback);
  }

  function handleFile(file, callback) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => callback(img);
      img.onerror = () => alert('Unable to load image. File may be corrupted.');
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Initial Placeholder Setup
  updatePhotoPreview();
  updateSigPreview();

  // --- 7. DEMO SAMPLE GENERATORS ---
  function generateSamplePhoto(callback) {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 440;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, 400, 440);

    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(200, 160, 75, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(200, 430, 160, Math.PI, 0);
    ctx.fill();

    const img = new Image();
    img.onload = () => callback(img);
    img.src = canvas.toDataURL('image/png');
  }

  function generateSampleSignature(callback) {
    const canvas = document.createElement('canvas');
    canvas.width = 450;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 450, 300);

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(50, 160);
    sCtx = ctx;
    sCtx.bezierCurveTo(90, 80, 130, 220, 170, 140);
    sCtx.bezierCurveTo(200, 80, 240, 200, 280, 150);
    sCtx.bezierCurveTo(310, 120, 350, 180, 400, 140);
    sCtx.stroke();

    sCtx.beginPath();
    sCtx.moveTo(60, 210);
    sCtx.quadraticCurveTo(240, 190, 390, 220);
    sCtx.stroke();

    const img = new Image();
    img.onload = () => callback(img);
    img.src = canvas.toDataURL('image/png');
  }
});
