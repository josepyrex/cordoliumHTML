# Cordolium - Film Prop Quick Guide

## Three Interfaces for Different Scenes

### 1. **Static Website** (`index.html`)
Use for: Establishing shots, website overview
- Professional marketing site with animations
- No interaction needed
- Just open and display

### 2. **Voice Interface** (`live-interface.html`) ⭐
Use for: Beach house voice conversation scenes
- Real microphone visualization (waveform responds to voice)
- Pre-scripted responses triggered by operator
- Press **SPACE** to show next response
- **No actual AI** - just visual feedback

### 3. **Text Chat** (`text-interface.html`) ⭐
Use for: Phone messaging scenes
- Mobile chat interface
- Actor types naturally (text doesn't matter)
- Press **ENTER** to trigger AI response
- **No actual AI** - just pre-scripted messages

---

## Voice Interface - Quick Start

### Access
```
Open: live-interface.html
```

### Setup (30 seconds)
1. Click "Allow" for microphone
2. Wait for green "Connected" status
3. Press **D** to see operator controls
4. You're ready!

### During Filming
- Actor speaks naturally to screen
- Waveform visualizes their voice automatically
- Operator presses **SPACE** to trigger next response
- Response appears with typing animation
- Cycle continues

### Keyboard Controls for Operator
- **SPACE** - Show next response
- **1-9** - Jump to specific responses
- **R** - Reset to beginning
- **P** - Show "Processing..." state
- **I** - Return to idle state
- **D** - Toggle operator panel

### What Actor Sees
1. Idle state (gentle pulsing orb)
2. Speaks → waveform responds (listening state)
3. Operator triggers → "Processing..." overlay
4. Text appears: "Hello! What is on your mind?"
5. Returns to idle, ready for next line

---

## Text Chat Interface - Quick Start

### Access
```
Open: text-interface.html
```

### Setup (10 seconds)
1. Page loads with mobile chat view
2. Press **ESC** to see operator controls
3. Ready to film!

### During Filming
- Actor types anything in input field
- Operator presses **ENTER** to trigger response
- "Simon is typing..." appears
- Pre-written response types out
- Actor continues typing
- Repeat

### Keyboard Controls for Operator
- **ENTER** - Trigger next AI response
- **1** - "Call disconnected" message
- **2** - Coffee shop locations
- **3** - Understanding message
- **4** - Assistance message
- **T** - Show/hide "typing..." indicator
- **C** - Clear chat
- **R** - Reset sequence
- **ESC** - Toggle operator panel

### What Actor Sees
- Mobile chat interface (looks like iMessage)
- Their typed messages appear (any text works)
- "Simon is typing..." indicator
- AI response types out character-by-character
- Natural messaging flow

---

## Pre-Production Checklist

### Voice Interface
- [ ] Test microphone permission in browser
- [ ] Verify waveform responds to test voice
- [ ] Operator practices triggering responses
- [ ] Test response timing with actor
- [ ] Adjust "Response Delay" if needed (Director Panel)

### Text Chat Interface
- [ ] Verify mobile view looks good on camera
- [ ] Test typing speed (adjustable in operator panel)
- [ ] Practice timing with actor's typing
- [ ] Load correct sequence for scene

---

## Filming Day Workflow

### Voice Scene
```
1. Open live-interface.html
2. Click "Allow" microphone
3. Operator has laptop with Director Panel (press D)
4. Actor speaks line
5. Operator sees cue from director
6. Operator presses SPACE
7. Response appears on screen
8. Repeat for next line
```

### Text Scene
```
1. Open text-interface.html on phone/tablet mockup
2. Actor types in chat (gibberish is fine)
3. Operator watches for director's cue
4. Operator presses ENTER
5. "Simon is typing..." appears
6. Response types out automatically
7. Actor reacts naturally
8. Repeat
```

---

## Common Issues & Fixes

### Microphone Not Working
- Check browser permissions (address bar icon)
- Refresh page and allow again
- Use Chrome or Edge (best support)

### Responses Not Appearing
- Check operator pressed correct key
- Verify sequence not at end (press R to reset)
- Check Director Panel is not hidden

### Timing Off
- Adjust "Response Delay" in Director Panel
- Practice a few takes to find rhythm
- Operator can watch director for cue

### Wrong Response Showed
- Press R to reset sequence
- Use number keys (1-9) to jump to specific response
- Clear and start over if needed

---

## Customizing for Your Script

### Edit Responses
File: `data/responses.json`

```json
{
  "responses": {
    "your_category": [
      "Your AI response text here"
    ]
  }
}
```

### Create Scene Sequence
File: `data/responses.json`

```json
{
  "sequences": {
    "your_scene_name": [
      {
        "response_type": "greeting",
        "response_index": 0,
        "delay": 2000
      }
    ]
  }
}
```

### Load Your Sequence
1. Open Director Panel (press D or ESC)
2. Find "Sequence" dropdown
3. Select your scene name
4. Press R to reset to start

---

## Important Notes

### What This IS:
✓ Visual prop that looks like AI
✓ Real microphone visualization
✓ Pre-scripted responses on cue
✓ Complete operator control
✓ Perfect for camera

### What This is NOT:
✗ No actual AI processing
✗ No speech recognition
✗ No voice synthesis (add in post)
✗ No internet required
✗ No unpredictability

### Voice-Over Approach:
- Actor speaks lines naturally on set
- Interface shows visual feedback
- Operator triggers responses on cue
- Voice-over added in post-production
- Perfect timing achieved in edit

---

## Technical Specs

### Browser Requirements
- **Best**: Chrome, Edge (Chromium)
- **Good**: Firefox
- **Avoid**: Safari (limited support)

### Screen Recording
- 1080p or 4K recommended
- 60fps for smooth animations
- Disable browser notifications
- Use fullscreen mode (F11)

### Microphone
- Any microphone works
- Adjust sensitivity in Director Panel
- Test audio levels before filming
- Built-in laptop mic is fine

---

## Quick Reference

| Scene Type | File | Operator Key | What Happens |
|------------|------|--------------|--------------|
| Voice Intro | live-interface.html | SPACE | Next response |
| Voice Quick | live-interface.html | 1-9 | Specific response |
| Text Chat | text-interface.html | ENTER | Next message |
| Text Quick | text-interface.html | 1-4 | Specific message |

---

## Support

If something isn't working:
1. Refresh the page (Cmd/Ctrl + R)
2. Check browser console for errors (F12)
3. Try different browser
4. Restart browser completely

---

**Ready to film? Open the interface and press the operator control key. That's it! 🎬**

*Film Prop Created For: Kyle's Short Film*
*Technical Implementation: Jose*
