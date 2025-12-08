# iPhone Notification Guide

## Overview

I've created a **realistic iPhone notification system** that looks and behaves exactly like a real iOS notification! Perfect for your film's authenticity.

---

## 🎬 What It Looks Like

The notification:
- ✅ Slides down from the top (just like iOS)
- ✅ Has blur/frosted glass effect (iOS style)
- ✅ Shows app icon, name, title, and message
- ✅ Can be dismissed by swiping up
- ✅ Auto-dismisses after 5 seconds (customizable)
- ✅ Fully responsive for all iPhones
- ✅ Supports iPhone notch/Dynamic Island
- ✅ Optional notification sound

---

## 📱 How to Use

### Quick Setup (3 Steps)

**1. Add CSS to your page's `<head>`:**
```html
<link rel="stylesheet" href="css/iphone-notification.css">
```

**2. Add JavaScript before closing `</body>`:**
```html
<script src="js/iphone-notification.js"></script>
```

**3. Trigger the notification:**
```html
<script>
    // For Simon (voice demo)
    showSimonNotification();

    // OR for Matthew (text demo)
    showMatthewNotification();
</script>
```

---

## 🎯 Pre-Made Notifications

### Simon Notification (Voice Demo)
```javascript
showSimonNotification();
```

**Displays:**
- App Name: "Cordolium"
- Title: "Simon"
- Message: "wants to chat!"
- Icon: "S"

---

### Matthew Notification (Text Demo)
```javascript
showMatthewNotification();
```

**Displays:**
- App Name: "Messages"
- Title: "Matthew"
- Message: "wants to chat!"
- Icon: "M"

---

## 🎨 Custom Notifications

Create your own notification with custom options:

```javascript
new iPhoneNotification({
    appName: 'Cordolium',       // App name shown
    title: 'Simon',             // Main title
    message: 'wants to chat!',  // Notification message
    icon: 'S',                  // Letter or image URL
    time: 'now',                // Time text
    autoShow: true,             // Auto-show on creation
    showDelay: 1000,            // Delay before showing (ms)
    autoDismiss: true,          // Auto-dismiss enabled
    dismissDelay: 5000,         // Time before auto-dismiss (ms)
    sound: false,               // Play notification sound
    onClick: () => {            // When tapped
        console.log('Clicked!');
        // Navigate somewhere:
        // window.location.href = 'live-interface.html';
    },
    onDismiss: () => {          // When dismissed
        console.log('Dismissed!');
    }
});
```

---

## 📄 Usage Examples

### Example 1: Homepage with Simon Notification

**Add to `index.html` before `</body>`:**

```html
<!-- iPhone Notification -->
<link rel="stylesheet" href="css/iphone-notification.css">
<script src="js/iphone-notification.js"></script>
<script>
    // Show Simon notification after 2 seconds
    setTimeout(() => {
        showSimonNotification();
    }, 2000);
</script>
```

---

### Example 2: Text Demo with Matthew Notification

**Add to `text-interface.html` before `</body>`:**

```html
<!-- iPhone Notification -->
<link rel="stylesheet" href="css/iphone-notification.css">
<script src="js/iphone-notification.js"></script>
<script>
    // Show Matthew notification immediately
    showMatthewNotification();
</script>
```

---

### Example 3: Custom Notification with Image Icon

```html
<script>
    new iPhoneNotification({
        appName: 'Cordolium',
        title: 'New Message',
        message: 'You have 3 unread messages',
        icon: 'assets/images/logo-icon.png', // Use image instead of letter
        time: '2m ago',
        showDelay: 500,
        dismissDelay: 7000,
        sound: true, // Play sound
        onClick: () => {
            window.location.href = 'text-interface.html';
        }
    });
</script>
```

---

### Example 4: Notification on Button Click

```html
<button onclick="showSimonNotification()">
    Show Simon Notification
</button>
```

---

## ⚙️ Customization Options

### All Available Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `appName` | string | 'Cordolium' | App name displayed |
| `title` | string | 'Simon' | Main notification title |
| `message` | string | 'wants to chat!' | Notification message |
| `icon` | string | 'C' | Letter or image URL |
| `time` | string | 'now' | Time text |
| `autoShow` | boolean | true | Auto-show on creation |
| `showDelay` | number | 1000 | Delay before showing (ms) |
| `autoDismiss` | boolean | true | Auto-dismiss enabled |
| `dismissDelay` | number | 5000 | Time visible (ms) |
| `sound` | boolean | false | Play notification sound |
| `onClick` | function | null | Callback when clicked |
| `onDismiss` | function | null | Callback when dismissed |

---

## 🎬 Filming Tips

### Best Practices

1. **Timing:**
   - Use `showDelay` to control when notification appears
   - 1000ms (1 second) is usually good
   - 2000ms (2 seconds) for homepage

2. **Duration:**
   - Default 5 seconds is realistic
   - Increase to 7-10 seconds for filming (easier to capture)
   - Set `autoDismiss: false` to keep it on screen

