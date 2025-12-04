/**
 * Cordolium Text Chat Interface
 * For filming messaging scenes
 */

class TextChatInterface {
    constructor() {
        this.responseManager = null;
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.operatorPanel = document.getElementById('operatorPanel');
        this.controlHints = document.getElementById('controlHints');

        this.typingSpeed = 50; // ms per character
        this.autoScroll = true;
        this.currentSequence = 'text_conversation';
    }

    async initialize() {
        console.log('Initializing Text Chat Interface...');

        // Load response manager
        this.responseManager = new ResponseManager();
        await this.responseManager.loadResponses();
        this.responseManager.loadSequence(this.currentSequence);

        // Setup event listeners
        this.setupEventListeners();

        // Hide control hints after 5 seconds
        setTimeout(() => {
            this.controlHints.classList.add('hidden');
        }, 5000);

        console.log('Text Chat Interface ready');
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
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    e.preventDefault();
                    quickResponse(parseInt(e.key));
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
        // Keep system message, remove everything else
        const systemMsg = this.chatMessages.querySelector('.message-system');
        this.chatMessages.innerHTML = '';
        if (systemMsg) {
            this.chatMessages.appendChild(systemMsg);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    }
}

// Global instance
let textChat;

// Initialize on load
document.addEventListener('DOMContentLoaded', async () => {
    textChat = new TextChatInterface();
    await textChat.initialize();
    window.textChat = textChat;
});

// Global functions for operator controls
async function triggerNextResponse() {
    if (!textChat) return;

    // Show typing indicator
    textChat.showTyping();

    // Get next response
    let sequenceItem = textChat.responseManager.getNextInSequence();

    // If no more responses, loop back to start
    if (!sequenceItem) {
        console.log('End of sequence reached, looping back to start');
        textChat.responseManager.resetSequence();
        sequenceItem = textChat.responseManager.getNextInSequence();
    }

    if (sequenceItem) {
        // Wait for delay
        await new Promise(resolve => setTimeout(resolve, sequenceItem.delay || 1500));

        // Hide typing, show response
        textChat.hideTyping();
        await textChat.addAIMessage(sequenceItem.text);
    } else {
        // Still no response (shouldn't happen, but handle it)
        textChat.hideTyping();
        console.log('No responses available');
        // Use a fallback response
        await textChat.addAIMessage("I'm here to help! What can I do for you?");
    }
}

async function quickResponse(num) {
    if (!textChat) return;

    const responseMap = {
        1: 'call_disconnected',
        2: 'location_services',
        3: 'understanding',
        4: 'assistance',
        5: 'greeting',
        6: 'introduction'
    };

    const category = responseMap[num];
    if (!category) return;

    textChat.showTyping();
    await new Promise(resolve => setTimeout(resolve, 1500));
    textChat.hideTyping();

    const text = textChat.responseManager.getResponse(category);
    if (text) {
        await textChat.addAIMessage(text);
    }
}

function showTypingIndicator() {
    if (!textChat) return;
    textChat.showTyping();
}

function hideTypingIndicator() {
    if (!textChat) return;
    textChat.hideTyping();
}

function clearChat() {
    if (!textChat) return;
    textChat.clearMessages();
    console.log('Chat cleared');
}

function resetSequence() {
    if (!textChat) return;
    textChat.responseManager.resetSequence();
    console.log('Sequence reset');
}

function loadSequence(sequenceName) {
    if (!textChat) return;
    textChat.currentSequence = sequenceName;
    textChat.responseManager.loadSequence(sequenceName);
    console.log('Loaded sequence:', sequenceName);
}

function toggleOperatorPanel() {
    if (!textChat) return;
    textChat.operatorPanel.classList.toggle('hidden');
}

// Update typing speed
document.addEventListener('DOMContentLoaded', () => {
    const typingSpeedInput = document.getElementById('typingSpeed');
    const typingSpeedValue = document.getElementById('typingSpeedValue');

    if (typingSpeedInput) {
        typingSpeedInput.addEventListener('input', (e) => {
            const value = e.target.value;
            typingSpeedValue.textContent = value;
            if (textChat) {
                textChat.typingSpeed = parseInt(value);
            }
        });
    }

    // Auto-scroll toggle
    const autoScrollCheckbox = document.getElementById('autoScroll');
    if (autoScrollCheckbox) {
        autoScrollCheckbox.addEventListener('change', (e) => {
            if (textChat) {
                textChat.autoScroll = e.target.checked;
            }
        });
    }
});
