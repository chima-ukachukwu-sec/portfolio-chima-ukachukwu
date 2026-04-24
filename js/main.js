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
    initTimeline();
    initTerminal();
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

/* ---------- CAREER TIMELINE ---------- */
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineProgress = document.querySelector('.timeline-progress');
    const filterButtons = document.querySelectorAll('.timeline-btn');
    
    if (!timelineItems.length) return;

    // Animate progress bar on scroll
    window.addEventListener('scroll', () => {
        const timeline = document.querySelector('.timeline-container');
        if (!timeline) return;
        
        const timelineRect = timeline.getBoundingClientRect();
        const timelineTop = timelineRect.top;
        const timelineHeight = timelineRect.height;
        const windowHeight = window.innerHeight;
        
        const scrollProgress = Math.max(0, Math.min(1, 
            (windowHeight - timelineTop) / (timelineHeight + windowHeight)
        ));
        
        if (timelineProgress) {
            timelineProgress.style.height = `${scrollProgress * 100}%`;
        }
    });

    // Filter functionality
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-view');
            
            timelineItems.forEach(item => {
                item.classList.remove('hidden-item');
                
                if (filter === 'all') return;
                
                const category = item.getAttribute('data-category');
                if (category !== filter) {
                    item.classList.add('hidden-item');
                }
            });
        });
    });

    // Reveal items on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.2 });

    timelineItems.forEach((item, index) => {
        const isLeft = item.classList.contains('left');
        item.style.opacity = '0';
        item.style.transform = isLeft ? 'translateX(-30px)' : 'translateX(30px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(item);
    });
}

/* ---------- LOGGING ---------- */
console.log(
    '%c Chima Ukachukwu Portfolio %c v1.1 ',
    'background: #00d4aa; color: #0a0e14; padding: 6px 12px; font-weight: 700; border-radius: 4px 0 0 4px;',
    'background: #0f1419; color: #e6edf3; padding: 6px 12px; border-radius: 0 4px 4px 0;'
);
console.log('%c🔐 AI Security Analyst & Red Teamer', 'color: #8b949e; font-style: italic;');
console.log('%c💻 github.com/chima-ukachukwu-sec', 'color: #00a3ff;');
console.log('%c✅ Audited — 3 patches applied', 'color: #00d4aa; font-size: 0.8rem;');

