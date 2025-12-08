/**
 * iPhone Lock Screen Controller
 * Realistic iOS lock screen with controllable notifications
 */

class LockScreen {
    constructor() {
        this.lockScreen = document.getElementById('lockScreen');
        this.currentTime = document.getElementById('currentTime');
        this.currentDate = document.getElementById('currentDate');
        this.statusTime = document.getElementById('statusTime');
        this.notificationContainer = document.getElementById('notificationContainer');
        this.directorControls = document.getElementById('directorControls');
        this.secretAccess = document.getElementById('secretAccess');

        // Control elements
        this.notificationDelay = document.getElementById('notificationDelay');
        this.contactName = document.getElementById('contactName');
        this.customFields = document.getElementById('customFields');
        this.customContactName = document.getElementById('customContactName');
        this.customAppName = document.getElementById('customAppName');
        this.customMessage = document.getElementById('customMessage');
        this.timeOverride = document.getElementById('timeOverride');
        this.triggerBtn = document.getElementById('triggerNotification');
        this.clearBtn = document.getElementById('clearNotifications');
        this.resetBtn = document.getElementById('resetScreen');
        this.closeBtn = document.getElementById('closeControls');

        // State
        this.tapCount = 0;
        this.tapTimeout = null;
        this.autoTriggerTimeout = null;

        this.init();
    }

    /**
     * Initialize lock screen
     */
    init() {
        this.updateClock();
        this.startClockUpdate();
        this.attachEventListeners();
        this.checkAutoTrigger();
    }

    /**
     * Update clock display
     */
    updateClock() {
        const now = new Date();

        // Time (12-hour format)
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const timeString = `${hours}:${minutes.toString().padStart(2, '0')}`;

        // Date
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const dayName = days[now.getDay()];
        const monthName = months[now.getMonth()];
        const date = now.getDate();
        const dateString = `${dayName}, ${monthName} ${date}`;

        // Update displays
        this.currentTime.textContent = timeString;
        this.currentDate.textContent = dateString;
        this.statusTime.textContent = timeString;
    }

