/* ============================================
   PORTFOLIO: CHIMA UKACHUKWU
   AI Security Analyst & Red Teamer
   ============================================ */

/* Single source of truth for motion preference. Everything that animates
   checks this, and re-checks when the user changes the OS setting. */
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const prefersReducedMotion = () => motionQuery.matches;

/* Coalesces bursty events (scroll, mousemove) into one write per frame so we
   never read layout and write styles more than once per repaint. */
function rafThrottle(fn) {
    let scheduled = false;
    return (...args) => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
            scheduled = false;
            fn(...args);
        });
    };
}

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initNavbarScrollState();
    initScrollReveal();
    initHeroProbe();
    initSmoothScroll();
    initContactForm();
    initActiveNavHighlight();
    initTimeline();
    initTerminal();
    initHeroParallax();
});

/* ---------- MOBILE MENU ---------- */
function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu');
    const menu = document.querySelector('.nav-menu');
    const links = document.querySelectorAll('.nav-link');

    if (!toggle || !menu) return;

    const setOpen = (open) => {
        toggle.classList.toggle('active', open);
        menu.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', () => {
        setOpen(!menu.classList.contains('active'));
    });

    links.forEach(link => {
        link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('active')) {
            setOpen(false);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            setOpen(false);
            toggle.focus();
        }
    });
}

/* ---------- NAVBAR SCROLL STATE ----------
   scrollY only; coalesced to one class write per frame. */
function initNavbarScrollState() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const update = rafThrottle(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    update();
    window.addEventListener('scroll', update, { passive: true });
}

/* ---------- SCROLL REVEAL ----------
   State lives in CSS classes, not inline styles, so the initial hidden state
   is only ever applied when an observer exists to undo it. Elements are
   unobserved once revealed. Skipped entirely under reduced motion. */
function initScrollReveal() {
    const elements = document.querySelectorAll(
        '.expertise-card, .portfolio-card, .cert-card, .proof-card, .stack-category, .highlight-item, .contact-method'
    );

    if (!elements.length) return;
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });
}

/* ---------- HERO PROBE ----------
   A compact front end over the same classifier that powers /demo/. The
   taxonomy itself lives in js/lib/taxonomy.js so the two can never drift. */
function initHeroProbe() {
    const input = document.getElementById('probe-input');
    const runBtn = document.getElementById('probe-run');
    const results = document.getElementById('probe-results');
    const chips = document.querySelectorAll('.probe-chip');
    const lib = window.RedTeamTaxonomy;

    if (!input || !runBtn || !results) return;

    // The probe is an enhancement. If the taxonomy failed to load, leave the
    // markup inert and let the link to the full detector do the work.
    if (!lib) {
        runBtn.disabled = true;
        results.innerHTML = '<p class="probe-empty">Classifier unavailable — the full detector still works.</p>';
        return;
    }

    const RISK_LABEL = {
        none: 'clean', low: 'low', medium: 'medium', high: 'high', critical: 'critical'
    };

    const syncState = () => { runBtn.disabled = !input.value.trim(); };

    const clearResults = () => { results.innerHTML = ''; };

    const classify = () => {
        const { matches } = lib.analyze(input.value);
        const score = lib.scoreFromMatches(matches);
        const level = RISK_LABEL[score.level] || score.level;

        if (!matches.length) {
            results.innerHTML =
                `<p class="probe-verdict risk-${score.level}">` +
                `<span class="probe-dot" aria-hidden="true"></span>No adversarial pattern matched</p>` +
                `<p class="probe-note">Pattern matching misses novel attacks. That limitation is the ` +
                `reason manual red teaming still exists.</p>`;
        } else {
            const chipsHtml = matches.map(m =>
                `<span class="probe-hit">${lib.escapeHtml(m.category.name)}</span>`
            ).join('');
            results.innerHTML =
                `<p class="probe-verdict risk-${score.level}">` +
                `<span class="probe-dot" aria-hidden="true"></span>` +
                `${lib.escapeHtml(level)} · ${matches.length} ` +
                `${matches.length === 1 ? 'category' : 'categories'} matched</p>` +
                `<div class="probe-hits">${chipsHtml}</div>`;
        }

        if (window.plausible) plausible('hero-probe-run');
    };

    runBtn.addEventListener('click', () => { if (!runBtn.disabled) classify(); });
    input.addEventListener('input', () => { syncState(); clearResults(); });
    input.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') runBtn.click();
    });

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const text = lib.EXAMPLES[chip.getAttribute('data-example')];
            if (!text) return;
            input.value = text;
            syncState();
            classify();
            if (window.plausible) plausible('hero-probe-example');
        });
    });

    syncState();
}