/* ---------- INTERACTIVE TERMINAL ---------- */
function initTerminal() {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    const body = document.getElementById('terminal-body');
    
    if (!input || !output) return;

    let commandHistory = [];
    let historyIndex = -1;

    const commands = {
        help: () => `
<span class="output-title">Available Commands</span>
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-success">whoami</span>        — Who I am
<span class="output-success">skills</span>        — Technical skill tree
<span class="output-success">certs</span>         — Certifications list
<span class="output-success">experience</span>    — Career summary
<span class="output-success">redteam</span>       — AI red teaming methodology
<span class="output-success">soc</span>           — SOC & defensive tools
<span class="output-success">education</span>     — Academic background
<span class="output-success">contact</span>       — Get in touch
<span class="output-success">github</span>        — Repository links
<span class="output-success">resume</span>        — Download resume
<span class="output-success">whois chima</span>  — Full profile
<span class="output-success">clear</span>         — Clear terminal
<span class="output-success">history</span>       — Command history
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-subtitle">Try: <span class="cmd-highlight">whoami</span> or <span class="cmd-highlight">skills</span></span>`,

        whoami: () => `
<span class="output-title">🛡️ Chima Ukachukwu</span>
<span class="output-subtitle">AI Security Analyst & Red Teamer</span>
<span class="output-divider">─────────────────────────────────────</span>
SOC-trained cybersecurity analyst operating at the intersection of traditional security operations and frontier AI security.

<span class="output-highlight">📍 Oklahoma City, USA</span>
<span class="output-highlight">🎓 M.S. Cybersecurity, OCU (First Class Honors, GPA 3.7)</span>
<span class="output-highlight">📜 24 Industry Certifications (CCEP, CTIGA, AI Security, Cisco CyberOps)</span>
<span class="output-highlight">💼 Active AI Red Teamer | Hobby Lobby SOC Alumnus</span>
<span class="output-highlight">⚡ 10+ Years IT Infrastructure Experience</span>

<span class="output-subtitle">I break AI systems to make them safer — and I build defenses that actually hold.</span>`,

        skills: () => {
            const skillData = [
                { name: 'Splunk (SIEM)', level: 85 },
                { name: 'Python Automation', level: 82 },
                { name: 'AI Red Teaming', level: 88 },
                { name: 'Prompt Injection Testing', level: 85 },
                { name: 'Threat Intelligence (MISP)', level: 80 },
                { name: 'Incident Response', level: 78 },
                { name: 'LLM Jailbreak Analysis', level: 87 },
                { name: 'GRC & Compliance', level: 75 },
                { name: 'Linux Administration', level: 80 },
                { name: 'AWS / Azure Security', level: 72 }
            ];
            
            let html = `<span class="output-title">⚡ Technical Skill Tree</span>
<span class="output-divider">──────────────────────────────────────────</span>
<div class="terminal-skill-tree">`;
            
            skillData.forEach(skill => {
                html += `
                <div class="terminal-skill-item">
                    <span style="min-width:160px;font-size:0.8rem;">${skill.name}</span>
                    <div class="terminal-skill-bar">
                        <div class="terminal-skill-fill" style="width:${skill.level}%"></div>
                    </div>
                    <span style="font-size:0.72rem;color:#8b949e;">${skill.level}%</span>
                </div>`;
            });
            
            html += `</div>`;
            return html;
        },

        certs: () => `
<span class="output-title">📜 Elite Certifications</span>
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-highlight">CCEP</span> — Certified Cybersecurity Educator Professional (Red Team Leaders, 2025)
<span class="output-highlight">CTIGA</span> — Certified Threat Intelligence & Governance Analyst (Red Team Leaders, 2026)
<span class="output-highlight">AI Security</span> — Securiti AI (2026)
<span class="output-highlight">CyberOps Associate</span> — Cisco (2025)
<span class="output-highlight">Microsoft Cybersecurity Analyst</span> — Full Specialization (2024)
<span class="output-highlight">Google Cybersecurity</span> — Professional Specialization (2023)
<span class="output-highlight">AWS Cloud Practitioner</span> — AWS (2022)
<span class="output-highlight">Microsoft Security, Compliance & Identity</span> — (2025)

<span class="output-subtitle">+ 16 additional certifications available on LinkedIn</span>`,

        experience: () => `
<span class="output-title">💼 Career Timeline</span>
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-highlight">2026–Present</span>  AI Security & Evaluation Specialist (Independent)
<span class="output-highlight">2024</span>          Cybersecurity Intern — Hobby Lobby Corporate IS
<span class="output-highlight">2021–2024</span>     Enterprise IT Support — Microsoft Vendor
<span class="output-highlight">2016–2017</span>     Technical Support Analyst — Hotels.ng
<span class="output-highlight">2015–2016</span>     E-Payments Intern — NIBSS (National Financial Infrastructure)
<span class="output-highlight">2014–2021</span>     IT Support & Systems Admin — Catholic Church Magodo
<span class="output-highlight">2011–2015</span>     Brand Representative — EXP Marketing Nigeria

<span class="output-subtitle">📍 Nigeria → United States | 10+ Years Progressive Growth</span>`,

        redteam: () => `
<span class="output-title">🔴 AI Red Teaming Methodology</span>
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-success">1.</span> Adversarial Prompt Testing — Jailbreak analysis against frontier LLMs
<span class="output-success">2.</span> Prompt Injection Assessments — Direct, indirect, and multimodal vectors
<span class="output-success">3.</span> Python Automation — Scalable test suites for batch evaluation
<span class="output-success">4.</span> Structured Evaluation — Governance-aligned safety frameworks
<span class="output-success">5.</span> Public Frameworks — Sanitized, NDA-compliant on GitHub

<span class="output-subtitle">🔗 github.com/chima-ukachukwu-sec/ai-red-teaming-frameworks</span>`,

        soc: () => `
<span class="output-title">🛡️ SOC & Defensive Stack</span>
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-success">SIEM:</span>        Splunk Enterprise Security
<span class="output-success">Threat Intel:</span> MISP (deployed & automated at Hobby Lobby)
<span class="output-success">WAF:</span>         Imperva
<span class="output-success">Scripting:</span>   Python (automation & enrichment)
<span class="output-success">IR:</span>          Structured incident response workflows
<span class="output-success">GRC:</span>         Risk management, compliance frameworks

<span class="output-subtitle">Enterprise SOC experience in a Fortune 500 environment</span>`,

        education: () => `
<span class="output-title">🎓 Education</span>
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-highlight">M.S. Computer Science — Cybersecurity</span>
Oklahoma City University | 2023–2025
GPA: 3.7 (First Class Honors)

<span class="output-highlight">Key Coursework:</span>
• Cybersecurity Risk Management
• Incident Response & Threat Intelligence
• Cloud Security (AWS, Azure)
• GRC (Governance, Risk & Compliance)
• Ethical Hacking & Network Defense

<span class="output-highlight">Training:</span>
• Per Scholas (450+ hours IT training)
• CodePath Cybersecurity
• ChooseU Junior Cloud Practitioner`,

        contact: () => `
<span class="output-title">📬 Let's Connect</span>
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-success">Email:</span>    <span class="output-link">chima.ukachukwu@outlook.com</span>
<span class="output-success">LinkedIn:</span>  <span class="output-link">linkedin.com/in/chima-ukachukwu</span>
<span class="output-success">GitHub:</span>    <span class="output-link">github.com/chima-ukachukwu-sec</span>
<span class="output-success">Portfolio:</span> <span class="output-link">chimaukachukwu.com</span>

<span class="output-subtitle">Open to: SOC Analyst | AI Security Analyst | AI Red Teamer | Consulting</span>`,

        github: () => `
<span class="output-title">📦 GitHub Repositories</span>
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-success">🔴 ai-red-teaming-frameworks</span>
  → Jailbreak taxonomy, prompt injection testing, automated test suite

<span class="output-success">🛡️ soc-defensive-portfolio</span>
  → MISP automation, Splunk walkthrough, Forage simulations

<span class="output-success">🌐 portfolio-chima-ukachukwu</span>
  → This portfolio site — HTML, CSS, vanilla JS

<span class="output-subtitle">🔗 github.com/chima-ukachukwu-sec</span>`,

        resume: () => `
<span class="output-title">📄 Resume</span>
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-success">Download:</span> <span class="output-link">assets/resume/chima-ukachukwu-resume.pdf</span>

<span class="output-subtitle">Type <span class="cmd-highlight">experience</span> for career summary</span>`,

        'whois chima': () => `
<span class="output-title">WHOIS: chima-ukachukwu</span>
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-success">Registrant:</span> Chima Anthony Ukachukwu
<span class="output-success">Organization:</span> Independent AI Security Researcher
<span class="output-success">Location:</span>    Oklahoma City, OK, United States
<span class="output-success">Domain:</span>      chimaukachukwu.com
<span class="output-success">Specialty:</span>   AI Red Teaming, SOC Operations, LLM Security
<span class="output-success">Status:</span>      Active — Available for Opportunities
<span class="output-success">Created:</span>     2014 (10+ years IT infrastructure experience)
<span class="output-success">Updated:</span>     2026 (M.S. Cybersecurity, 24 certifications)
<span class="output-success">Source:</span>      github.com/chima-ukachukwu-sec`,

        history: () => {
            if (commandHistory.length === 0) return '<span class="output-subtitle">No commands yet. Start typing!</span>';
            return `<span class="output-title">Command History</span>
<span class="output-divider">────────────────────</span>
${commandHistory.map((cmd, i) => `<span class="output-subtitle">${i + 1}.</span> ${cmd}`).join('<br>')}`;
        },

        nmap: (args) => {
            const target = args || 'localhost';
            return `
<span class="output-title">Starting Nmap scan on ${target}</span>
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-success">PORT     STATE    SERVICE</span>
22/tcp   open     ssh
80/tcp   open     http
443/tcp  open     https
3306/tcp filtered mysql
8080/tcp open     http-proxy

<span class="output-subtitle">Nmap done: 1 IP address scanned in 2.34 seconds</span>
<span class="output-highlight">⚠️ Just kidding. This is a portfolio terminal.</span>`;
        }
    };

    function executeCommand(cmdString) {
        const trimmed = cmdString.trim().toLowerCase();
        
        if (!trimmed) return '';
        
        commandHistory.push(trimmed);
        historyIndex = commandHistory.length;

        // Parse command and args
        let cmd = trimmed;
        let args = '';
        
        if (trimmed.startsWith('nmap ')) {
            cmd = 'nmap';
            args = trimmed.substring(5);
        }

        if (cmd === 'clear') {
            output.innerHTML = '';
            return '';
        }

        if (commands[cmd]) {
            return commands[cmd](args);
        }

        if (cmd === 'ls') {
            return `
<span class="output-success">skills.txt</span>    <span class="output-success">certs.txt</span>     <span class="output-success">experience.log</span>
<span class="output-success">redteam/</span>      <span class="output-success">soc/</span>          <span class="output-success">education.pdf</span>
<span class="output-success">contact.txt</span>   <span class="output-success">resume.pdf</span>    <span class="output-success">github.lnk</span>

<span class="output-subtitle">Use <span class="cmd-highlight">cat [filename]</span> to view. Example: <span class="cmd-highlight">cat skills.txt</span></span>`;
        }

        if (cmd.startsWith('cat ')) {
            const file = cmd.substring(4).trim();
            const fileMap = {
                'skills.txt': 'skills',
                'certs.txt': 'certs',
                'experience.log': 'experience',
                'education.pdf': 'education',
                'contact.txt': 'contact',
                'resume.pdf': 'resume',
                'readme.md': 'whoami'
            };
            if (fileMap[file]) {
                return commands[fileMap[file]]();
            }
            return `<span class="output-error">cat: ${file}: No such file or directory</span>`;
        }

        return `<span class="output-error">Command not found: ${trimmed}</span>
<span class="output-subtitle">Type <span class="cmd-highlight">help</span> to see available commands.</span>`;
    }

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const cmd = input.value;
            
            // Display the command
            const cmdLine = document.createElement('div');
            cmdLine.className = 'terminal-output-line';
            cmdLine.innerHTML = `<span class="prompt">┌──(chima㉿portfolio)-[~]</span><br><span class="prompt">└─$</span> <span class="command">${cmd}</span>`;
            output.appendChild(cmdLine);

            // Execute and display result
            const result = executeCommand(cmd);
            if (result) {
                const resultLine = document.createElement('div');
                resultLine.className = 'terminal-output-line';
                resultLine.innerHTML = result;
                output.appendChild(resultLine);
            }

            // Scroll to bottom
            body.scrollTop = body.scrollHeight;
            
            input.value = '';
        }

        // Arrow up for history
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex] || '';
            }
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex] || '';
            } else {
                historyIndex = commandHistory.length;
                input.value = '';
            }
        }
    });

    // Click to focus input
    body.addEventListener('click', () => input.focus());

    // Clickable help hints
    document.querySelectorAll('.cmd-highlight').forEach(el => {
        el.addEventListener('click', function(e) {
            e.stopPropagation();
            input.value = this.textContent;
            input.focus();
        });
    });
}

// Global clear function for the clear button
function clearTerminal() {
    const output = document.getElementById('terminal-output');
    if (output) output.innerHTML = '';
}