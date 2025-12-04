# Cordolium Live AI Interface - Filming Guide

## Quick Start for Film Production

### Access the Live Interface
Open `live-interface.html` in a browser or navigate to:
```
http://localhost:8000/live-interface.html
```

### Initial Setup
1. Click **"Allow"** when prompted for microphone access
2. Wait for "Connected" status in top right
3. The interface will greet you automatically
4. Press **D** to open Director Controls panel

## Interface Overview

### Main Components

#### 1. **Visualization Area** (Center)
- Live audio waveform that responds to voice input
- Circular visualization wraps around center orb
- Orb pulses and scales with audio intensity

#### 2. **Response Display** (Bottom)
- Shows AI responses with typing animation
- Text appears character-by-character
- Optional voice synthesis playback

#### 3. **Status Indicator** (Top Right)
- **Yellow dot + "Connecting..."** - Initializing
- **Green dot + "Connected"** - Ready for filming
- **Red dot + "Connection Failed"** - Error state

#### 4. **Director Controls** (Hidden Panel)
- Press **D** to toggle
- Full manual control for film crew
- See keyboard shortcuts below

## States and Visual Feedback

### State 1: Idle
- Gentle pulsing orb
- Waiting for voice input
- No state overlay visible

### State 2: Listening
- "LISTENING..." overlay appears
- Waveform actively responds to voice
- Orb scales with audio levels

### State 3: Processing
- "PROCESSING..." overlay appears
- Subtle animations continue
- Brief pause (1.5 seconds default)

### State 4: Responding
- Overlay disappears
- Text types out in response area
- Optional voice playback
- Returns to Idle after completion

## Director Controls (Press D)

### Response Controls
- **Next Response** (Space) - Trigger next scripted response
- **Reset** (R) - Start sequence from beginning
- **Toggle Loop** (L) - Enable/disable response looping

### Quick Responses (1-9 Keys)
1. **Greeting** - "Hello! What's on your mind?"
2. **Introduction** - "I'm Simon. Nice to meet you!"
3. **Assistance** - "I can help with calendar management..."
4. **Location** - "Here are coffee shops near you..."
5. **Understanding** - "I understand. Tell me more..."
6. **Idle** - "What's on your mind?"

### Settings
- **Microphone Sensitivity** - Adjust voice detection threshold
- **Response Delay** - Time between voice end and response (500-5000ms)
- **Enable Voice Synthesis** - Toggle text-to-speech
- **Mute Audio** - Silence microphone input

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **D** | Toggle Director Panel |
| **Space** | Trigger next response |
| **1-9** | Jump to specific responses |
| **R** | Reset sequence |
| **I** | Toggle idle state |
| **P** | Toggle processing state |
| **M** | Toggle mute |
| **L** | Toggle loop mode |
| **V** | Cycle visualization types |
| **T** | Increase response delay by 500ms |

## Filming Workflow

### Setup (Before Filming)
1. Open `live-interface.html`
2. Allow microphone access
3. Press **D** to open Director Controls
4. Adjust microphone sensitivity for actor's voice level
5. Test a few responses to verify timing
6. Close Director Panel (press **D** again)

### During Filming

#### For Scripted Scenes:
1. Use **Space** to trigger next response in sequence
2. Actor reads their line
3. Interface automatically detects voice end
4. AI responds after configured delay
5. Repeat for next line

#### For Background/B-Roll Shots:
1. Enable **Loop** mode (press **L**)
2. Let interface cycle through responses automatically
3. Actor can interact naturally

#### Manual Control:
1. Press **1-9** to jump to specific responses
2. Press **P** to show "Processing" state
3. Press **I** to return to idle

### Common Filming Scenarios

#### Scene: First Interaction
```
1. Open live-interface.html
2. Click "Allow" on microphone prompt
3. Wait for auto-greeting: "Hello! What's on your mind?"
4. Actor delivers line
5. Press Space to trigger next response
```

#### Scene: Active Conversation
```
1. Press D for controls
2. Load sequence or use manual triggers
3. Press Space for each actor line
4. Adjust timing with T key if needed
```

#### Scene: Close-up on AI Interface
```
1. Mute microphone (press M)
2. Use number keys (1-9) to trigger specific responses
3. Beautiful visualization continues
4. Perfect for screen capture shots
```

## Troubleshooting

### Microphone Not Working
- Check browser permissions (usually icon in address bar)
- Try refreshing page and allowing again
- Test in Chrome/Edge (best Web Audio API support)

### Responses Not Triggering
- Check that you're in "Connected" state (green dot)
- Try manual trigger with Space bar
- Adjust microphone sensitivity in Director Panel

### Voice Synthesis Not Working
- Check "Enable Voice Synthesis" in Director Panel
- Some browsers load voices asynchronously (wait 2-3 seconds)
- Safari has limited voice options

### Visualization Not Smooth
- Close other browser tabs
- Disable browser extensions
- Use hardware-accelerated browser (Chrome recommended)

## Technical Details

### Browser Requirements
- **Best**: Chrome, Edge (Chromium-based)
- **Good**: Firefox
- **Limited**: Safari (voice synthesis may be limited)

### Performance
- Target: 60fps animations
- Hardware acceleration enabled
- Canvas-based visualizations
- Optimized for 1080p/4K recording

### Audio Processing
- Sample rate: 48kHz
- FFT size: 2048
- Smoothing: 0.8
- Voice activity threshold: 30 (adjustable)

## Customization

### Editing Responses
Edit `data/responses.json`:
```json
{
  "responses": {
    "your_category": [
      "Response 1",
      "Response 2"
    ]
  }
}
```

### Creating Scene Sequences
Add to `data/responses.json`:
```json
{
  "sequences": {
    "your_scene": [
      {
        "trigger": "start",
        "response_type": "greeting",
        "response_index": 0,
        "delay": 2000
      }
    ]
  }
}
```

### Adjusting Visualization
Edit `visualizations/waveform-viz.js`:
- Change colors
- Adjust orb size
- Modify animation speeds

## Tips for Best Results

### Audio
- Use good quality microphone
- Minimize background noise
- Adjust sensitivity for room acoustics
- Test voice levels before filming

### Lighting
- Dark interface works well with dramatic lighting
- Consider screen reflection on actor
- Adjust screen brightness if needed

### Camera
- Capture at 1080p or 4K
- Use tripod for steady screen capture
- Consider both over-shoulder and direct screen shots

### Performance
- Close unnecessary applications
- Disable notifications
- Use wired internet if possible
- Test full workflow before filming

## Support During Production

If you encounter issues during filming:

1. **Quick Fix**: Refresh page (Cmd/Ctrl + R)
2. **Reset**: Close and reopen browser
3. **Backup**: Use static site (index.html) with manual controls

## File Structure Reference

```
cordoliumHTML/
├── live-interface.html          # Main filming interface
├── data/
│   └── responses.json           # All AI responses and sequences
├── audio/
│   ├── audio-processor.js       # Microphone handling
│   └── response-manager.js      # Response system
├── visualizations/
│   └── waveform-viz.js         # Audio visualization
├── controls/
│   └── director-panel.js       # Manual controls
├── js/
│   └── live-interface.js       # Main controller
└── css/
    └── live-interface.css      # Interface styling
```

## Credits

**Film Prop Created For**: Kyle's Short Film
**Technical Implementation**: Jose (Web Designer/Developer)
**Purpose**: Authentic AI voice assistant interface for on-camera use

---

Good luck with your production! 🎬
