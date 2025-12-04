/**
 * Cordolium Waveform Visualization
 * Creates live audio visualizations using Canvas
 */

class WaveformVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas element not found:', canvasId);
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.isAnimating = false;
        this.animationId = null;
        this.audioData = null;
        this.visualizationType = 'circular'; // 'circular', 'waveform', 'bars'
        this.isSpeaking = false; // Track speaking state for color changes

        // Resize canvas to match display size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    /**
     * Resize canvas to match container
     */
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.width = rect.width;
        this.height = rect.height;
    }

    /**
     * Start visualization loop
     */
    start() {
        this.isAnimating = true;
        this.animate();
    }

    /**
     * Stop visualization
     */
    stop() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    /**
     * Update with new audio data
     */
    updateData(data) {
        this.audioData = data;
    }

    /**
     * Set speaking state (changes colors for white background)
     */
    setSpeakingState(isSpeaking) {
        this.isSpeaking = isSpeaking;
        console.log('Visualizer speaking state:', isSpeaking);
    }

    /**
     * Main animation loop
     */
    animate() {
        if (!this.isAnimating) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw based on visualization type
        if (this.audioData) {
            switch (this.visualizationType) {
                case 'circular':
                    this.drawCircularWaveform();
                    break;
                case 'waveform':
                    this.drawWaveform();
                    break;
                case 'bars':
                    this.drawFrequencyBars();
                    break;
            }
        } else {
            this.drawIdleState();
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Draw circular waveform (wraps around center orb)
     */
    drawCircularWaveform() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const baseRadius = Math.min(this.width, this.height) * 0.15;
        const waveform = this.audioData.waveform;
        const sliceCount = 128; // Number of points

        this.ctx.beginPath();
        // Change color based on speaking state (visible on white or black background)
        this.ctx.strokeStyle = this.isSpeaking ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.6)';
        this.ctx.lineWidth = this.isSpeaking ? 3 : 2;

        for (let i = 0; i < sliceCount; i++) {
            const angle = (i / sliceCount) * Math.PI * 2;
            const dataIndex = Math.floor((i / sliceCount) * waveform.length);
            const amplitude = (waveform[dataIndex] - 128) / 128;
            const radius = baseRadius + (amplitude * 40);

            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }

        this.ctx.closePath();
        this.ctx.stroke();

        // Draw center orb
        this.drawCenterOrb(centerX, centerY, baseRadius * 0.8, this.audioData.average);
    }

    /**
     * Draw center orb that responds to audio
     */
    drawCenterOrb(x, y, radius, intensity) {
        const scale = 1 + (intensity / 255) * 0.5; // More responsive
        const scaledRadius = radius * scale;

        // Gradient - changes based on speaking state
        const gradient = this.ctx.createRadialGradient(
            x - scaledRadius * 0.3,
            y - scaledRadius * 0.3,
            0,
            x,
            y,
            scaledRadius
        );

        if (this.isSpeaking) {
            // Dark orb on white background
            gradient.addColorStop(0, 'rgba(80, 80, 80, 0.9)');
            gradient.addColorStop(1, 'rgba(20, 20, 20, 1)');
        } else {
            // Light orb on black background
            gradient.addColorStop(0, 'rgba(50, 50, 50, 0.9)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        }

        this.ctx.beginPath();
        this.ctx.arc(x, y, scaledRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Outer glow - more prominent during speaking
        this.ctx.beginPath();
        this.ctx.arc(x, y, scaledRadius + 2, 0, Math.PI * 2);
        const glowOpacity = this.isSpeaking ? (intensity / 255) * 0.8 : (intensity / 255) * 0.5;
        this.ctx.strokeStyle = this.isSpeaking ?
            `rgba(0, 0, 0, ${glowOpacity})` :
            `rgba(255, 255, 255, ${glowOpacity})`;
        this.ctx.lineWidth = this.isSpeaking ? 4 : 3;
        this.ctx.stroke();
    }

    /**
     * Draw traditional waveform
     */
    drawWaveform() {
        const waveform = this.audioData.waveform;
        const sliceWidth = this.width / waveform.length;

        this.ctx.beginPath();
        this.ctx.strokeStyle = this.isSpeaking ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = this.isSpeaking ? 3 : 2;

        let x = 0;
        for (let i = 0; i < waveform.length; i++) {
            const v = waveform[i] / 128.0;
            const y = (v * this.height) / 2;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        this.ctx.lineTo(this.width, this.height / 2);
        this.ctx.stroke();
    }

    /**
     * Draw frequency bars
     */
    drawFrequencyBars() {
        const frequency = this.audioData.frequency;
        const barCount = 64;
        const barWidth = this.width / barCount;
        const step = Math.floor(frequency.length / barCount);

        for (let i = 0; i < barCount; i++) {
            const barHeight = (frequency[i * step] / 255) * this.height * 0.8;
            const x = i * barWidth;
            const y = this.height - barHeight;

            const baseOpacity = 0.3 + (barHeight / this.height) * 0.5;
            // Use black bars on white background when speaking
            this.ctx.fillStyle = this.isSpeaking ?
                `rgba(0, 0, 0, ${baseOpacity})` :
                `rgba(255, 255, 255, ${baseOpacity})`;
            this.ctx.fillRect(x, y, barWidth - 2, barHeight);
        }
    }

    /**
     * Draw idle state (no audio)
     */
    drawIdleState() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.min(this.width, this.height) * 0.12;
        const time = Date.now() * 0.001;

        // Pulsing orb
        const pulseScale = 1 + Math.sin(time * 2) * 0.1;

        const gradient = this.ctx.createRadialGradient(
            centerX - radius * 0.3,
            centerY - radius * 0.3,
            0,
            centerX,
            centerY,
            radius * pulseScale
        );
        gradient.addColorStop(0, 'rgba(50, 50, 50, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius * pulseScale, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    /**
     * Change visualization type
     */
    setVisualizationType(type) {
        this.visualizationType = type;
    }

    /**
     * Clean up
     */
    destroy() {
        this.stop();
        window.removeEventListener('resize', () => this.resizeCanvas());
    }
}

// Export for use in other modules
window.WaveformVisualizer = WaveformVisualizer;
