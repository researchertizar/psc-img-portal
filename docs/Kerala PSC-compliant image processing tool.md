The key is to treat it as a **Kerala PSC-compliant image processing tool**, not just a generic image resizer.

### **Core functionality**

**Input**

* Upload photograph  
* Enter candidate name  
* Enter date photograph was taken  
* Upload signature separately

**Photo processing**

* Crop/fit photograph to **150 × 200 px**  
* White background  
* Add a **white rectangular strip at the bottom**  
* Print:  
  * Candidate name  
  * Date taken  
* Export as **JPG**  
* Ensure final file is **≤ 30 KB**  
* Show exact dimensions and file size before download

**Signature processing**

* Crop/fit to **150 × 100 px**  
* White background  
* Export as **JPG**  
* Automatically compress until **≤ 30 KB**  
* Show dimensions \+ final size

### **Recommended architecture**

For this particular project, I would **not use a backend at all**.

HTML  
 ├── Upload Photo  
 ├── Name  
 ├── Date  
 ├── Upload Signature  
 └── Preview / Download

CSS  
 └── Responsive UI

Vanilla JavaScript  
 ├── File handling  
 ├── Canvas image processing  
 ├── Cropping / resizing  
 ├── White-background generation  
 ├── Text rendering  
 ├── JPEG compression  
 ├── File-size validation  
 └── Download

Browser Canvas API  
 └── Actual image processing

That gives you:

**No server → No database → No storage cost → No privacy issue → No upload of PSC photographs to your infrastructure.**

In fact, for a PSC photograph tool, **local browser processing is a major selling point** because users' photographs and signatures never need to leave their device.

### **One important technical issue**

Simply doing:

resize → JPEG quality 80 → download

is **not sufficient**.

JPEG quality doesn't guarantee a file under 30 KB.

Instead, implement an iterative compression algorithm:

Process image  
      ↓  
Encode JPEG  
      ↓  
Check file size  
      ↓  
≤ 30 KB?  
   ↙       ↘  
 YES        NO  
 ↓          ↓  
Done     Reduce quality  
            ↓  
         Encode again  
            ↓  
         Check again

For example:

quality \= 0.90  
        ↓  
quality \= 0.80  
        ↓  
quality \= 0.70  
        ↓  
quality \= 0.60  
        ↓  
...

And if necessary, slightly reduce the amount of image content/complexity while **never violating the required final dimensions**.

### **Better UX**

I would make the application essentially a **two-step workflow**:

**01 — Photograph**

┌─────────────────────────────┐  
│       Upload Photograph     │  
│                             │  
│       \[ Drag & Drop \]       │  
│                             │  
└─────────────────────────────┘

Name:       \[\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\]

Date Taken: \[ DD / MM / YYYY \]

\[ Process Photograph \]

        Preview  
     ┌───────────┐  
     │           │  
     │   PHOTO   │  
     │           │  
     │           │  
     ├───────────┤  
     │ NAME      │  
     │ DATE      │  
     └───────────┘

150 × 200 px | 27.4 KB ✓

\[ Download JPG \]

**02 — Signature**

┌─────────────────────────────┐  
│       Upload Signature      │  
│                             │  
│       \[ Drag & Drop \]       │  
└─────────────────────────────┘

        Preview

150 × 100 px | 18.2 KB ✓

\[ Download JPG \]

### **Features worth adding**

Since this is a small tool, these are inexpensive to implement:

* Drag & drop  
* Mobile camera/gallery upload  
* Image preview  
* Automatic cropping  
* Manual crop adjustment  
* Automatic compression  
* File-size indicator  
* Green **"PSC Ready"** indicator  
* Red warning if requirements aren't satisfied  
* One-click download  
* Reset button  
* Mobile-first interface  
* Dark/light theme  
* Completely offline processing after page load  
* No image upload to server  
* EXIF metadata removal  
* JPEG-only final output

### **Recommended technology**

I'd keep it extremely simple:

| Component | Choice |
| ----- | ----- |
| UI | HTML |
| Styling | CSS |
| Logic | Vanilla JavaScript |
| Processing | Canvas API |
| Image compression | Browser JPEG encoding |
| Storage | None |
| Backend | **None** |
| Database | **None** |
| Authentication | **None** |
| Hosting | Cloudflare Pages / GitHub Pages |
| Cost | **₹0** |

You don't need React, Node.js, Python, Firebase, Supabase, Neon, or Cloudflare Workers for this.

The browser itself is effectively the **image-processing engine**.

### **One thing I would verify before implementation**

The requirements you've given should be treated as the project's specification, but because this is a **government application requirement**, we should verify the current Kerala PSC official instructions before hard-coding them into the application. Requirements can change.

If we're going to build this properly, the next step should be to define the **exact PSC image-processing specification \+ UI/UX \+ technical implementation architecture**, including the tricky parts such as **automatic cropping, name/date strip dimensions, JPEG compression under 30 KB, and validation**.

