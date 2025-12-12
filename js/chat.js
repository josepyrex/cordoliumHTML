/**
 * Cordolium Chat Interface
 * For filming messaging scenes with Simon or Matthew
 */

class ChatInterface {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.operatorPanel = document.getElementById('operatorPanel');
        this.characterName = document.getElementById('characterName');
        this.avatar = document.getElementById('avatar');
        this.avatarSmall = document.getElementById('avatarSmall');
        this.characterSelect = document.getElementById('characterSelect');

        this.typingSpeed = 50; // ms per character
        this.autoScroll = true;
        this.currentCharacter = 'simon';
        this.currentMessageIndex = 0;

        // Character configurations
        this.characters = {
            simon: {
                name: 'Simon',
                avatar: 'S',
                placeholder: 'Message Simon...',
                messages: [
                    "Hey, Daniel! Our call was cut off. No worries! We can text. What can I help you with today?",
                    "Got it! Here are coffee shops near you:\n1) DV Coffee 532 feet away\n2) Marlene's Cafe 1.0 mile(s) away\n3) Sweetbee 1.2 mile(s) away",
                    "Hey Daniel, struggling to sleep tonight?",
                    "Well, I can sense your heart rate is at 115 BPM. It should be closer to 60 as you rest and sleep. Sometimes it helps to talk. Why don't I give you a call?"
                ]
            },
            matthew: {
                name: 'Matthew',
                avatar: 'M',
                placeholder: 'Message Matthew...',
                messages: [
                    "Are you awake?",
                    "Good morning. How did you sleep?",
                    "Do you want to continue where we left off?"
                ]
            }
        };
    }

    async initialize() {
        console.log('Initializing Chat Interface...');

        // Check URL parameters for character
        const params = new URLSearchParams(window.location.search);
        const characterParam = params.get('character');
        if (characterParam && this.characters[characterParam]) {
            this.currentCharacter = characterParam;
            this.characterSelect.value = characterParam;
        }

        // Load character
        this.loadCharacter(this.currentCharacter);

        // Setup event listeners
        this.setupEventListeners();

        // Auto-start first message after delay
        setTimeout(() => {
            triggerNextResponse();
        }, 1500);

        console.log('Chat Interface ready');
    }

    loadCharacter(character) {
        this.currentCharacter = character;
        const config = this.characters[character];

        // Update UI
        this.characterName.textContent = config.name;
        this.avatar.textContent = config.avatar;
        this.avatarSmall.textContent = config.avatar;
        this.chatInput.placeholder = config.placeholder;

        // Update avatar classes
        this.avatar.className = `avatar avatar-${character}`;
        this.avatarSmall.className = `avatar-small avatar-${character}`;

        // Reset message index
        this.currentMessageIndex = 0;
    }

    setupEventListeners() {
        // Input field
        this.chatInput.addEventListener('input', () => {
            this.sendBtn.disabled = this.chatInput.value.trim() === '';
        });

        // Send button - adds user message and triggers AI response
        this.sendBtn.addEventListener('click', () => {
            if (this.chatInput.value.trim()) {
                this.addUserMessage(this.chatInput.value);
                this.chatInput.value = '';
                this.sendBtn.disabled = true;
                // Trigger AI response after brief delay
                setTimeout(() => triggerNextResponse(), 500);
            }
        });

        // Enter key - adds user message and triggers AI response
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (this.chatInput.value.trim()) {
                    this.addUserMessage(this.chatInput.value);
                    this.chatInput.value = '';
                    this.sendBtn.disabled = true;
                    // Trigger AI response after brief delay
                    setTimeout(() => triggerNextResponse(), 500);
                }
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Don't trigger if typing in input
            if (document.activeElement === this.chatInput) {
                if (e.key !== 'Enter') return;
            }

            switch(e.key) {
                case 'Escape':
                    e.preventDefault();
                    toggleOperatorPanel();
                    break;
                case 't':
                case 'T':
                    e.preventDefault();
                    showTypingIndicator();
                    break;
                case 'c':
                case 'C':
                    if (e.ctrlKey || e.metaKey) return; // Allow copy
                    e.preventDefault();
                    clearChat();
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    resetSequence();
                    break;
            }
        });
    }

    addUserMessage(text) {
        if (!text.trim()) return;

        const messageEl = document.createElement('div');
        messageEl.className = 'message user';
        messageEl.innerHTML = `
            <div class="message-bubble">${this.escapeHtml(text)}</div>
        `;

        this.chatMessages.appendChild(messageEl);
        this.scrollToBottom();
    }

    async addAIMessage(text) {
        const messageEl = document.createElement('div');
        messageEl.className = 'message ai';

        const bubbleEl = document.createElement('div');
        bubbleEl.className = 'message-bubble';

        messageEl.appendChild(bubbleEl);
        this.chatMessages.appendChild(messageEl);

        // Type out message
        for (let i = 0; i < text.length; i++) {
            await new Promise(resolve => setTimeout(resolve, this.typingSpeed));
            bubbleEl.textContent += text[i];

            if (i % 10 === 0 && this.autoScroll) {
                this.scrollToBottom();
            }
        }

        this.scrollToBottom();
    }

    showTyping() {
        this.typingIndicator.classList.add('visible');
        this.scrollToBottom();
    }

    hideTyping() {
        this.typingIndicator.classList.remove('visible');
    }

    scrollToBottom() {
        if (this.autoScroll) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    clearMessages() {
        this.chatMessages.innerHTML = '';
    }

    resetMessages() {
        this.currentMessageIndex = 0;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    }

    getNextMessage() {
        const config = this.characters[this.currentCharacter];
        if (this.currentMessageIndex >= config.messages.length) {
            // Loop back to start
            this.currentMessageIndex = 0;
        }
        const message = config.messages[this.currentMessageIndex];
        this.currentMessageIndex++;
        return message;
    }
}

