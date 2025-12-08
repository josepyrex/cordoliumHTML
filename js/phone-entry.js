/**
 * Phone Entry Page Controller
 * Handles phone number validation and transition to voice demo
 */

class PhoneEntry {
    constructor() {
        this.phoneInput = document.getElementById('phoneNumber');
        this.phoneForm = document.getElementById('phoneForm');
        this.continueBtn = document.getElementById('continueBtn');
        this.skipBtn = document.getElementById('skipBtn');
        this.phoneError = document.getElementById('phoneError');
        this.loadingOverlay = document.getElementById('loadingOverlay');

        this.init();
    }

    /**
     * Initialize the phone entry system
     */
    init() {
        this.attachEventListeners();
        this.checkExistingPhone();
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Phone input formatting
        this.phoneInput.addEventListener('input', (e) => this.formatPhoneNumber(e));

        // Form submission
        this.phoneForm.addEventListener('submit', (e) => this.handleSubmit(e));

        // Skip button (for testing/director)
        this.skipBtn.addEventListener('click', () => this.skipToDemo());

        // Clear error on focus
        this.phoneInput.addEventListener('focus', () => this.clearError());
    }

    /**
     * Format phone number as user types (US format)
     */
    formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        let formattedValue = '';

        if (value.length > 0) {
            formattedValue = '(' + value.substring(0, 3);
        }
        if (value.length >= 4) {
            formattedValue += ') ' + value.substring(3, 6);
        }
        if (value.length >= 7) {
            formattedValue += '-' + value.substring(6, 10);
        }

        e.target.value = formattedValue;
    }

    /**
     * Validate phone number
     */
    validatePhoneNumber(phone) {
        // Remove all non-digits
        const digits = phone.replace(/\D/g, '');

        // Check if it's 10 digits (US format)
        if (digits.length !== 10) {
            return {
                valid: false,
                message: 'Please enter a valid 10-digit phone number'
            };
        }

        // Check if first digit is valid (US phone numbers don't start with 0 or 1)
        if (digits[0] === '0' || digits[0] === '1') {
            return {
                valid: false,
                message: 'Phone number must start with 2-9'
            };
        }

        return {
            valid: true,
            message: ''
        };
    }

    /**
     * Handle form submission
     */
    async handleSubmit(e) {
        e.preventDefault();

        const phoneValue = this.phoneInput.value;
        const validation = this.validatePhoneNumber(phoneValue);

        if (!validation.valid) {
            this.showError(validation.message);
            return;
        }

        // Store phone number
        const cleanPhone = phoneValue.replace(/\D/g, '');
        this.savePhoneNumber(cleanPhone);

        // Show loading and navigate
        await this.navigateToDemo();
    }

    /**
     * Show error message
     */
    showError(message) {
        this.phoneInput.classList.add('error');
        this.phoneError.textContent = message;
        this.phoneError.classList.add('show');

        // Remove error after 3 seconds
        setTimeout(() => {
            this.clearError();
        }, 3000);
    }

    /**
     * Clear error message
     */
    clearError() {
        this.phoneInput.classList.remove('error');
        this.phoneError.classList.remove('show');
        setTimeout(() => {
            this.phoneError.textContent = '';
        }, 300);
    }

    /**
     * Save phone number to localStorage
     */
    savePhoneNumber(phone) {
        try {
            localStorage.setItem('cordolium_phone', phone);
            localStorage.setItem('cordolium_phone_timestamp', Date.now().toString());
        } catch (error) {
            console.log('Could not save phone number:', error);
        }
    }

    /**
     * Check if phone number already exists
     */
    checkExistingPhone() {
        try {
            const savedPhone = localStorage.getItem('cordolium_phone');
            if (savedPhone) {
                // Format and pre-fill the phone number
                const formatted = this.formatSavedPhone(savedPhone);
                this.phoneInput.value = formatted;
            }
        } catch (error) {
            console.log('Could not retrieve phone number:', error);
        }
    }

    /**
     * Format saved phone number
     */
    formatSavedPhone(phone) {
        if (phone.length === 10) {
            return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6, 10)}`;
        }
        return phone;
    }

    /**
     * Navigate to voice demo with loading animation
     */
    async navigateToDemo() {
        // Disable button
        this.continueBtn.disabled = true;

        // Show loading overlay
        this.loadingOverlay.classList.add('active');

        // Wait for animation (realistic delay)
        await this.sleep(1500);

        // Navigate to voice demo
        window.location.href = 'live-interface.html';
    }

    /**
     * Skip to demo (for testing/director)
     */
    skipToDemo() {
        // Save a test phone number
        this.savePhoneNumber('5551234567');

        // Navigate directly
        window.location.href = 'live-interface.html';
    }

    /**
     * Sleep utility
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.phoneEntry = new PhoneEntry();
    });
} else {
    window.phoneEntry = new PhoneEntry();
}
