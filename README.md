# 🏛️ PSC Image Studio - Kerala PSC Photo & Signature Resizer

**PSC Image Studio** is a 100% free, offline, privacy-focused Progressive Web Application (PWA) designed to format candidate photographs and signatures to meet official **Kerala Public Service Commission (Kerala PSC)** upload requirements.

---

## 🌟 Key Features

- **Photo Formatting**: Resizes photographs to **150 × 200 pixels** (JPG format) with Candidate Name (in UPPERCASE) and Date Taken rendered on a white bottom strip.
- **Signature Formatting**: Resizes signatures to **150 × 100 pixels** (JPG format) with paper background cleanup slider.
- **Strict File Size Guarantee**: Iterative binary search JPEG compression guarantees file sizes strictly **≤ 30 KB** (30,720 bytes).
- **100% Offline & Private**: Powered entirely by client-side HTML5 Canvas API and JavaScript. No server, no image uploads, zero privacy risk.
- **PWA & Standalone Support**: Installable on Android, iOS, and Desktop. Service worker asset caching enables complete offline functionality.
- **Multi-Device Responsive**: Clean UI optimized for Mobile, Tablet, and Desktop displays with Light & Dark theme support.

---

## 🚀 One-Click Deployment Options

### 1. GitHub Pages
1. Push this repository to GitHub.
2. Go to **Settings > Pages**.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

### 2. Vercel
1. Import repository on [Vercel](https://vercel.com).
2. Use default static deployment settings (configuration pre-built in `vercel.json`).
3. Click **Deploy**.

### 3. Netlify
1. Import repository on [Netlify](https://netlify.com).
2. Set build directory to `.` (configuration pre-built in `netlify.toml`).
3. Click **Deploy**.

---

## 📁 Repository Structure

```
.
├── index.html              # HTML Shell with SEO OpenGraph & ARIA
├── css/
│   └── styles.css          # Dual Theme Stylesheet (Light & Dark)
├── js/
│   ├── canvas-processor.js # Clamped Canvas Renderer (150x200 & 150x100)
│   ├── compressor.js       # Iterative JPEG Compression (<= 30KB)
│   ├── cropper-handler.js  # CropperJS Aspect Ratio Locks
│   └── app.js              # PWA Service Worker & UI Controller
├── manifest.json           # Web App Manifest for PWA
├── sw.js                   # Service Worker Offline Asset Caching
├── vercel.json             # Vercel Deployment Configuration
├── netlify.toml            # Netlify Deployment Configuration
├── .gitignore              # Git Exclusions
└── docs/
    └── Kerala PSC-compliant image processing tool.md
```

---

## 🔒 Privacy Notice
PSC Image Studio runs 100% locally inside the user's browser. Photographs and signatures are processed in-memory using HTML5 Canvas and are never transmitted to any external server or third-party service.
