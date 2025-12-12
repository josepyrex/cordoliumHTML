/**
 * Matthew Chat Interface
 * Scripted conversation with Matthew
 */

class MatthewChat {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.chatHeader = document.getElementById('chatHeader');
        this.chatInputContainer = document.getElementById('chatInputContainer');

        // Check if accessed from notification (clean mode for filming)
        this.cleanMode = this.checkCleanMode();

        // Scripted messages from Matthew
        this.matthewMessages = [
            "Are you awake?",
            "Good morning. How did you sleep?",
            "Do you want to continue where we left off?"
        ];

        this.currentMessageIndex = 0;
        this.init();
    }

    /**
     * Check if accessed from notification (clean filming mode)
     */
    checkCleanMode() {
        const params = new URLSearchParams(window.location.search);
        return params.has('clean') || params.get('from') === 'notification';
    }

    /**
     * Initialize chat
     */
    init() {
        // Apply clean mode if needed
        if (this.cleanMode) {
            this.enableCleanMode();
        }

        // Auto-send first message from Matthew after delay
        setTimeout(() => {
            this.sendMatthewMessage(0);
        }, 1500);

        // Attach event listeners
        this.attachEventListeners();
    }

    /**
     * Enable clean mode (hide UI elements for filming)
     */
    enableCleanMode() {
        if (this.chatHeader) {
            this.chatHeader.style.display = 'none';
        }
        if (this.chatInputContainer) {
            this.chatInputContainer.style.display = 'none';
        }
        // Adjust messages container to fill screen
        if (this.chatMessages) {
            this.chatMessages.style.paddingTop = 'env(safe-area-inset-top, 20px)';
            this.chatMessages.style.height = '100vh';
            this.chatMessages.style.height = '100dvh';
        }
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Send button
        this.sendBtn.addEventListener('click', () => this.handleUserMessage());

        // Enter key
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleUserMessage();
            }
        });

        // Click on messages to advance (for filming)
        this.chatMessages.addEventListener('click', () => {
            if (this.currentMessageIndex < this.matthewMessages.length) {
                this.sendMatthewMessage(this.currentMessageIndex);
            }
        });
    }

    /**
     * Handle user message
     */
    handleUserMessage() {
        const message = this.chatInput.value.trim();

        if (message) {
            // Add user message
            this.addUserMessage(message);
            this.chatInput.value = '';

            // Respond with next Matthew message
            setTimeout(() => {
                if (this.currentMessageIndex < this.matthewMessages.length) {
                    this.sendMatthewMessage(this.currentMessageIndex);
                }
            }, 1000);
        }
    }

    /**
     * Send Matthew message
     */
    sendMatthewMessage(index) {
        if (index >= this.matthewMessages.length) return;

        // Show typing indicator
        this.showTyping();

        // Simulate typing delay
        const message = this.matthewMessages[index];
        const typingDuration = Math.min(2000, message.length * 30);

        setTimeout(() => {
            this.hideTyping();
            this.addMatthewMessage(message);
            this.currentMessageIndex++;
        }, typingDuration);
    }

    /**
     * Add Matthew message
     */
    addMatthewMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message received';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = text;

        messageDiv.appendChild(bubble);
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /**
     * Add user message
     */
    addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = text;

        messageDiv.appendChild(bubble);
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /**
     * Show typing indicator
     */
    showTyping() {
        this.typingIndicator.classList.add('active');
        this.scrollToBottom();
    }

    /**
     * Hide typing indicator
     */
    hideTyping() {
        this.typingIndicator.classList.remove('active');
    }

    /**
     * Scroll to bottom of chat
     */
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    /**
     * Trigger next message (for director/testing)
     */
    triggerNextMessage() {
        if (this.currentMessageIndex < this.matthewMessages.length) {
            this.sendMatthewMessage(this.currentMessageIndex);
        }
    }
}

// URL parameter support for director control
// Example: chat-matthew.html?clean=true (hides UI for filming)
// Example: chat-matthew.html?from=notification (clean mode)

// Initialize chat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.matthewChat = new MatthewChat();
    });
} else {
    window.matthewChat = new MatthewChat();
}

// Keyboard shortcut for director: Press 'N' to trigger next message
document.addEventListener('keydown', (e) => {
    if (e.key === 'n' || e.key === 'N') {
        if (window.matthewChat) {
            window.matthewChat.triggerNextMessage();
        }
    }
});
