/* ============================================
   PORTFOLIO: CHIMA UKACHUKWU
   AI Security Analyst & Red Teamer
   Interactive Engine — Audited & Patched
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollEffects();
    initTypingAnimation();
    initStatsCounter();
    initSmoothScroll();
    initContactForm();
    initActiveNavHighlight();
});

/* ---------- MOBILE MENU ---------- */
function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu');
    const menu = document.querySelector('.nav-menu');
    const links = document.querySelectorAll('.nav-link');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('active')) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ---------- SCROLL EFFECTS ---------- */
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll(
        '.expertise-card, .portfolio-card, .cert-card, .proof-card, .stack-category, .highlight-item, .contact-method'
    );

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/* ---------- TYPING ANIMATION ---------- */
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const roles = [
        'AI Security Analyst',
        'SOC & Blue Team Specialist',
        'AI Red Teamer',
        'LLM Security Researcher',
        'Certified Cybersecurity Educator'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);
}

/* ---------- STATS COUNTER (PATCHED) ---------- */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (!statNumbers.length) return;

    let hasAnimated = false;
    let animationFrameId;

    const animateStats = () => {
        if (hasAnimated) return;
        hasAnimated = true;

        statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();
            const startValue = 0;

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const currentValue = startValue + (target - startValue) * eased;

                stat.textContent = Math.floor(currentValue);

                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            }

            animationFrameId = requestAnimationFrame(updateCounter);
        });
    };

    // Finish animation if interrupted by fast scroll
    const finishAnimation = () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            stat.textContent = target;
        });
        hasAnimated = true;
    };

    document.addEventListener('scrollend', () => {
        const heroRect = document.querySelector('.hero-stats')?.getBoundingClientRect();
        if (heroRect && heroRect.bottom < 0 && !hasAnimated) {
            finishAnimation();
        }
    });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(heroStats);
    } else {
        animateStats();
    }
}

/* ---------- SMOOTH SCROLL ---------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (!target) return;

            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* ---------- ACTIVE NAV HIGHLIGHT ---------- */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ---------- CONTACT FORM (PATCHED) ---------- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success');
    
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            shakeElement(form);
            return;
        }

        if (!isValidEmail(email)) {
            const emailInput = document.getElementById('email');
            emailInput.style.borderColor = 'var(--accent-danger)';
            emailInput.focus();
            setTimeout(() => {
                emailInput.style.borderColor = 'var(--border-color)';
            }, 2000);
            return;
        }

        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // ============================================
        // REPLACE WITH YOUR ACTUAL FORMSPREE FORM ID
        // Go to formspree.io → Create Form → Copy ID
        // ============================================
        const formspreeEndpoint = 'https://formspree.io/f/YOUR_FORM_ID';

        fetch(formspreeEndpoint, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                name: name,
                email: email,
                subject: document.getElementById('subject').value.trim(),
                message: message
            })
        })
        .then(response => {
            if (response.ok) {
                form.reset();
                form.style.display = 'none';
                successMessage.classList.remove('hidden');
                
                // Recovery: Allow sending another message without page reload
                if (!document.getElementById('send-another')) {
                    const sendAnother = document.createElement('button');
                    sendAnother.id = 'send-another';
                    sendAnother.className = 'btn btn-secondary';
                    sendAnother.style.cssText = 'margin-top: 16px;';
                    sendAnother.innerHTML = '<i class="fas fa-redo"></i> Send Another Message';
                    sendAnother.addEventListener('click', () => {
                        form.style.display = 'flex';
                        successMessage.classList.add('hidden');
                        sendAnother.remove();
                    });
                    successMessage.appendChild(sendAnother);
                }
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            alert('Something went wrong. Please email me directly at chima.ukachukwu@outlook.com');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function shakeElement(element) {
    element.style.animation = 'none';
    element.offsetHeight;
    element.style.animation = 'shake 0.5s ease';
    
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 50%, 90% { transform: translateX(-6px); }
        30%, 70% { transform: translateX(6px); }
    }
`;
document.head.appendChild(shakeStyle);

/* ---------- KEYBOARD NAVIGATION ---------- */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const menu = document.querySelector('.nav-menu');
        const toggle = document.getElementById('mobile-menu');
        if (menu && menu.classList.contains('active')) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

/* ---------- PARALLAX GRID EFFECT ---------- */
document.addEventListener('mousemove', (e) => {
    const grid = document.querySelector('.hero-bg-grid');
    if (!grid || window.innerWidth < 768) return;

    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

    grid.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

/* ---------- LOGGING ---------- */
console.log(
    '%c Chima Ukachukwu Portfolio %c v1.1 ',
    'background: #00d4aa; color: #0a0e14; padding: 6px 12px; font-weight: 700; border-radius: 4px 0 0 4px;',
    'background: #0f1419; color: #e6edf3; padding: 6px 12px; border-radius: 0 4px 4px 0;'
);
console.log('%c🔐 AI Security Analyst & Red Teamer', 'color: #8b949e; font-style: italic;');
console.log('%c💻 github.com/chima-ukachukwu-sec', 'color: #00a3ff;');
console.log('%c✅ Audited — 3 patches applied', 'color: #00d4aa; font-size: 0.8rem;');