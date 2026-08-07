/* ============================================
   LIVE REPOSITORY METADATA
   Hydrates the curated repo list in #work with data fetched from the public
   GitHub API at view time.

   Design notes, because the obvious version of this feature is worse:

   - The repo list is CURATED in the markup, not fetched. Which repositories
     are worth showing is an editorial decision that shouldn't change because
     something got a commit. Only the metadata is live.
   - The static markup is the fallback and is complete on its own. No JS, a
     rate limit, an offline visitor, GitHub down — the list still reads fine.
     This only ever adds.
   - Stars are deliberately not shown. Displaying a zero helps nobody, and a
     count that low is noise rather than signal either way.
   - Results are cached for six hours. The unauthenticated API allows 60
     requests per hour per IP and there is no reason to spend them on someone
     who reloads the page twice.
   ============================================ */

window.GitHubLive = (function () {
    'use strict';

    /* Set to false to stop showing "updated N months ago" and fall back to the
       static list alone.

       Leave it on if the repos are current. As of the last check the featured
       repositories were 3-7 months cold, and this widget says so on the
       homepage of a site whose argument is active AI security work. That is
       working as intended: the honest fix is a commit, not a switch. But the
       switch is here rather than buried, because publishing that number is a
       decision the site owner should be making deliberately. */
    const SHOW_FRESHNESS = true;

    const USER = 'chima-ukachukwu-sec';
    const CACHE_KEY = 'cu:gh:repos';
    const CACHE_MS = 6 * 60 * 60 * 1000;

    function readCache() {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            const { at, data } = JSON.parse(raw);
            if (Date.now() - at > CACHE_MS) return null;
            return data;
        } catch (e) { return null; }
    }

    function writeCache(data) {
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data })); }
        catch (e) { /* private mode, quota — the feature is optional */ }
    }

    /** "3 days ago" / "4 months ago" — coarse on purpose; exact dates invite
        a precision the data doesn't have. */
    function since(iso) {
        const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
        if (days <= 0) return 'today';
        if (days === 1) return 'yesterday';
        if (days < 30) return days + ' days ago';
        const months = Math.round(days / 30);
        if (months < 12) return months + (months === 1 ? ' month ago' : ' months ago');
        const years = Math.round(days / 365);
        return years + (years === 1 ? ' year ago' : ' years ago');
    }

    function fetchRepos() {
        const cached = readCache();
        if (cached) return Promise.resolve(cached);

        return fetch('https://api.github.com/users/' + USER + '/repos?per_page=100&sort=updated', {
            headers: { Accept: 'application/vnd.github+json' }
        })
            .then((r) => {
                if (!r.ok) throw new Error('github ' + r.status);
                return r.json();
            })
            .then((list) => {
                if (!Array.isArray(list)) throw new Error('unexpected payload');
                const data = {};
                list.forEach((r) => {
                    data[r.name] = { language: r.language || null, pushed: r.pushed_at };
                });
                writeCache(data);
                return data;
            });
    }

    /** Attaches live metadata to any [data-repo] element. Never removes or
        rewrites the static content — only appends. */
    function hydrate(root) {
        const nodes = (root || document).querySelectorAll('[data-repo]');
        if (!nodes.length) return Promise.resolve(0);

        return fetchRepos().then((data) => {
            let n = 0;
            nodes.forEach((el) => {
                const meta = data[el.getAttribute('data-repo')];
                if (!meta) return;
                const slot = el.querySelector('.repo-live');
                if (!slot) return;

                const bits = [];
                if (meta.language) bits.push(meta.language);
                if (SHOW_FRESHNESS && meta.pushed) bits.push('updated ' + since(meta.pushed));
                if (!bits.length) return;

                slot.textContent = bits.join(' · ');
                slot.hidden = false;
                n++;
            });
            return n;
        }).catch(() => 0);   // rate limited, offline, blocked — static list stands
    }

    return { hydrate: hydrate, since: since, USER: USER };
})();
