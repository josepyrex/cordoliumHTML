/**
 * Cordolium Website - Main JavaScript
 * Film prop for short film production
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Initialize all components
    initNavigation();
    initSmoothScrolling();
    initPermissionModal();
    initVoiceDemo();
    initCTAForm();
    initAnimations();
    initSecretKeyboardShortcuts();

    console.log('Cordolium Website Initialized - Ready for filming');
}

// Navigation scroll effects
function initNavigation() {
    const nav = document.querySelector('nav');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add scrolled class for styling
        if (scrollTop > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop;
    });

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        const navLinksItems = navLinks.querySelectorAll('a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const offset = 100; // Account for fixed nav
                const targetPosition = target.offsetTop - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Permission Modal functionality
function initPermissionModal() {
    const modal = document.getElementById('permissionModal');
    const startBtn = document.getElementById('startTalkingBtn');
    const allowBtn = document.getElementById('allowMicBtn');
    const denyBtn = document.getElementById('denyMicBtn');
    const overlay = modal?.querySelector('.modal-overlay');

    // Show modal when "Start Talking" is clicked
    if (startBtn) {
        startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showModal();
        });
    }

    // Handle Allow button
    if (allowBtn) {
        allowBtn.addEventListener('click', function() {
            handleMicrophonePermission(true);
            closeModal();
        });
    }

    // Handle Deny button
    if (denyBtn) {
        denyBtn.addEventListener('click', function() {
            handleMicrophonePermission(false);
            closeModal();
        });
    }

    // Close modal when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }

    function showModal() {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function handleMicrophonePermission(granted) {
        if (granted) {
            console.log('Microphone access granted');
            // Simulate starting AI conversation
            setTimeout(() => {
                showNotification('Simon AI is ready to talk with you.');
            }, 500);
        } else {
            console.log('Microphone access denied');
            showNotification('You can enable microphone access later in settings.');
        }
    }
}

// Voice Demo animations
function initVoiceDemo() {
    const voiceText = document.getElementById('voiceText');
    if (!voiceText) return;

    const voiceTexts = [
        "Hello. What can I help you with today?",
        "I understand. Tell me more about that.",
        "That makes sense. How are you feeling?",
        "I'm here to listen whenever you need.",
        "Would you like me to help you with that?",
        "I can help with calendar management, sending reminders, drafting emails.",
        "What's on your mind?",
        "Nice to meet you!"
    ];

    let textIndex = 0;

    // Rotate through voice texts
    setInterval(() => {
        textIndex = (textIndex + 1) % voiceTexts.length;
        voiceText.style.opacity = '0';

        setTimeout(() => {
            voiceText.textContent = `"${voiceTexts[textIndex]}"`;
            voiceText.style.opacity = '1';
        }, 300);
    }, 4000);
}

// CTA Form handling
function initCTAForm() {
    const emailInput = document.getElementById('emailInput');
    const requestBtn = document.getElementById('requestAccessBtn');

    if (requestBtn && emailInput) {
        requestBtn.addEventListener('click', function() {
            const email = emailInput.value.trim();

            if (validateEmail(email)) {
                // Simulate form submission
                requestBtn.textContent = 'Processing...';
                requestBtn.disabled = true;

                setTimeout(() => {
                    emailInput.value = '';
                    requestBtn.textContent = 'Request Sent!';
                    requestBtn.style.background = '#22c55e';

                    setTimeout(() => {
                        requestBtn.textContent = 'Request Access';
                        requestBtn.disabled = false;
                        requestBtn.style.background = '';
                    }, 3000);
                }, 1500);
            } else {
                emailInput.style.borderColor = '#ef4444';
                setTimeout(() => {
                    emailInput.style.borderColor = '';
                }, 2000);
            }
        });

        // Handle Enter key
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                requestBtn.click();
            }
        });
    }
}

// Initialize scroll-triggered animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });

    // Add parallax effect to hero background
    const heroBg = document.querySelector('.hero-bg-logo');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroBg.style.transform = `rotate(${scrolled * 0.1}deg)`;
        });
    }
}

// Secret keyboard shortcuts for accessing demo pages
function initSecretKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ignore if user is typing in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        // Check for secret shortcuts
        switch(e.key.toLowerCase()) {
            case 'v':
                // V = Voice Demo
                console.log('Secret shortcut: Opening Voice Demo');
                window.location.href = 'live-interface.html';
                break;
            case 't':
                // T = Text Demo
                console.log('Secret shortcut: Opening Text Demo');
                window.location.href = 'text-interface.html';
                break;
        }
    });

    console.log('Secret shortcuts enabled: Press V for Voice Demo, T for Text Demo');
}

// Utility Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--black);
        color: var(--white);
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 3000;
        animation: slideInUp 0.3s ease;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }

    .feature-card {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }

    .feature-card.animated {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Export functions for potential use in other scripts
window.CordoliumWebsite = {
    showModal: () => document.getElementById('permissionModal')?.classList.add('active'),
    closeModal: () => document.getElementById('permissionModal')?.classList.remove('active'),
    showNotification: showNotification
};
