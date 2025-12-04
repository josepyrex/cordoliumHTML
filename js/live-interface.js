/**
 * Cordolium Live AI Interface Controller
 * Main controller for the live filming interface
 */

class LiveAIInterface {
    constructor() {
        this.state = 'initializing'; // initializing, idle, listening, processing, speaking
        this.audioProcessor = null;
        this.visualizer = null;
        this.responseManager = null;
        this.directorPanel = null;
        this.responseDelay = 2000;
        this.speakingDuration = 5000; // How long Simon "speaks" (longer for smoother filming)
        this.voiceEnabled = true;
        this.muted = false;
        this.isLooping = false;
        this.currentSequence = 'demo_sequence';
        this.isSpeakingMode = false; // Flag to prevent real audio from overwriting fake data

        // DOM elements
        this.statusDot = null;
        this.statusText = null;
        this.stateOverlay = null;
        this.stateText = null;
        this.controlHints = null;
        this.body = null;
    }

    /**
     * Initialize the entire interface
     */
    async initialize() {
        console.log('Initializing Live AI Interface...');

        // Get DOM elements
        this.statusDot = document.querySelector('.status-dot');
        this.statusText = document.querySelector('.status-text');
        this.stateOverlay = document.getElementById('stateOverlay');
        this.stateText = document.getElementById('stateText');
        this.controlHints = document.getElementById('controlHints');
        this.body = document.querySelector('.live-interface-body');

        // Initialize components
        this.audioProcessor = new AudioProcessor();
        this.visualizer = new WaveformVisualizer('waveformCanvas');
        this.responseManager = new ResponseManager();

        // Setup permission modal
        this.setupPermissionModal();

        // Hide control hints after 5 seconds
        setTimeout(() => {
            this.controlHints.classList.add('hidden');
        }, 5000);

        console.log('Live AI Interface initialized');
    }