3. **Manual Control:**
   ```javascript
   // Create but don't auto-show
   const notification = new iPhoneNotification({
       autoShow: false,
       autoDismiss: false
   });

   // Show when ready
   notification.show();

   // Dismiss when needed
   notification.dismiss();
   ```

---

## 🎥 Filming Scenarios

### Scenario 1: Homepage Discovery
**Goal:** Visitor sees notification, clicks it, gets drawn in

```javascript
// On homepage
new iPhoneNotification({
    appName: 'Cordolium',
    title: 'Simon',
    message: 'wants to chat!',
    showDelay: 2000,      // Wait 2 seconds
    dismissDelay: 8000,   // Stay for 8 seconds
    onClick: () => {
        // Navigate to voice demo
        window.location.href = 'live-interface.html';
    }
});
```

---

### Scenario 2: Persistent Notification
**Goal:** Keep notification visible for entire scene

```javascript
new iPhoneNotification({
    title: 'Matthew',
    message: 'I miss you...',
    autoShow: true,
    autoDismiss: false,  // Never auto-dismiss
    showDelay: 1000
});
```

---

### Scenario 3: Multiple Notifications
**Goal:** Show several notifications in sequence

```javascript
// First notification
setTimeout(() => {
    new iPhoneNotification({
        title: 'Simon',
        message: 'Are you there?',
        dismissDelay: 3000
    });
}, 1000);

// Second notification
setTimeout(() => {
    new iPhoneNotification({
        title: 'Simon',
        message: 'I need to talk to you...',
        dismissDelay: 3000
    });
}, 5000);

// Third notification
setTimeout(() => {
    new iPhoneNotification({
        title: 'Simon',
        message: 'Please respond.',
        dismissDelay: 5000
    });
}, 9000);
```

---

## 🎭 Advanced: Dramatic Effect

### Urgent/Emotional Notification

```javascript
new iPhoneNotification({
    appName: 'Messages',
    title: 'Matthew',
    message: 'I love you. I always will.',
    time: '3:47 AM',
    showDelay: 500,
    dismissDelay: 10000,  // Stay longer
    sound: true,          // Play sound
    onClick: () => {
        // Dramatic reveal
        window.location.href = 'text-interface.html';
    }
});
```

---

## 📱 Swipe to Dismiss

Users can swipe up on the notification to dismiss it (just like iOS):

1. **Touch notification**
2. **Swipe up**
3. Notification slides away

This adds interactivity and realism!

---

## 🔊 Notification Sound

Enable sound for more realism:

```javascript
new iPhoneNotification({
    sound: true  // Plays a simple beep
});
```

**Note:** Sound is subtle (not annoying). You can replace it with a custom sound file if needed.

---

## 🎨 Appearance Customization

### Dark Mode
The notification automatically adapts to dark mode if user's device is in dark mode.

### Icon Options

**Letter Icon:**
```javascript
icon: 'S'  // Shows letter S
icon: 'M'  // Shows letter M
icon: 'C'  // Shows letter C
```

**Image Icon:**
```javascript
icon: 'assets/images/logo-icon.png'
icon: 'https://example.com/icon.png'
```

---

## 🐛 Troubleshooting

### Notification not showing?
- Check console for JavaScript errors
- Make sure CSS and JS files are loaded
- Try increasing `showDelay`

### Notification off-screen?
- Check iPhone safe area is working
- Test on real iPhone for best results

### Touch not working?
- Make sure notification has `pointer-events: auto`
- Check z-index (should be 9999)

---

## 📋 Quick Integration Checklist

For **Homepage (index.html)**:
```html
<!-- Before </head> -->
<link rel="stylesheet" href="css/iphone-notification.css">

<!-- Before </body> -->
<script src="js/iphone-notification.js"></script>
<script>
    setTimeout(() => showSimonNotification(), 2000);
</script>
```

For **Voice Demo (live-interface.html)**:
```html
<!-- Before </head> -->
<link rel="stylesheet" href="css/iphone-notification.css">

<!-- Before </body> -->
<script src="js/iphone-notification.js"></script>
<script>
    setTimeout(() => showSimonNotification(), 1000);
</script>
```

For **Text Demo (text-interface.html)**:
```html
<!-- Before </head> -->
<link rel="stylesheet" href="css/iphone-notification.css">

<!-- Before </body> -->
<script src="js/iphone-notification.js"></script>
<script>
    setTimeout(() => showMatthewNotification(), 1000);
</script>
```

---

## 🎬 Ready to Film!

The notification system is production-ready and looks incredibly realistic. It will add a lot of authenticity to your short film!

**Key Features:**
- ✅ Looks exactly like iOS notifications
- ✅ Smooth animations
- ✅ Swipe to dismiss
- ✅ Fully customizable
- ✅ Works on all iPhones
- ✅ Perfect for filming

Let me know if you want any tweaks to the appearance, timing, or behavior!
