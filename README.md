# Cordolium Website - Film Prop

## Overview
This is the complete website and AI interface prop for the Cordolium AI company featured in the short film. It includes both a static marketing website and a fully functional live AI voice interface for filming.

## Two Modes

### 1. Static Website (`index.html`)
Professional marketing site for establishing shots and overview scenes.

### 2. Live AI Interface (`live-interface.html`)
**⭐ MAIN FILMING INTERFACE ⭐**
Fully interactive AI voice assistant with real microphone integration, live audio visualization, and director controls for precise filming control.

**See [LIVE-INTERFACE-GUIDE.md](LIVE-INTERFACE-GUIDE.md) for complete filming instructions.**

## Setup Instructions

1. **Place your image assets in the correct folders:**
   - `assets/images/logo.png` - Main Cordolium logo
   - `assets/images/logo-white.png` - White version for dark backgrounds
   - `assets/images/logo-icon.png` - Icon-only version
   - `assets/images/favicon.ico` - Browser favicon

2. **Optional: Add custom fonts**
   - Place any custom font files in `assets/fonts/`
   - Update the CSS to reference them

3. **To run locally:**
   - Open `index.html` in a web browser
   - Or use a local server: `python -m http.server 8000`

## Features for Filming

### Key Interactive Elements
- **Microphone Permission Modal**: Triggered by "Start Talking" button
- **Voice Demo**: Rotating text simulating AI responses
- **Smooth Scrolling**: Professional navigation experience
- **Email Signup**: Simulated beta access registration

### Customization Points
- All text content can be modified in `index.html`
- Colors and styling in `css/styles.css`
- Animations and interactions in `js/main.js`

## Script-Specific Scenes

### Scene 1: User visits Cordolium.com
- Website plays retro-future music (add audio element if needed)
- Clean, professional landing page visible

### Scene 2: Microphone Permission
- Click "Start Talking" to trigger permission modal
- Modal matches the script's "Allow Cordolium to Access Microphone?" prompt

### Scene 3: Voice Interface
- Voice demo section shows animated orb
- Text rotates through Simon AI responses

## Technical Notes

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Performance**: Optimized animations for smooth filming
- **No Backend Required**: Everything runs client-side

## Directory Structure

```
cordoliumHTML/
│
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── images/
│   │   ├── logo.png                 # Main Cordolium logo
│   │   ├── logo-white.png           # White version for dark backgrounds
│   │   ├── logo-icon.png            # Icon only version
│   │   └── favicon.ico              # Browser favicon
│   └── fonts/                       # Optional custom fonts
│
└── README.md                         # This file
```

## Contact
For modifications or questions about the prop, contact Jose (Web Designer/Developer)

## Starting the Server:

  1. Open Terminal/Command Prompt
  - On Mac: Search for "Terminal" in Spotlight (Cmd+Space)
  - On Windows: Search for "Command Prompt" or "PowerShell"

  2. Navigate to your project folder:
  cd /Users/pyrexm4/Documents/businessClients/kylesShortFilm/cordoliumHTML

  3. Start the server:
  python3 -m http.server 8000

  4. Access the site:
  - Open your browser and go to: http://localhost:8000

  To Stop the Server:

  - Press Ctrl+C in the terminal

  Alternative (if python3 doesn't work):

  python -m http.server 8000

  Quick Access URLs:

  - Main page: http://localhost:8000
  - Voice Demo: http://localhost:8000/live-interface.html  (or press V on main page)
  - Text Demo: http://localhost:8000/text-interface.html  (or press T on main page)

---

*Film Production: Kyle's Short Film*
*Writer: Kyle Vasquez*
*Director: Verónica*
*Digital Props: Jose*
