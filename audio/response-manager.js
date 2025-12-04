/**
 * Cordolium Response Manager
 * Manages AI responses, sequences, and text-to-speech
 */

class ResponseManager {
    constructor() {
        this.responses = null;
        this.sequences = null;
        this.currentSequence = null;
        this.currentSequenceIndex = 0;
        this.synthesis = window.speechSynthesis;
        this.voice = null;
        this.onResponseStart = null;
        this.onResponseComplete = null;
        this.onTypingUpdate = null;
    }

    /**
     * Load responses from JSON file
     */
    async loadResponses(jsonPath = '/data/responses.json') {
        try {
            const response = await fetch(jsonPath);
            const data = await response.json();
            this.responses = data.responses;
            this.sequences = data.sequences;
            console.log('Responses loaded successfully');
            return true;
        } catch (error) {
            console.error('Error loading responses:', error);
            return false;
        }
    }

    /**
     * Get a random response from a category
     */
    getResponse(category) {
        if (!this.responses || !this.responses[category]) {
            console.error('Response category not found:', category);
            return null;
        }

        const responses = this.responses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    /**
     * Get a specific response by category and index
     */
    getSpecificResponse(category, index = 0) {
        if (!this.responses || !this.responses[category]) {
            console.error('Response category not found:', category);
            return null;
        }

        const responses = this.responses[category];
        if (index >= responses.length) {
            index = 0;
        }

        return responses[index];
    }

    /**
     * Load a scene sequence
     */
    loadSequence(sequenceName) {
        if (!this.sequences || !this.sequences[sequenceName]) {
            console.error('Sequence not found:', sequenceName);
            return false;
        }

        this.currentSequence = this.sequences[sequenceName];
        this.currentSequenceIndex = 0;
        console.log('Sequence loaded:', sequenceName);
        return true;
    }

    /**
     * Get next response in sequence
     */
    getNextInSequence() {
        if (!this.currentSequence || this.currentSequenceIndex >= this.currentSequence.length) {
            console.log('No more responses in sequence');
            return null;
        }

        const item = this.currentSequence[this.currentSequenceIndex];
        this.currentSequenceIndex++;

        return {
            text: this.getSpecificResponse(item.response_type, item.response_index || 0),
            delay: item.delay || 1500,
            trigger: item.trigger
        };
    }

    /**
     * Reset sequence to beginning
     */
    resetSequence() {
        this.currentSequenceIndex = 0;
        console.log('Sequence reset');
    }

    /**
     * Display response with typing effect
     */
    async displayResponseWithTyping(text, targetElement, speed = 50) {
        if (!targetElement) return;

        targetElement.textContent = '';

        if (this.onResponseStart) {
            this.onResponseStart(text);
        }

        for (let i = 0; i < text.length; i++) {
            await new Promise(resolve => setTimeout(resolve, speed));
            targetElement.textContent += text[i];

            if (this.onTypingUpdate) {
                this.onTypingUpdate(i + 1, text.length);
            }
        }

        if (this.onResponseComplete) {
            this.onResponseComplete(text);
        }
    }

    /**
     * Speak response using Web Speech API
     */
    speakResponse(text, options = {}) {
        if (!this.synthesis) {
            console.error('Speech synthesis not supported');
            return;
        }

        // Cancel any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Configure voice
        utterance.rate = options.rate || 0.95;
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;

        // Use selected voice if available
        if (this.voice) {
            utterance.voice = this.voice;
        }

        // Event handlers
        utterance.onstart = () => {
            if (this.onResponseStart) {
                this.onResponseStart(text);
            }
        };

        utterance.onend = () => {
            if (this.onResponseComplete) {
                this.onResponseComplete(text);
            }
        };

        utterance.onerror = (error) => {
            console.error('Speech synthesis error:', error);
        };

        this.synthesis.speak(utterance);
    }

    /**
     * Load available voices and select best one
     */
    loadVoices() {
        return new Promise((resolve) => {
            const voices = this.synthesis.getVoices();

            if (voices.length > 0) {
                this.selectBestVoice(voices);
                resolve(voices);
            } else {
                // Some browsers load voices asynchronously
                this.synthesis.onvoiceschanged = () => {
                    const voices = this.synthesis.getVoices();
                    this.selectBestVoice(voices);
                    resolve(voices);
                };
            }
        });
    }

    /**
     * Select best voice (prefer natural-sounding male voice)
     */
    selectBestVoice(voices) {
        // Preference order for voice selection
        const preferredVoices = [
            'Google US English Male',
            'Microsoft David',
            'Alex',
            'Daniel',
            'Samantha'
        ];

        for (const preferred of preferredVoices) {
            const voice = voices.find(v => v.name.includes(preferred));
            if (voice) {
                this.voice = voice;
                console.log('Selected voice:', voice.name);
                return;
            }
        }

        // Fallback to first English voice
        const englishVoice = voices.find(v => v.lang.startsWith('en'));
        if (englishVoice) {
            this.voice = englishVoice;
            console.log('Selected fallback voice:', englishVoice.name);
        }
    }

    /**
     * Stop any ongoing speech
     */
    stopSpeaking() {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
    }

    /**
     * Process and deliver response with delay
     */
    async deliverResponse(category, options = {}) {
        const text = options.specific ?
            this.getSpecificResponse(category, options.index) :
            this.getResponse(category);

        if (!text) return;

        // Wait for processing delay
        if (options.delay) {
            await new Promise(resolve => setTimeout(resolve, options.delay));
        }

        // Display text if element provided
        if (options.textElement) {
            await this.displayResponseWithTyping(text, options.textElement, options.typingSpeed || 50);
        }

        // Speak if enabled
        if (options.speak) {
            this.speakResponse(text, options.voiceOptions || {});
        }

        return text;
    }
}

// Export for use in other modules
window.ResponseManager = ResponseManager;
