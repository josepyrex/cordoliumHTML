/**
 * Cordolium Director Panel
 * Hidden controls for film crew to manually control AI interface
 */

class DirectorPanel {
    constructor(aiInterface) {
        this.aiInterface = aiInterface;
        this.isVisible = false;
        this.panel = null;
        this.shortcuts = {
            'Space': 'triggerNextResponse',
            '1': 'jumpToResponse1',
            '2': 'jumpToResponse2',
            '3': 'jumpToResponse3',
            '4': 'jumpToResponse4',
            '5': 'jumpToResponse5',
            '6': 'jumpToResponse6',
            '7': 'jumpToResponse7',
            '8': 'jumpToResponse8',
            '9': 'jumpToResponse9',
            'r': 'resetSequence',
            'm': 'toggleMute',
            'v': 'adjustVisualization',
            't': 'adjustTiming',
            'l': 'toggleLoop',
            'd': 'toggleDirectorPanel',
            'i': 'toggleIdleState',
            'p': 'toggleProcessing'
        };

        this.initialize();
        this.setupKeyboardShortcuts();
    }

    /**
     * Initialize director panel UI
     */
    initialize() {
        // Create panel element
        this.panel = document.createElement('div');
        this.panel.id = 'director-panel';
        this.panel.className = 'director-panel hidden';
        this.panel.innerHTML = `
            <div class="director-panel-header">
                <h3>Director Controls</h3>
                <button class="close-btn" onclick="directorPanel.toggle()">×</button>
            </div>
            <div class="director-panel-content">
                <div class="control-section">
                    <h4>Response Controls</h4>
                    <button onclick="directorPanel.triggerNextResponse()">Next Response (Space)</button>
                    <button onclick="directorPanel.resetSequence()">Reset (R)</button>
                    <button onclick="directorPanel.toggleLoop()">Toggle Loop (L)</button>
                </div>

                <div class="control-section">
                    <h4>State Controls</h4>
                    <button onclick="directorPanel.toggleIdleState()">Idle State (I)</button>
                    <button onclick="directorPanel.toggleProcessing()">Processing (P)</button>
                </div>

                <div class="control-section">
                    <h4>Quick Responses (1-9)</h4>
                    <div class="quick-responses">
                        <button onclick="directorPanel.jumpToResponse1()">1: Greeting</button>
                        <button onclick="directorPanel.jumpToResponse2()">2: Introduction</button>
                        <button onclick="directorPanel.jumpToResponse3()">3: Assistance</button>
                        <button onclick="directorPanel.jumpToResponse4()">4: Location</button>
                        <button onclick="directorPanel.jumpToResponse5()">5: Understanding</button>
                        <button onclick="directorPanel.jumpToResponse6()">6: Idle</button>
                    </div>
                </div>

                <div class="control-section">
                    <h4>Timing Controls</h4>
                    <label>
                        Response Delay (ms):
                        <input type="range" min="500" max="5000" value="2000" step="100" onchange="directorPanel.setResponseDelay(this.value)">
                        <span id="delay-value">2000</span>
                        <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 4px;">Time from user stops → Simon responds</div>
                    </label>
                    <label>
                        Speaking Duration (ms):
                        <input type="range" min="2000" max="15000" value="5000" step="500" onchange="directorPanel.setSpeakingDuration(this.value)">
                        <span id="speaking-value">5000</span>
                        <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 4px;">How long Simon "speaks" (visual state)</div>
                    </label>
                </div>

                <div class="control-section">
                    <h4>Audio Settings</h4>
                    <label>
                        Microphone Sensitivity:
                        <input type="range" min="10" max="100" value="30" onchange="directorPanel.setSensitivity(this.value)">
                        <span id="sensitivity-value">30</span>
                    </label>
                    <label>
                        <input type="checkbox" onchange="directorPanel.toggleMute(this.checked)">
                        Mute Audio (M)
                    </label>
                </div>

                <div class="control-section">
                    <h4>Keyboard Shortcuts</h4>
                    <ul class="shortcuts-list">
                        <li><strong>D</strong> - Toggle this panel</li>
                        <li><strong>Space</strong> - Trigger next response</li>
                        <li><strong>1-9</strong> - Jump to specific responses</li>
                        <li><strong>R</strong> - Reset sequence</li>
                        <li><strong>I</strong> - Toggle idle state</li>
                        <li><strong>P</strong> - Toggle processing state</li>
                        <li><strong>M</strong> - Toggle mute</li>
                        <li><strong>L</strong> - Toggle loop</li>
                    </ul>
                </div>
            </div>
        `;

        document.body.appendChild(this.panel);
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ignore if user is typing in input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            const key = e.key === ' ' ? 'Space' : e.key.toLowerCase();
            const action = this.shortcuts[key];

            if (action && this[action]) {
                e.preventDefault();
                this[action]();
                console.log('Director control triggered:', action);
            }
        });

        console.log('Director panel shortcuts initialized');
    }

    /**
     * Toggle panel visibility
     */
    toggle() {
        this.isVisible = !this.isVisible;
        this.panel.classList.toggle('hidden');
    }

    toggleDirectorPanel() {
        this.toggle();
    }

    /**
     * Trigger next response in sequence
     */
    triggerNextResponse() {
        if (this.aiInterface && this.aiInterface.handleManualTrigger) {
            this.aiInterface.handleManualTrigger();
        }
    }

    /**
     * Reset sequence to beginning
     */
    resetSequence() {
        if (this.aiInterface && this.aiInterface.resetSequence) {
            this.aiInterface.resetSequence();
        }
    }

    /**
     * Toggle loop mode
     */
    toggleLoop() {
        if (this.aiInterface && this.aiInterface.toggleLoop) {
            this.aiInterface.toggleLoop();
        }
    }

    /**
     * Toggle idle state
     */
    toggleIdleState() {
        if (this.aiInterface && this.aiInterface.setState) {
            this.aiInterface.setState('idle');
        }
    }

    /**
     * Toggle processing state
     */
    toggleProcessing() {
        if (this.aiInterface && this.aiInterface.setState) {
            this.aiInterface.setState('processing');
        }
    }

    /**
     * Quick response buttons
     */
    jumpToResponse1() { this.aiInterface?.deliverQuickResponse('greeting'); }
    jumpToResponse2() { this.aiInterface?.deliverQuickResponse('introduction'); }
    jumpToResponse3() { this.aiInterface?.deliverQuickResponse('assistance'); }
    jumpToResponse4() { this.aiInterface?.deliverQuickResponse('location_services'); }
    jumpToResponse5() { this.aiInterface?.deliverQuickResponse('understanding'); }
    jumpToResponse6() { this.aiInterface?.deliverQuickResponse('idle'); }
    jumpToResponse7() { this.aiInterface?.deliverQuickResponse('greeting'); }
    jumpToResponse8() { this.aiInterface?.deliverQuickResponse('introduction'); }
    jumpToResponse9() { this.aiInterface?.deliverQuickResponse('assistance'); }

    /**
     * Adjust microphone sensitivity
     */
    setSensitivity(value) {
        document.getElementById('sensitivity-value').textContent = value;
        if (this.aiInterface && this.aiInterface.audioProcessor) {
            this.aiInterface.audioProcessor.setSensitivity(parseInt(value));
        }
    }

    /**
     * Adjust response delay
     */
    setResponseDelay(value) {
        document.getElementById('delay-value').textContent = value;
        if (this.aiInterface) {
            this.aiInterface.responseDelay = parseInt(value);
        }
    }

    /**
     * Adjust speaking duration
     */
    setSpeakingDuration(value) {
        document.getElementById('speaking-value').textContent = value;
        if (this.aiInterface) {
            this.aiInterface.speakingDuration = parseInt(value);
        }
    }

    /**
     * Toggle voice synthesis
     */
    toggleVoice(enabled) {
        if (this.aiInterface) {
            this.aiInterface.voiceEnabled = enabled;
        }
    }

    /**
     * Toggle mute
     */
    toggleMute(muted) {
        if (this.aiInterface) {
            this.aiInterface.muted = muted;
        }
    }

    adjustVisualization() {
        // Cycle through visualization types
        if (this.aiInterface && this.aiInterface.visualizer) {
            const types = ['circular', 'waveform', 'bars'];
            const current = this.aiInterface.visualizer.visualizationType;
            const currentIndex = types.indexOf(current);
            const nextIndex = (currentIndex + 1) % types.length;
            this.aiInterface.visualizer.setVisualizationType(types[nextIndex]);
            console.log('Visualization type:', types[nextIndex]);
        }
    }

    adjustTiming() {
        // Increase response delay by 500ms
        if (this.aiInterface) {
            this.aiInterface.responseDelay += 500;
            document.getElementById('delay-value').textContent = this.aiInterface.responseDelay;
            console.log('Response delay:', this.aiInterface.responseDelay);
        }
    }
}

// Export for use in other modules
window.DirectorPanel = DirectorPanel;