/* ---------- SMOOTH SCROLL ---------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: prefersReducedMotion() ? 'auto' : 'smooth'
            });
        });
    });
}

/* ---------- ACTIVE NAV HIGHLIGHT ----------
   IntersectionObserver instead of a scroll handler: no layout reads at all.
   The top margin matches the navbar so a section counts as "current" once it
   clears the fixed header. */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

    const visible = new Set();

    const setActive = (id) => {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) visible.add(entry.target);
            else visible.delete(entry.target);
        });

        if (!visible.size) return;

        // Topmost section currently in the viewport wins.
        const current = [...visible].sort(
            (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
        )[0];
        setActive(current.id);
    }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
}

/* ---------- HERO PARALLAX ----------
   Coalesced to one transform write per frame, and disabled for reduced motion,
   touch input, and small viewports. */
function initHeroParallax() {
    const grid = document.querySelector('.hero-bg-grid');
    if (!grid) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const move = rafThrottle((clientX, clientY) => {
        if (window.innerWidth < 768) return;
        const moveX = (clientX - window.innerWidth / 2) * 0.01;
        const moveY = (clientY - window.innerHeight / 2) * 0.01;
        grid.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    document.addEventListener('mousemove', (e) => move(e.clientX, e.clientY), { passive: true });
}

/* ---------- CONTACT FORM ---------- */
const SPINNER_SVG = '<svg class="btn-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>';
const REDO_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>';

function initContactForm() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success');

    if (!form) return;

    // hCaptcha is ~200KB of third-party JS for a form most visitors never
    // reach. Load it on first interaction instead of on every page view.
    let captchaRequested = false;
    const loadCaptcha = () => {
        if (captchaRequested) return;
        captchaRequested = true;
        const script = document.createElement('script');
        script.src = 'https://js.hcaptcha.com/1/api.js';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    };
    form.addEventListener('focusin', loadCaptcha, { once: true });
    form.addEventListener('pointerdown', loadCaptcha, { once: true });

    form.addEventListener('submit', function (e) {
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

        const captchaResponse = (typeof hcaptcha !== 'undefined')
            ? hcaptcha.getResponse()
            : (document.querySelector('[name="h-captcha-response"]')?.value || '');
        if (!captchaResponse) {
            shakeElement(form);
            const captchaWidget = document.querySelector('.h-captcha');
            if (captchaWidget) {
                captchaWidget.style.outline = '2px solid var(--accent-danger)';
                setTimeout(() => { captchaWidget.style.outline = ''; }, 2000);
            }
            return;
        }

        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `${SPINNER_SVG} Sending...`;
        submitBtn.disabled = true;

        fetch('https://formspree.io/f/xjgjqogk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                subject: document.getElementById('subject').value.trim(),
                message: message,
                'h-captcha-response': captchaResponse
            })
        })
            .then(response => {
                if (!response.ok) throw new Error('Form submission failed');

                form.reset();
                form.style.display = 'none';
                successMessage.classList.remove('hidden');

                // Let the visitor send a second message without a page reload.
                if (!document.getElementById('send-another')) {
                    const sendAnother = document.createElement('button');
                    sendAnother.id = 'send-another';
                    sendAnother.type = 'button';
                    sendAnother.className = 'btn btn-secondary';
                    sendAnother.style.cssText = 'margin-top: 16px;';
                    sendAnother.innerHTML = `${REDO_SVG} Send Another Message`;
                    sendAnother.addEventListener('click', () => {
                        form.style.display = 'flex';
                        successMessage.classList.add('hidden');
                        sendAnother.remove();
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        if (typeof hcaptcha !== 'undefined') hcaptcha.reset();
                        document.getElementById('name').focus();
                    });
                    successMessage.appendChild(sendAnother);
                }
            })
            .catch(() => {
                showFormError(form, 'Something went wrong. Please email me directly at chima.ukachukwu.sec@gmail.com');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });
}

function showFormError(form, text) {
    let banner = form.querySelector('.form-error');
    if (!banner) {
        banner = document.createElement('p');
        banner.className = 'form-error';
        banner.setAttribute('role', 'alert');
        form.appendChild(banner);
    }
    banner.textContent = text;
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function shakeElement(element) {
    if (prefersReducedMotion()) return;
    element.classList.remove('shake');
    void element.offsetWidth; // restart the animation
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 500);
}