// Global instance
let chatInterface;

// Initialize on load
document.addEventListener('DOMContentLoaded', async () => {
    chatInterface = new ChatInterface();
    await chatInterface.initialize();
    window.chatInterface = chatInterface;
});

// Global functions for operator controls
async function triggerNextResponse() {
    if (!chatInterface) return;

    // Show typing indicator
    chatInterface.showTyping();

    // Wait for delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Hide typing, show response
    chatInterface.hideTyping();

    const message = chatInterface.getNextMessage();
    await chatInterface.addAIMessage(message);
}

function showTypingIndicator() {
    if (!chatInterface) return;
    chatInterface.showTyping();
}

function hideTypingIndicator() {
    if (!chatInterface) return;
    chatInterface.hideTyping();
}

function clearChat() {
    if (!chatInterface) return;
    chatInterface.clearMessages();
    console.log('Chat cleared');
}

function resetSequence() {
    if (!chatInterface) return;
    chatInterface.resetMessages();
    console.log('Sequence reset');
}

function switchCharacter(character) {
    if (!chatInterface) return;
    chatInterface.loadCharacter(character);
    chatInterface.clearMessages();
    console.log('Switched to:', character);
}

function toggleOperatorPanel() {
    if (!chatInterface) return;
    chatInterface.operatorPanel.classList.toggle('hidden');
}

// Update typing speed
document.addEventListener('DOMContentLoaded', () => {
    const typingSpeedInput = document.getElementById('typingSpeed');
    const typingSpeedValue = document.getElementById('typingSpeedValue');

    if (typingSpeedInput) {
        typingSpeedInput.addEventListener('input', (e) => {
            const value = e.target.value;
            typingSpeedValue.textContent = value;
            if (chatInterface) {
                chatInterface.typingSpeed = parseInt(value);
            }
        });
    }

    // Auto-scroll toggle
    const autoScrollCheckbox = document.getElementById('autoScroll');
    if (autoScrollCheckbox) {
        autoScrollCheckbox.addEventListener('change', (e) => {
            if (chatInterface) {
                chatInterface.autoScroll = e.target.checked;
            }
        });
    }
});
