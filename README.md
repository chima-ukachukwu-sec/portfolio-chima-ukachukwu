# portfolio-chima-ukachukwu

Source for **[chimaukachukwu.com](https://chimaukachukwu.com)** — the personal site of Chima Anthony Ukachukwu (AI Security Analyst & Red Teamer, Oklahoma City).

Static site: HTML / CSS / JavaScript, no framework, no build step. Deployed via GitHub Pages from `main`.

---

## What's here

| Route | What it is |
|---|---|
| [`/`](https://chimaukachukwu.com/) | Homepage — about, expertise, portfolio, certifications, tech stack, career timeline, interactive terminal, contact |
| [`/blog/`](https://chimaukachukwu.com/blog/) | Writing on AI security, SOC, and the bridge between them |
| [`/blog/posts/the-bridge.html`](https://chimaukachukwu.com/blog/posts/the-bridge.html) | *The Bridge — Why AI Security Needs SOC People, and SOC Needs AI Red Teamers* |
| [`/lab/pattern-detector/`](https://chimaukachukwu.com/lab/pattern-detector/) | Interactive AI Red Team Pattern Detector — paste a prompt, see which jailbreak categories it matches. Runs entirely client-side |
| [`/portfolio/case-studies/`](https://chimaukachukwu.com/#portfolio) | Long-form case studies: Adverse Insight, Hobby Lobby MISP, AI Red Teaming Frameworks |
| [`/resume/`](https://chimaukachukwu.com/resume/) | HTML resume (PDF version in `assets/resume/`) |
| [`/now/`](https://chimaukachukwu.com/now/) | What I'm currently working on, building, learning, and open to |
| [`/404.html`](https://chimaukachukwu.com/404.html) | Branded 404 page |

---

## Stack

- **HTML / CSS / vanilla JS.** One stylesheet (`css/style.css`, ~2,300 lines), one behavior file (`js/main.js`, ~830 lines).
- **No framework, no bundler, no build step.** Edit a file, push, GitHub Pages serves it.
- **No backend.** The contact form posts to [Formspree](https://formspree.io); the pattern-detector demo runs entirely in the browser.
- **Privacy-friendly analytics** via [Plausible](https://plausible.io) — no cookies, no personal data collected.
- **hCaptcha** on the contact form to discourage bot submissions.

---

## Local preview

The site is fully static, so opening `index.html` in a browser works for most things. For better fidelity (relative paths between routes, the `/blog/` and `/lab/pattern-detector/` sub-paths), run a one-line local server:

```bash
git clone https://github.com/chima-ukachukwu-sec/portfolio-chima-ukachukwu.git
cd portfolio-chima-ukachukwu
python3 -m http.server 8000
# visit http://localhost:8000
```

---

## Deployment

GitHub Pages auto-deploys on push to `main`. The `CNAME` file maps the apex domain `chimaukachukwu.com` to the Pages site; DNS is managed externally.

`sitemap.xml` and `robots.txt` are published at the site root; an RSS feed lives at `/blog/feed.xml`.

---

## Accessibility

The site passes WCAG 2.1 AA on the basics:

- Semantic landmarks (`<main>`, `<nav>`, `<footer>`) on every page
- "Skip to content" link on every page
- Visible keyboard focus ring (`:focus-visible`) sitewide
- Body text contrast ≥ 4.5:1 against both background tones
- Heading hierarchy with no skipped levels
- Form labels properly associated with inputs

The interactive AI red team demo at `/lab/pattern-detector/` has been independently polished: example chips are real `<button>`s, the textarea has a screen-reader label, results announce via `aria-live`, and the `⌘/Ctrl + Enter` keyboard shortcut is visibly documented.

---

## Repo structure

```
portfolio-chima-ukachukwu/
├── index.html                          # homepage
├── 404.html                            # branded 404
├── CNAME                               # apex domain mapping
├── sitemap.xml  /  robots.txt          # SEO
├── css/style.css                       # single stylesheet
├── js/main.js                          # single behavior file
├── assets/
│   ├── images/                         # profile + OG card
│   └── resume/                         # downloadable PDF
├── blog/
│   ├── index.html
│   ├── feed.xml
│   └── posts/                          # individual posts
├── demo/                               # AI red team pattern detector
├── now/                                # /now page
├── portfolio/case-studies/             # long-form case studies
└── resume/                             # HTML resume
```

---

## Related repos

- [`chima-ukachukwu-sec`](https://github.com/chima-ukachukwu-sec/chima-ukachukwu-sec) — GitHub profile README
- [`ai-red-teaming-frameworks`](https://github.com/chima-ukachukwu-sec/ai-red-teaming-frameworks) — methodology repo backing the AI red team case study
- [`ai-evaluation-safety-portfolio`](https://github.com/chima-ukachukwu-sec/ai-evaluation-safety-portfolio) — NDA-compliant AI safety evaluation work
- [`soc-defensive-portfolio`](https://github.com/chima-ukachukwu-sec/soc-defensive-portfolio) — SOC, threat-intel, and incident-response writeups
- [`adverse-insight`](https://github.com/chima-ukachukwu-sec/adverse-insight) — 3-agent contract risk analyzer (Streamlit + OpenAI). [Live demo](https://adverse-insight.streamlit.app/)

---

## Contact

📧 `chima.ukachukwu.sec@gmail.com` · 💼 [LinkedIn](https://linkedin.com/in/chima-anthony-u) · 🌐 [chimaukachukwu.com](https://chimaukachukwu.com)

## The Lab

Four interactive AI security exhibits at [chimaukachukwu.com/lab](https://chimaukachukwu.com/lab/).
All of them are deterministic and run entirely in the browser — no backend, no API key, no model
call, nothing sent anywhere.

| Exhibit | What it does |
|---|---|
| [Prompt Injection Simulator](https://chimaukachukwu.com/lab/injection-sim/) | Attack a support agent, then toggle four defences and watch the same attack succeed or fail |
| [Prompt Injection CTF](https://chimaukachukwu.com/lab/ctf/) | Six levels, each adding a control, each beaten by what that control doesn't cover |
| [Pattern Detector](https://chimaukachukwu.com/lab/pattern-detector/) | Paste a prompt, see which of ten adversarial categories it matches and why |
| [Red Team Atlas](https://chimaukachukwu.com/lab/red-team-atlas/) | The ten categories as reference: mechanism, detection signal, mitigation, OWASP mapping |

The determinism is the design, not a limitation. Because the same input always produces the same
result, you can change one control and attribute the difference to it — which a sampled model
cannot demonstrate.

[How the site is built →](https://chimaukachukwu.com/colophon/)

## Working on this site

Deployment is still just `git push` — GitHub Pages serves the files as they are.

Shared markup (navigation, footer, head assets) lives in `partials/` and is stamped into every
page by a small Node script with no dependencies:

```bash
node tools/build-pages.js          # after editing anything in partials/
node tools/build-blog.js           # after editing data/posts.json
npx --yes -p typescript@5 tsc --noEmit   # type check (dev only, nothing compiled)
```

Each has a `--check` mode that CI runs; it exits non-zero if committed output has drifted.

Markup between `<!-- build:name -->` and `<!-- /build:name -->` is generated. Edit the partial,
not the page.

Preview locally:

```bash
python3 -m http.server 8000
```