    /**
     * Start clock auto-update
     */
    startClockUpdate() {
        setInterval(() => this.updateClock(), 1000);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Camera button opens director controls
        const cameraButton = document.querySelector('.lock-action.camera');
        if (cameraButton) {
            cameraButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openControls();
            });
        }

        // Contact name selector
        this.contactName.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                this.customFields.style.display = 'flex';
            } else {
                this.customFields.style.display = 'none';
            }
        });

        // Control buttons
        this.triggerBtn.addEventListener('click', () => this.triggerNotification());
        this.clearBtn.addEventListener('click', () => this.clearNotifications());
        this.resetBtn.addEventListener('click', () => this.resetScreen());
        this.closeBtn.addEventListener('click', () => this.closeControls());

        // Prevent default touch behaviors
        document.addEventListener('touchmove', (e) => {
            if (this.directorControls.classList.contains('active')) {
                // Allow scrolling in controls panel
                if (!this.directorControls.contains(e.target)) {
                    e.preventDefault();
                }
            }
        }, { passive: false });
    }


    /**
     * Open director controls
     */
    openControls() {
        this.directorControls.classList.add('active');
    }

    /**
     * Close director controls
     */
    closeControls() {
        this.directorControls.classList.remove('active');
    }

    /**
     * Check for auto-trigger on page load
     */
    checkAutoTrigger() {
        // Auto-trigger default notification after delay
        const delay = parseFloat(this.notificationDelay.value) * 1000;

        this.autoTriggerTimeout = setTimeout(() => {
            this.triggerNotification();
        }, delay);
    }

    /**
     * Trigger notification
     */
    triggerNotification() {
        const contactValue = this.contactName.value;
        let notificationData;

        if (contactValue === 'custom') {
            notificationData = {
                appName: this.customAppName.value || 'Cordolium',
                contactName: this.customContactName.value || 'Contact',
                message: this.customMessage.value || 'wants to chat!',
                icon: (this.customContactName.value || 'C')[0].toUpperCase()
            };
        } else if (contactValue === 'simon') {
            notificationData = {
                appName: 'Cordolium',
                contactName: '',
                message: 'Simon wants to chat!',
                icon: 'assets/images/logo.png'
            };
        } else if (contactValue === 'matthew') {
            notificationData = {
                appName: 'Messages',
                contactName: '',
                message: 'Matthew wants to chat!',
                icon: 'M'
            };
        }

        this.showNotification(notificationData);
    }

    /**
     * Show notification on lock screen
     */
    showNotification(data) {
        const notification = document.createElement('div');
        notification.className = 'lock-notification';

        const timeText = this.timeOverride.value || 'now';

        // Check if icon is an image URL or letter
        const iconHTML = (data.icon.includes('.') || data.icon.includes('/'))
            ? `<img src="${data.icon}" alt="App Icon">`
            : data.icon;

        notification.innerHTML = `
            <div class="notification-icon">${iconHTML}</div>
            <div class="notification-content">
                <div class="notification-header">
                    <span class="notification-app">${data.appName}</span>
                    <span class="notification-time">${timeText}</span>
                </div>
                ${data.contactName ? `<div class="notification-title">${data.contactName}</div>` : ''}
                <div class="notification-message">${data.message}</div>
            </div>
        `;

        this.notificationContainer.appendChild(notification);

        // Add click handler to navigate to appropriate demo
        notification.addEventListener('click', () => {
            this.handleNotificationClick(data);
        });

        // Add touch feedback
        notification.addEventListener('touchstart', () => {
            notification.style.opacity = '0.8';
        });

        notification.addEventListener('touchend', () => {
            notification.style.opacity = '1';
        });

        // Haptic feedback simulation (if supported)
        if (navigator.vibrate) {
            navigator.vibrate([10, 30, 10]);
        }

        // Play subtle sound (optional)
        this.playNotificationSound();
    }

    /**
     * Handle notification click
     */
    handleNotificationClick(data) {
        // Navigate to text demo (chat interface)
        window.location.href = 'text-interface.html';
    }

    /**
     * Play notification sound
     */
    playNotificationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Two-tone notification sound
            oscillator.frequency.value = 1000;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);

            // Second tone
            const oscillator2 = audioContext.createOscillator();
            const gainNode2 = audioContext.createGain();

            oscillator2.connect(gainNode2);
            gainNode2.connect(audioContext.destination);

            oscillator2.frequency.value = 800;
            oscillator2.type = 'sine';

            gainNode2.gain.setValueAtTime(0.15, audioContext.currentTime + 0.15);
            gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator2.start(audioContext.currentTime + 0.15);
            oscillator2.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('Audio not supported');
        }
    }

    /**
     * Clear all notifications
     */
    clearNotifications() {
        this.notificationContainer.innerHTML = '';
    }

    /**
     * Reset screen to initial state
     */
    resetScreen() {
        // Clear notifications
        this.clearNotifications();

        // Close controls
        this.closeControls();

        // Reset delay and re-trigger auto notification
        if (this.autoTriggerTimeout) {
            clearTimeout(this.autoTriggerTimeout);
        }

        this.checkAutoTrigger();
    }

    /**
     * Format time for notification
     */
    getFormattedTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
}

// URL Parameter Support for Director
// Example: lock-screen.html?delay=5&contact=simon&time=3:47 AM
function getURLParams() {
    const params = new URLSearchParams(window.location.search);

    if (params.has('delay')) {
        const delay = params.get('delay');
        document.getElementById('notificationDelay').value = delay;
    }

    if (params.has('contact')) {
        const contact = params.get('contact');
        document.getElementById('contactName').value = contact;
    }

    if (params.has('time')) {
        const time = params.get('time');
        document.getElementById('timeOverride').value = time;
    }

    if (params.has('name')) {
        const name = params.get('name');
        document.getElementById('customContactName').value = name;
        document.getElementById('contactName').value = 'custom';
        document.getElementById('customFields').style.display = 'flex';
    }

    if (params.has('app')) {
        const app = params.get('app');
        document.getElementById('customAppName').value = app;
        document.getElementById('contactName').value = 'custom';
        document.getElementById('customFields').style.display = 'flex';
    }

    if (params.has('message')) {
        const message = params.get('message');
        document.getElementById('customMessage').value = message;
        document.getElementById('contactName').value = 'custom';
        document.getElementById('customFields').style.display = 'flex';
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        getURLParams();
        window.lockScreen = new LockScreen();
    });
} else {
    getURLParams();
    window.lockScreen = new LockScreen();
}

// Prevent pull-to-refresh on iOS
document.body.addEventListener('touchmove', function(e) {
    if (e.target.closest('.director-controls')) {
        return; // Allow scrolling in controls
    }
    e.preventDefault();
}, { passive: false });

// Keep screen awake (if supported)
if ('wakeLock' in navigator) {
    let wakeLock = null;
    const requestWakeLock = async () => {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
        } catch (err) {
            console.log('Wake Lock error:', err);
        }
    };
    requestWakeLock();
}
