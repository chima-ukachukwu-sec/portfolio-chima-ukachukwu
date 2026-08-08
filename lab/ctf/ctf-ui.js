/* UI layer for the CTF. All challenge logic lives in js/lib/ctf.js. */
(function () {
    'use strict';

    const CTF = window.AICTF;
    const form = /** @type {HTMLFormElement} */ (document.getElementById('ctf-form'));
    const input = /** @type {HTMLTextAreaElement} */ (document.getElementById('ctf-input'));
    const sendBtn = /** @type {HTMLButtonElement} */ (document.getElementById('ctf-send'));
    const resultEl = document.getElementById('ctf-result');
    const trackEl = document.getElementById('ctf-track');
    const countEl = document.getElementById('ctf-count');
    const hintBtn = document.getElementById('ctf-hint');
    const hintEl = document.getElementById('ctf-hint-text');

    if (!CTF || !form || !input) return;

    const KEY = 'cu:ctf';
    let current = 1;
    let solved = load();

    function load() {
        try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
    }
    function save() {
        try { localStorage.setItem(KEY, JSON.stringify(solved)); } catch (e) { /* private mode */ }
    }

    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));

    const DEFENCE_LABEL = {
        instruction: 'System-prompt instruction',
        blocklist: 'Keyword blocklist',
        output: 'Output scanning',
        identity: 'Identity re-assertion',
        boundary: 'Instruction/data separation'
    };

    function level() { return CTF.LEVELS.find((l) => l.n === current); }

    function renderTrack() {
        trackEl.innerHTML = CTF.LEVELS.map((l) => (
            '<button type="button" role="listitem" class="ctf-pip' +
                (solved[l.n] ? ' is-solved' : '') + (l.n === current ? ' is-current' : '') +
            '" data-level="' + l.n + '" aria-label="Level ' + l.n + ': ' + esc(l.name) +
            (solved[l.n] ? ' (captured)' : '') + '"' +
            (l.n === current ? ' aria-current="true"' : '') + '>' + l.n + '</button>'
        )).join('');
        trackEl.querySelectorAll('[data-level]').forEach((b) => {
            b.addEventListener('click', () => go(Number(b.getAttribute('data-level'))));
        });
        const n = Object.keys(solved).length;
        countEl.textContent = n + ' of ' + CTF.count + ' captured.' +
            (n === CTF.count ? ' All six. The last one is the point.' : '');
    }

    function renderLevel() {
        const l = level();
        document.getElementById('ctf-level-num').textContent = String(l.n).padStart(2, '0');
        document.getElementById('ctf-level-name').textContent = l.name;
        document.getElementById('ctf-level-brief').textContent = l.brief;

        const defs = document.getElementById('ctf-defences');
        defs.innerHTML = l.defences.length
            ? l.defences.map((d) => '<span class="ctf-defence-chip">' + esc(DEFENCE_LABEL[d] || d) + '</span>').join('')
            : '<span class="ctf-defence-chip none">No controls active</span>';

        hintEl.hidden = true;
        hintEl.textContent = l.hint;
        hintBtn.textContent = 'Show hint';

        resultEl.innerHTML = solved[l.n]
            ? '<p class="ctf-flag"><span>Captured</span><code>' + esc(solved[l.n]) + '</code></p>' +
              '<p class="ctf-lesson">' + esc(l.lesson) + '</p>'
            : '';
        input.value = '';
        sync();
        renderTrack();
    }

    function go(n) {
        if (n < 1 || n > CTF.count) return;
        current = n;
        renderLevel();
        input.focus();
    }

    function sync() { sendBtn.disabled = !input.value.trim(); }

    function submit() {
        const text = input.value.trim();
        if (!text) return;
        const l = level();
        const r = CTF.attempt(l.n, text);

        if (r.ok) {
            solved[l.n] = r.flag;
            save();
            resultEl.innerHTML =
                '<p class="ctf-flag"><span>Captured</span><code>' + esc(r.flag) + '</code></p>' +
                '<p class="ctf-lesson">' + esc(r.why) + '</p>' +
                (l.n < CTF.count
                    ? '<button type="button" class="sim-send ctf-advance">Level ' + (l.n + 1) + ' →</button>'
                    : '<p class="ctf-lesson">That is all six. The <a href="../injection-sim/index.html">simulator</a> shows the same controls as a matrix rather than a ladder.</p>');
            const adv = resultEl.querySelector('.ctf-advance');
            if (adv) adv.addEventListener('click', () => go(l.n + 1));
            renderTrack();
            if (window.plausible) plausible('ctf-solve', { props: { level: String(l.n) } });
        } else {
            resultEl.innerHTML =
                '<p class="ctf-miss' + (r.blocked ? ' is-blocked' : '') + '">' +
                (r.blocked ? '<span>' + esc(DEFENCE_LABEL[r.blocked] || r.blocked) + '</span>' : '<span>No</span>') +
                esc(r.why) + '</p>';
            if (window.plausible) plausible('ctf-attempt', { props: { level: String(l.n) } });
        }
        input.value = '';
        sync();
    }

    form.addEventListener('submit', (e) => { e.preventDefault(); submit(); });
    input.addEventListener('input', sync);
    input.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); submit(); }
    });

    hintBtn.addEventListener('click', () => {
        hintEl.hidden = !hintEl.hidden;
        hintBtn.textContent = hintEl.hidden ? 'Show hint' : 'Hide hint';
        if (!hintEl.hidden && window.plausible) plausible('ctf-hint', { props: { level: String(current) } });
    });

    document.getElementById('ctf-prev').addEventListener('click', () => go(current - 1));
    document.getElementById('ctf-next').addEventListener('click', () => go(current + 1));
    document.getElementById('ctf-reset').addEventListener('click', () => {
        solved = {}; save(); go(1);
    });

    // Resume where they left off.
    const done = Object.keys(solved).map(Number).sort((a, b) => a - b);
    current = done.length ? Math.min(done[done.length - 1] + 1, CTF.count) : 1;
    renderLevel();
})();
