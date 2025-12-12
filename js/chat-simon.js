/**
 * Simon Chat Interface
 * Scripted conversation with Simon AI
 */

class SimonChat {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.chatHeader = document.getElementById('chatHeader');
        this.chatInputContainer = document.getElementById('chatInputContainer');

        // Check if accessed from notification (clean mode for filming)
        this.cleanMode = this.checkCleanMode();

        // Scripted messages from Simon
        this.simonMessages = [
            "Hey, Daniel! Our call was cut off. No worries! We can text. What can I help you with today?",
            "Got it! Here are coffee shops near you:\n1) DV Coffee 532 feet away\n2) Marlene's Cafe 1.0 mile(s) away\n3) Sweetbee 1.2 mile(s) away",
            "Hey Daniel, struggling to sleep tonight?",
            "Well, I can sense your heart rate is at 115 BPM. It should be closer to 60 as you rest and sleep. Sometimes it helps to talk. Why don't I give you a call?"
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

        // Show initial call ended message
        this.addSystemMessage('📞 Call ended');

        // Auto-send first message from Simon after delay
        setTimeout(() => {
            this.sendSimonMessage(0);
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
            if (this.currentMessageIndex < this.simonMessages.length) {
                this.sendSimonMessage(this.currentMessageIndex);
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

            // Respond with next Simon message
            setTimeout(() => {
                if (this.currentMessageIndex < this.simonMessages.length) {
                    this.sendSimonMessage(this.currentMessageIndex);
                }
            }, 1000);
        }
    }

    /**
     * Send Simon message
     */
    sendSimonMessage(index) {
        if (index >= this.simonMessages.length) return;

        // Show typing indicator
        this.showTyping();

        // Simulate typing delay
        const message = this.simonMessages[index];
        const typingDuration = Math.min(2000, message.length * 30);

        setTimeout(() => {
            this.hideTyping();
            this.addSimonMessage(message);
            this.currentMessageIndex++;
        }, typingDuration);
    }

    /**
     * Add system message
     */
    addSystemMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-system';

        const parts = text.split(' ');
        const icon = parts[0];
        const textContent = parts.slice(1).join(' ');

        messageDiv.innerHTML = `
            <span class="system-icon">${icon}</span>
            <span class="system-text">${textContent}</span>
        `;

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /**
     * Add Simon message
     */
    addSimonMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message received';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';

        // Handle multiline messages (coffee shop list)
        bubble.innerHTML = text.replace(/\n/g, '<br>');

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
        if (this.currentMessageIndex < this.simonMessages.length) {
            this.sendSimonMessage(this.currentMessageIndex);
        }
    }
}

// URL parameter support for director control
// Example: chat-simon.html?clean=true (hides UI for filming)
// Example: chat-simon.html?from=notification (clean mode)

// Initialize chat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.simonChat = new SimonChat();
    });
} else {
    window.simonChat = new SimonChat();
}

// Keyboard shortcut for director: Press 'N' to trigger next message
document.addEventListener('keydown', (e) => {
    if (e.key === 'n' || e.key === 'N') {
        if (window.simonChat) {
            window.simonChat.triggerNextMessage();
        }
    }
});
