/**
 * iPhone Notification Component
 * Realistic iOS-style notification system
 */

class iPhoneNotification {
    constructor(options = {}) {
        this.options = {
            appName: options.appName || 'Cordolium',
            title: options.title || 'Simon',
            message: options.message || 'wants to chat!',
            icon: options.icon || 'C', // Can be 'C', 'M', or image URL
            time: options.time || 'now',
            autoShow: options.autoShow !== undefined ? options.autoShow : true,
            showDelay: options.showDelay || 1000, // Delay before showing (ms)
            autoDismiss: options.autoDismiss !== undefined ? options.autoDismiss : true,
            dismissDelay: options.dismissDelay || 5000, // Time before auto-dismiss (ms)
            onClick: options.onClick || null,
            onDismiss: options.onDismiss || null,
            sound: options.sound || false // Play notification sound
        };

        this.notification = null;
        this.dismissTimer = null;
        this.touchStartY = 0;
        this.touchCurrentY = 0;
        this.isDragging = false;

        this.init();
    }

    /**
     * Initialize the notification
     */
    init() {
        this.createNotification();
        this.attachEvents();

        if (this.options.autoShow) {
            setTimeout(() => this.show(), this.options.showDelay);
        }
    }

    /**
     * Create the notification HTML
     */
    createNotification() {
        // Create notification container
        this.notification = document.createElement('div');
        this.notification.className = 'iphone-notification';
        this.notification.innerHTML = `
            <div class="notification-card">
                <div class="notification-icon">
                    ${this.getIconHTML()}
                </div>
                <div class="notification-content">
                    <div class="notification-header">
                        <span class="notification-app-name">${this.options.appName}</span>
                        <span class="notification-time">${this.options.time}</span>
                    </div>
                    <div class="notification-title">${this.options.title}</div>
                    <div class="notification-message">${this.options.message}</div>
                </div>
            </div>
        `;

        document.body.appendChild(this.notification);
    }

    /**
     * Get icon HTML (letter or image)
     */
    getIconHTML() {
        // If icon is a URL (contains . or /)
        if (this.options.icon.includes('.') || this.options.icon.includes('/')) {
            return `<img src="${this.options.icon}" alt="App Icon">`;
        }
        // Otherwise, use letter
        return this.options.icon;
    }

    /**
     * Attach event listeners
     */
    attachEvents() {
        const card = this.notification.querySelector('.notification-card');

        // Click to open/dismiss
        card.addEventListener('click', (e) => {
            if (!this.isDragging) {
                this.handleClick();
            }
        });

        // Touch events for swipe up to dismiss
        card.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        card.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        card.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    }

    /**
     * Show the notification
     */
    show() {
        // Play sound if enabled
        if (this.options.sound) {
            this.playNotificationSound();
        }

        // Add show class
        this.notification.classList.add('show');
        this.notification.style.pointerEvents = 'auto';

        // Auto-dismiss if enabled
        if (this.options.autoDismiss) {
            this.dismissTimer = setTimeout(() => {
                this.dismiss();
            }, this.options.dismissDelay);
        }
    }

    /**
     * Dismiss the notification
     */
    dismiss() {
        if (this.dismissTimer) {
            clearTimeout(this.dismissTimer);
        }

        this.notification.classList.remove('show');
        this.notification.classList.add('hide');
        this.notification.style.pointerEvents = 'none';

        // Call onDismiss callback
        if (this.options.onDismiss) {
            this.options.onDismiss();
        }

        // Remove after animation
        setTimeout(() => {
            this.notification.classList.remove('hide');
        }, 500);
    }

    /**
     * Handle notification click
     */
    handleClick() {
        // Cancel auto-dismiss
        if (this.dismissTimer) {
            clearTimeout(this.dismissTimer);
        }

        // Call onClick callback
        if (this.options.onClick) {
            this.options.onClick();
        }

        // Dismiss notification
        this.dismiss();
    }

    /**
     * Touch start handler
     */
    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
        this.isDragging = false;

        // Cancel auto-dismiss while touching
        if (this.dismissTimer) {
            clearTimeout(this.dismissTimer);
        }
    }

    /**
     * Touch move handler (swipe up to dismiss)
     */
    handleTouchMove(e) {
        this.touchCurrentY = e.touches[0].clientY;
        const diff = this.touchStartY - this.touchCurrentY;

        // If swiping up
        if (diff > 10) {
            this.isDragging = true;
            const translateY = -diff;
            this.notification.style.transform = `translate(-50%, ${translateY}px)`;
            this.notification.style.opacity = 1 - (diff / 200);

            // Prevent default scroll
            e.preventDefault();
        }
    }

    /**
     * Touch end handler
     */
    handleTouchEnd(e) {
        const diff = this.touchStartY - this.touchCurrentY;

        // If swiped up enough, dismiss
        if (diff > 80) {
            this.dismiss();
        } else {
            // Reset position
            this.notification.style.transform = 'translateX(-50%)';
            this.notification.style.opacity = '1';

            // Restart auto-dismiss if enabled
            if (this.options.autoDismiss && !this.isDragging) {
                this.dismissTimer = setTimeout(() => {
                    this.dismiss();
                }, this.options.dismissDelay);
            }
        }

        setTimeout(() => {
            this.isDragging = false;
        }, 100);
    }

    /**
     * Play notification sound (optional)
     */
    playNotificationSound() {
        // Create a simple notification-like beep
        // You can replace this with an actual audio file
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('Audio not supported');
        }
    }

    /**
     * Update notification content
     */
    update(options) {
        if (options.title) {
            this.notification.querySelector('.notification-title').textContent = options.title;
        }
        if (options.message) {
            this.notification.querySelector('.notification-message').textContent = options.message;
        }
        if (options.time) {
            this.notification.querySelector('.notification-time').textContent = options.time;
        }
    }

    /**
     * Destroy the notification
     */
    destroy() {
        if (this.dismissTimer) {
            clearTimeout(this.dismissTimer);
        }
        if (this.notification && this.notification.parentNode) {
            this.notification.parentNode.removeChild(this.notification);
        }
    }
}

// Usage examples:

/**
 * Show notification with default settings
 */
function showSimonNotification() {
    new iPhoneNotification({
        appName: 'Cordolium',
        title: 'Simon',
        message: 'wants to chat!',
        icon: 'S',
        time: 'now',
        autoShow: true,
        showDelay: 1000,
        autoDismiss: true,
        dismissDelay: 5000,
        onClick: () => {
            // Optional: Navigate to voice demo
            console.log('Notification clicked!');
            // window.location.href = 'live-interface.html';
        }
    });
}

/**
 * Show notification for Matthew (text demo)
 */
function showMatthewNotification() {
    new iPhoneNotification({
        appName: 'Messages',
        title: 'Matthew',
        message: 'wants to chat!',
        icon: 'M',
        time: 'now',
        autoShow: true,
        showDelay: 1000,
        autoDismiss: true,
        dismissDelay: 5000,
        onClick: () => {
            // Optional: Navigate to text demo
            console.log('Notification clicked!');
            // window.location.href = 'text-interface.html';
        }
    });
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { iPhoneNotification, showSimonNotification, showMatthewNotification };
}