    /**
     * Setup microphone permission modal
     */
    setupPermissionModal() {
        const modal = document.getElementById('permissionModal');
        const allowBtn = document.getElementById('allowMicBtn');
        const denyBtn = document.getElementById('denyMicBtn');

        allowBtn.addEventListener('click', async () => {
            try {
                // Initialize audio processor
                await this.audioProcessor.initialize();

                // Load responses
                await this.responseManager.loadResponses();

                // Load voices
                await this.responseManager.loadVoices();

                // Close modal
                modal.classList.remove('active');

                // Start the interface
                await this.start();
            } catch (error) {
                console.error('Failed to initialize:', error);
                this.setState('error');
                this.updateStatus('disconnected', 'Connection Failed');
            }
        });

        denyBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            this.setState('idle');
            this.updateStatus('disconnected', 'Microphone Denied');
        });
    }

    /**
     * Start the live interface
     */
    async start() {
        console.log('Starting Live AI Interface...');

        // Update status
        this.updateStatus('connected', 'Connected');

        // Setup audio callbacks - VISUAL ONLY (no automatic triggers)
        this.audioProcessor.onAudioData = (data) => {
            // Don't update visualizer with real audio during speaking mode (fake data is being used)
            if (!this.isSpeakingMode) {
                this.visualizer.updateData(data);
            }

            // Show listening state when audio detected, but don't auto-trigger
            if (data.average > this.audioProcessor.voiceActivityThreshold && this.state === 'idle') {
                this.setState('listening');
            } else if (data.average <= this.audioProcessor.voiceActivityThreshold && this.state === 'listening') {
                // Return to idle after brief silence (visual only)
                setTimeout(() => {
                    if (this.state === 'listening') {
                        this.setState('idle');
                    }
                }, 500);
            }
        };

        // NO automatic voice end detection - operator controls everything

        // Setup response callbacks
        this.responseManager.onResponseStart = (text) => {
            this.setState('responding');
        };

        this.responseManager.onResponseComplete = (text) => {
            setTimeout(() => {
                this.setState('idle');
            }, 2000);
        };

        // Start audio processing
        this.audioProcessor.startListening();

        // Start visualization
        this.visualizer.start();

        // Load sequence
        this.responseManager.loadSequence(this.currentSequence);

        // Initialize director panel
        this.directorPanel = new DirectorPanel(this);
        window.directorPanel = this.directorPanel; // Expose globally for onclick handlers

        // Setup click handler for manual trigger
        this.setupClickHandler();

        // Set initial state
        this.setState('idle');

        // Don't auto-deliver greeting - wait for user interaction
        console.log('Live AI Interface started - Tap circle or press Space to trigger response');
    }

    /**
     * Manual trigger for next response (OPERATOR CONTROLLED)
     * Called by Space bar, click, or director panel
     */
    async handleManualTrigger() {
        console.log('Manual trigger - Simon will speak...');

        // Smooth transition: Listening → Processing → Speaking

        // Step 1: Processing state (with delay)
        this.setState('processing');
        await new Promise(resolve => setTimeout(resolve, this.responseDelay));

        // Get next response in sequence
        const sequenceItem = this.responseManager.getNextInSequence();

        if (sequenceItem) {
            // Step 2: Deliver response (speaking state)
            await this.deliverResponse(sequenceItem.text);
        } else if (this.isLooping) {
            // Reset and start over
            this.responseManager.resetSequence();
            const firstItem = this.responseManager.getNextInSequence();
            if (firstItem) {
                await this.deliverResponse(firstItem.text);
            }
        } else {
            // End of sequence
            console.log('End of sequence reached');
            this.setState('idle');
        }
    }

    /**
     * Setup click/tap handler for visualization area
     */
    setupClickHandler() {
        const vizContainer = document.querySelector('.visualization-container');
        if (vizContainer) {
            vizContainer.style.cursor = 'pointer';
            vizContainer.addEventListener('click', () => {
                // Only trigger if in idle or listening state
                if (this.state === 'idle' || this.state === 'listening') {
                    this.handleManualTrigger();
                }
            });
        }
    }

    /**
     * Deliver a response (VISUAL ONLY - no text display)
     */
    async deliverResponse(text) {
        console.log('Simon speaking:', text);

        // Set speaking state (visual changes)
        this.setState('speaking');

        // Enable speaking mode to prevent real audio from overwriting fake data
        this.isSpeakingMode = true;

        // Tell visualizer we're speaking (changes colors)
        if (this.visualizer) {
            this.visualizer.setSpeakingState(true);
        }

        // Start fake speaking animation
        const speakingInterval = setInterval(() => {
            if (this.audioProcessor && this.visualizer) {
                const fakeData = this.audioProcessor.generateFakeSpeakingData();
                this.visualizer.updateData(fakeData);
            }
        }, 50); // Update animation 20 times per second

        // Stay in speaking state for configured duration
        await new Promise(resolve => setTimeout(resolve, this.speakingDuration));

        // Tell visualizer we stopped speaking (changes colors back)
        if (this.visualizer) {
            this.visualizer.setSpeakingState(false);
        }

        // Add a gentle fade-out delay before returning to idle
        // Keep fake animation running during this transition for smoothness
        await new Promise(resolve => setTimeout(resolve, 800));

        // NOW stop fake animation and resume real audio
        clearInterval(speakingInterval);
        this.isSpeakingMode = false;

        // Return to idle
        this.setState('idle');
    }

    /**
     * Deliver quick response by category
     */
    async deliverQuickResponse(category) {
        const text = this.responseManager.getResponse(category);
        if (text) {
            await this.deliverResponse(text);
        }
    }

    /**
     * Update interface state
     */
    setState(newState) {
        this.state = newState;
        console.log('State changed to:', newState);

        // Remove speaking class from body
        this.body.classList.remove('speaking');

        // Update state overlay and visual changes
        switch (newState) {
            case 'initializing':
                this.showStateOverlay('Initializing...');
                break;
            case 'idle':
                this.hideStateOverlay();
                break;
            case 'listening':
                this.showStateOverlay('Listening...');
                break;
            case 'processing':
                this.showStateOverlay('Processing...');
                break;
            case 'speaking':
                // Add speaking class to body (triggers white background)
                this.body.classList.add('speaking');
                this.showStateOverlay('Speaking...');
                break;
            case 'error':
                this.showStateOverlay('Error');
                break;
        }
    }

    /**
     * Show state overlay
     */
    showStateOverlay(text) {
        this.stateText.textContent = text;
        this.stateOverlay.classList.add('visible');
    }

    /**
     * Hide state overlay
     */
    hideStateOverlay() {
        this.stateOverlay.classList.remove('visible');
    }

    /**
     * Update connection status
     */
    updateStatus(status, text) {
        this.statusDot.className = `status-dot ${status}`;
        this.statusText.textContent = text;
    }

    /**
     * Reset sequence
     */
    resetSequence() {
        this.responseManager.resetSequence();
        console.log('Sequence reset');
    }

    /**
     * Toggle loop mode
     */
    toggleLoop() {
        this.isLooping = !this.isLooping;
        console.log('Loop mode:', this.isLooping ? 'ON' : 'OFF');
    }
}

// Initialize on page load
let liveAI;
document.addEventListener('DOMContentLoaded', () => {
    liveAI = new LiveAIInterface();
    liveAI.initialize();
    window.liveAI = liveAI; // Make globally accessible for director panel
});