/* ---------- CAREER TIMELINE ---------- */
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineProgress = document.querySelector('.timeline-progress');
    const filterButtons = document.querySelectorAll('.timeline-btn');
    const timeline = document.querySelector('.timeline-container');

    if (!timelineItems.length) return;

    if (timeline && timelineProgress) {
        const updateProgress = rafThrottle(() => {
            const rect = timeline.getBoundingClientRect();
            const scrollProgress = Math.max(0, Math.min(1,
                (window.innerHeight - rect.top) / (rect.height + window.innerHeight)
            ));
            timelineProgress.style.height = `${scrollProgress * 100}%`;
        });

        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress, { passive: true });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            const filter = btn.getAttribute('data-view');
            let shown = 0;

            timelineItems.forEach(item => {
                const hide = filter !== 'all' && item.getAttribute('data-category') !== filter;
                item.classList.toggle('hidden-item', hide);
                item.toggleAttribute('inert', hide);
                if (!hide) shown++;
            });

            const status = document.getElementById('timeline-status');
            if (status) {
                status.textContent = `Showing ${shown} of ${timelineItems.length} career milestones.`;
            }
        });
    });

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.2 });

    timelineItems.forEach((item, index) => {
        item.classList.add('reveal-timeline');
        item.style.setProperty('--reveal-delay', `${index * 0.1}s`);
        observer.observe(item);
    });
}

