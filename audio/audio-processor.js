/**
 * Cordolium Audio Processor
 * Handles microphone access, audio analysis, and voice activity detection
 */

class AudioProcessor {
    constructor() {
        this.audioContext = null;
        this.microphone = null;
        this.analyser = null;
        this.dataArray = null;
        this.bufferLength = null;
        this.isListening = false;
        this.voiceActivityThreshold = 30; // Adjustable sensitivity
        this.onVoiceStart = null;
        this.onVoiceEnd = null;
        this.onAudioData = null;
        this.silenceTimeout = null;
        this.silenceDuration = 1500; // ms of silence before triggering voice end
    }

    /**
     * Initialize audio context and request microphone access
     */
    async initialize() {
        try {
            // Create audio context
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            // Create audio nodes
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            this.analyser.smoothingTimeConstant = 0.8;

            // Connect nodes
            this.microphone.connect(this.analyser);

            // Setup data array for analysis
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);

            console.log('Audio processor initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing audio processor:', error);
            throw error;
        }
    }

    /**
     * Start listening and analyzing audio
     */
    startListening() {
        if (!this.audioContext) {
            console.error('Audio processor not initialized');
            return;
        }

        this.isListening = true;
        this.analyzeAudio();
        console.log('Started listening');
    }

    /**
     * Stop listening
     */
    stopListening() {
        this.isListening = false;
        if (this.silenceTimeout) {
            clearTimeout(this.silenceTimeout);
        }
        console.log('Stopped listening');
    }

    /**
     * Main audio analysis loop
     */
    analyzeAudio() {
        if (!this.isListening) return;

        // Get frequency and waveform data
        this.analyser.getByteFrequencyData(this.dataArray);
        const waveformData = new Uint8Array(this.bufferLength);
        this.analyser.getByteTimeDomainData(waveformData);

        // Calculate average volume
        const average = this.dataArray.reduce((a, b) => a + b, 0) / this.bufferLength;

        // Voice activity detection
        if (average > this.voiceActivityThreshold) {
            this.handleVoiceDetected(average);
        } else {
            this.handleSilence();
        }

        // Send audio data to callback
        if (this.onAudioData) {
            this.onAudioData({
                frequency: this.dataArray,
                waveform: waveformData,
                average: average,
                isVoice: average > this.voiceActivityThreshold
            });
        }

        // Continue loop
        requestAnimationFrame(() => this.analyzeAudio());
    }

    /**
     * Handle voice detected
     */
    handleVoiceDetected(volume) {
        // Clear any silence timeout
        if (this.silenceTimeout) {
            clearTimeout(this.silenceTimeout);
            this.silenceTimeout = null;
        }

        // Trigger voice start callback (only once)
        if (this.onVoiceStart && !this.silenceTimeout) {
            this.onVoiceStart(volume);
        }
    }

    /**
     * Handle silence detected
     */
    handleSilence() {
        // Start silence timer if not already started
        if (!this.silenceTimeout) {
            this.silenceTimeout = setTimeout(() => {
                if (this.onVoiceEnd) {
                    this.onVoiceEnd();
                }
                this.silenceTimeout = null;
            }, this.silenceDuration);
        }
    }

    /**
     * Get current audio data snapshot
     */
    getAudioData() {
        if (!this.analyser) return null;

        this.analyser.getByteFrequencyData(this.dataArray);
        const waveformData = new Uint8Array(this.bufferLength);
        this.analyser.getByteTimeDomainData(waveformData);

        return {
            frequency: Array.from(this.dataArray),
            waveform: Array.from(waveformData),
            average: this.dataArray.reduce((a, b) => a + b, 0) / this.bufferLength
        };
    }

    /**
     * Adjust voice activity detection sensitivity
     */
    setSensitivity(value) {
        this.voiceActivityThreshold = value;
        console.log('Voice activity threshold set to:', value);
    }

    /**
     * Generate fake speaking data for visual-only mode
     * Creates realistic-looking waveform animation when Simon "speaks"
     */
    generateFakeSpeakingData() {
        const time = Date.now() * 0.005;
        const waveformData = new Uint8Array(this.bufferLength || 1024);
        const frequencyData = new Uint8Array(this.bufferLength || 1024);

        // Generate realistic speaking patterns with varying intensity (scaled down for realism)
        const baseIntensity = 40 + Math.sin(time * 0.5) * 15 + Math.random() * 20; // Range: ~25-75

        for (let i = 0; i < waveformData.length; i++) {
            // Create waveform that looks like speech (multiple frequencies, scaled down)
            const wave1 = Math.sin(time * 2 + i * 0.05) * (baseIntensity * 0.3);
            const wave2 = Math.sin(time * 3.2 + i * 0.08) * (baseIntensity * 0.2);
            const wave3 = Math.sin(time * 1.5 + i * 0.03) * (baseIntensity * 0.15);
            const noise = (Math.random() - 0.5) * 8; // Reduced noise

            waveformData[i] = 128 + wave1 + wave2 + wave3 + noise;

            // Frequency data (lower frequencies dominate in speech)
            const freqFalloff = 1 - (i / waveformData.length);
            frequencyData[i] = baseIntensity * freqFalloff * (0.5 + Math.random() * 0.5);
        }

        const average = baseIntensity;

        return {
            frequency: frequencyData,
            waveform: waveformData,
            average: average,
            isVoice: true
        };
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.stopListening();

        if (this.microphone) {
            this.microphone.disconnect();
        }

        if (this.analyser) {
            this.analyser.disconnect();
        }

        if (this.audioContext) {
            this.audioContext.close();
        }

        console.log('Audio processor destroyed');
    }
}

// Export for use in other modules
window.AudioProcessor = AudioProcessor;