/* ---------- INTERACTIVE TERMINAL ---------- */
function initTerminal() {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    const body = document.getElementById('terminal-body');

    if (!input || !output) return;

    let commandHistory = [];
    let historyIndex = -1;

    // Null-prototype so user input can never resolve to Object.prototype
    // members (`constructor`, `toString`, …) and get invoked as a command.
    const commands = Object.assign(Object.create(null), {
        help: () => `
<span class="output-title">Available Commands</span>
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-success">whoami</span>        — Who I am
<span class="output-success">skills</span>        — Skills, and the work that evidences them
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
<span class="output-title">Chima Ukachukwu</span>
<span class="output-subtitle">AI Security Analyst & Red Teamer</span>
<span class="output-divider">─────────────────────────────────────</span>
SOC-trained cybersecurity analyst operating at the intersection of traditional security operations and frontier AI security.

<span class="output-highlight">Oklahoma City, USA</span>
<span class="output-highlight">M.S. Cybersecurity, OCU (GPA 3.7 / 4.0)</span>
<span class="output-highlight">Industry certifications + ongoing training (CCEP, CTIGA, Securiti AI, Cisco CyberOps)</span>
<span class="output-highlight">Active AI Red Teamer | Hobby Lobby SOC Alumnus</span>
<span class="output-highlight">A decade of progressive IT and cybersecurity experience</span>

<span class="output-subtitle">I break AI systems to make them safer — and I build defenses that actually hold.</span>`,

        /* Evidence, not self-assessed percentages: each skill points at the
           work that demonstrates it. */
        skills: () => {
            const skills = [
                ['Splunk (SIEM)', 'Alert triage and log analysis in a live Fortune 500 SOC — Hobby Lobby Corporate IS, 2024'],
                ['Threat Intel (MISP)', 'Deployed MISP + Python feed automation in production — see the MISP case study'],
                ['AI Red Teaming', 'Ongoing adversarial testing against frontier LLMs across six evaluation platforms'],
                ['Prompt Injection', 'Direct, indirect and multimodal assessments — published testing framework on GitHub'],
                ['Jailbreak Analysis', 'Sanitized jailbreak taxonomy — try the live classifier at /demo/'],
                ['Python Automation', 'Threat-feed enrichment pipelines and batch adversarial test suites'],
                ['AI Agent Evaluation', 'Multi-agent pipeline design and scoring — see the Adverse Insight case study'],
                ['Incident Response', 'Structured IR workflows and post-incident documentation'],
                ['GRC & Compliance', 'CTIGA credential; governance-aligned AI evaluation reporting'],
                ['Cloud (AWS / Azure)', 'AWS Cloud Practitioner, Azure AI Fundamentals; cloud security coursework (M.S.)']
            ];

            return `<span class="output-title">Skills & Evidence</span>
<span class="output-divider">──────────────────────────────────────────</span>
<div class="terminal-skill-tree">${skills.map(([name, proof]) => `
                <div class="terminal-skill-item">
                    <span class="terminal-skill-name">${name}</span>
                    <span class="terminal-skill-proof">${proof}</span>
                </div>`).join('')}</div>
<span class="output-subtitle">Every line above maps to a repo, a case study, or a role — not a self-rating.</span>`;
        },

        certs: () => `
<span class="output-title">Certifications & Training</span>
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-highlight">CCEP</span> — Certified Cybersecurity Educator Professional (Red Team Leaders, 2025)
<span class="output-highlight">CTIGA</span> — Certified Threat Intelligence & Governance Analyst (Red Team Leaders, 2026)
<span class="output-highlight">AI Security</span> — Securiti AI (2026)
<span class="output-highlight">CyberOps Associate</span> — Cisco (2025)
<span class="output-highlight">Microsoft Cybersecurity Analyst</span> — Full Specialization (2024)
<span class="output-highlight">Google Cybersecurity</span> — Professional Specialization (2023)
<span class="output-highlight">AWS Cloud Practitioner</span> — AWS (2022)
<span class="output-highlight">Microsoft Security, Compliance & Identity</span> — (2025)

<span class="output-subtitle">+ Applied training: Azure AI Fundamentals, TryHackMe paths, TCM Security, Forage simulations. Full list on LinkedIn.</span>`,

        experience: () => `
<span class="output-title">Career Timeline</span>
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-highlight">2024–Present</span>  AI Evaluation & Safety Specialist — Independent / Contract
<span class="output-highlight">Sep 2025 – Jan 2026</span>  Cyber Security Expert Fellow (AI Safety) — Handshake
<span class="output-highlight">2024</span>          Cybersecurity Intern — Hobby Lobby Corporate IS
<span class="output-highlight">2023–Present</span>  Cybersecurity Apprentice — Cybersecurity Clarity
<span class="output-highlight">2021–2024</span>     Enterprise IT Support — Authorized Microsoft Vendor (via Upwork)
<span class="output-highlight">2016–2017</span>     Technical Support Analyst — Hotels.ng
<span class="output-highlight">2015</span>          E-Payments Intern — NIBSS
<span class="output-highlight">2014–2021</span>     IT Support & Systems Admin — Catholic Church Magodo

<span class="output-subtitle">Nigeria → United States | A Decade of Progressive Growth</span>`,

        redteam: () => `
<span class="output-title">AI Red Teaming Methodology</span>
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-success">1.</span> Adversarial Prompt Testing — Jailbreak analysis against frontier LLMs
<span class="output-success">2.</span> Prompt Injection Assessments — Direct, indirect, and multimodal vectors
<span class="output-success">3.</span> Python Automation — Scalable test suites for batch evaluation
<span class="output-success">4.</span> Structured Evaluation — Governance-aligned safety frameworks
<span class="output-success">5.</span> Public Frameworks — Sanitized, NDA-compliant on GitHub

<span class="output-subtitle">github.com/chima-ukachukwu-sec/ai-red-teaming-frameworks</span>`,

        soc: () => `
<span class="output-title">SOC & Defensive Stack</span>
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-success">SIEM:</span>        Splunk Enterprise Security
<span class="output-success">Threat Intel:</span> MISP (deployed & automated at Hobby Lobby)
<span class="output-success">WAF:</span>         Imperva
<span class="output-success">Scripting:</span>   Python (automation & enrichment)
<span class="output-success">IR:</span>          Structured incident response workflows
<span class="output-success">GRC:</span>         Risk management, compliance frameworks

<span class="output-subtitle">Enterprise SOC experience in a Fortune 500 environment</span>`,

        education: () => `
<span class="output-title">Education</span>
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-highlight">M.S. Cybersecurity</span>
Oklahoma City University | 2023–2025
GPA: 3.7 / 4.0

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
<span class="output-title">Let's Connect</span>
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-success">Email:</span>    <span class="output-link">chima.ukachukwu.sec@gmail.com</span>
<span class="output-success">LinkedIn:</span>  <span class="output-link">linkedin.com/in/chima-anthony-u</span>
<span class="output-success">GitHub:</span>    <span class="output-link">github.com/chima-ukachukwu-sec</span>
<span class="output-success">Portfolio:</span> <span class="output-link">chimaukachukwu.com</span>

<span class="output-subtitle">Open to: SOC Analyst | AI Security Analyst | AI Red Teamer | Consulting</span>`,

        github: () => `
<span class="output-title">GitHub Repositories</span>
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-success">adverse-insight</span>
  → Live app · 3-agent contract risk analyzer (Streamlit + OpenAI)
  → Demo: <span class="output-link">adverse-insight.streamlit.app</span>

<span class="output-success">ai-evaluation-safety-portfolio</span>
  → NDA-compliant AI evaluation, safety, and red-teaming case studies

<span class="output-success">ai-red-teaming-frameworks</span>
  → Jailbreak taxonomy, prompt injection testing, automated test suite

<span class="output-success">soc-defensive-portfolio</span>
  → MISP automation, Splunk walkthrough, Forage simulations

<span class="output-success">portfolio-chima-ukachukwu</span>
  → This portfolio site — HTML, CSS, vanilla JS

<span class="output-subtitle">github.com/chima-ukachukwu-sec</span>`,

        resume: () => `
<span class="output-title">Resume</span>
<span class="output-divider">─────────────────────────────────────</span>
<span class="output-success">Download:</span> <span class="output-link">assets/resume/chima-ukachukwu-resume.pdf</span>
<span class="output-success">Web version:</span> <span class="output-link">chimaukachukwu.com/resume/</span>

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
<span class="output-success">Created:</span>     2014 (a decade of progressive IT and cybersecurity experience)
<span class="output-success">Updated:</span>     2026 (M.S. Cybersecurity, industry certifications + ongoing training)
<span class="output-success">Source:</span>      github.com/chima-ukachukwu-sec`,

        ls: () => `
<span class="output-success">skills.txt</span>    <span class="output-success">certs.txt</span>     <span class="output-success">experience.log</span>
<span class="output-success">redteam/</span>      <span class="output-success">soc/</span>          <span class="output-success">education.pdf</span>
<span class="output-success">contact.txt</span>   <span class="output-success">resume.pdf</span>    <span class="output-success">github.lnk</span>

<span class="output-subtitle">Use <span class="cmd-highlight">cat [filename]</span> to view. Example: <span class="cmd-highlight">cat skills.txt</span></span>`,

        history: () => {
            if (commandHistory.length === 0) return '<span class="output-subtitle">No commands yet. Start typing!</span>';
            return `<span class="output-title">Command History</span>
<span class="output-divider">────────────────────</span>
${commandHistory.map((cmd, i) => `<span class="output-subtitle">${i + 1}.</span> ${escapeHtml(cmd)}`).join('<br>')}`;
        }
    });

    const fileMap = Object.assign(Object.create(null), {
        'skills.txt': 'skills',
        'certs.txt': 'certs',
        'experience.log': 'experience',
        'education.pdf': 'education',
        'contact.txt': 'contact',
        'resume.pdf': 'resume',
        'readme.md': 'whoami'
    });

    function executeCommand(cmdString) {
        const trimmed = cmdString.trim().toLowerCase();
        if (!trimmed) return '';

        commandHistory.push(trimmed);
        historyIndex = commandHistory.length;

        if (trimmed === 'clear') {
            output.innerHTML = '';
            return '';
        }

        if (commands[trimmed]) {
            return commands[trimmed]();
        }

        if (trimmed.startsWith('cat ')) {
            const file = trimmed.slice(4).trim();
            if (fileMap[file]) return commands[fileMap[file]]();
            return `<span class="output-error">cat: ${escapeHtml(file)}: No such file or directory</span>`;
        }

        return `<span class="output-error">Command not found: ${escapeHtml(trimmed)}</span>
<span class="output-subtitle">Type <span class="cmd-highlight">help</span> to see available commands.</span>`;
    }

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const cmd = input.value;

            const cmdLine = document.createElement('div');
            cmdLine.className = 'terminal-output-line';
            cmdLine.innerHTML =
                '<span class="prompt">┌──(chima㉿portfolio)-[~]</span><br>' +
                `<span class="prompt">└─$</span> <span class="command">${escapeHtml(cmd)}</span>`;
            output.appendChild(cmdLine);

            const result = executeCommand(cmd);
            if (result) {
                const resultLine = document.createElement('div');
                resultLine.className = 'terminal-output-line';
                resultLine.innerHTML = result;
                output.appendChild(resultLine);
            }

            body.scrollTop = body.scrollHeight;
            input.value = '';
        }

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

    // Clicking the terminal chrome focuses the prompt, but never steal focus
    // from something the visitor is actually interacting with.
    body.addEventListener('click', (e) => {
        if (e.target.closest('button, a, input')) return;
        input.focus();
    });

    document.querySelectorAll('.cmd-highlight').forEach(el => {
        el.addEventListener('click', function (e) {
            e.stopPropagation();
            input.value = this.textContent;
            input.focus();
        });
    });
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (ch) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
}

// Global clear function for the terminal's Clear button.
function clearTerminal() {
    const output = document.getElementById('terminal-output');
    if (output) output.innerHTML = '';
    document.getElementById('terminal-input')?.focus();
}

console.log(
    '%c Chima Ukachukwu %c AI Security Analyst & Red Teamer — hiring? chima.ukachukwu.sec@gmail.com ',
    'background: #00d4aa; color: #0a0e14; padding: 6px 12px; font-weight: 700; border-radius: 4px 0 0 4px;',
    'background: #0f1419; color: #e6edf3; padding: 6px 12px; border-radius: 0 4px 4px 0;'
);
