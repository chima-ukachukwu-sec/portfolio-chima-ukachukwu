# Agent Instructions

Repository: **chimaukachukwu.com**, a static personal portfolio site.
This file governs every coding agent that works here, including Claude Code and OpenAI Codex.

Sections 1 to 7 are the canonical ProjectOS v1.1.0 agent contract.
Sections 8 onward are repository-specific and take effect alongside it.

## Authority order

1. Explicit current user request
2. Repository product requirements
3. Architecture, security, and decision records
4. Current phase specification
5. Applicable project standards and skills
6. Agent judgment

Do not silently override a higher-authority source.

## Before editing

- inspect the repository
- identify branch, HEAD, and working-tree state
- read the current phase and relevant architecture/security docs
- search for existing components, utilities, tests, and patterns before adding new ones
- preserve working behavior unless the phase requires changing it

## Implementation

- stay inside the phase scope
- make the smallest coherent change that satisfies acceptance criteria
- avoid unrelated refactors
- do not add dependencies without a clear need
- do not weaken security controls for convenience
- update tests and documentation when behavior changes

## Verification

Run the checks appropriate to the change. For user-facing work, inspect the rendered interface when tooling permits.

A passing test suite alone does not prove the feature is complete.

## Review discipline

When asked to review:
- default to read-only unless modification is explicitly requested
- separate verified defects from preferences
- rank findings by severity
- cite concrete code or behavior
- do not manufacture findings to appear thorough

## Premium Build

If a `premium-build` skill is available and the task is substantial UI, UX, frontend, product-design, or user-facing workflow work, apply it unless the user explicitly says not to.

The skill is attached to this repository at `.shared-skills/premium-build/`, linked into
`.agents/skills/premium-build` for Codex and other agents and `.claude/skills/premium-build` for
Claude Code. Both are tracked symlinks, so the skill travels with any clone. That second link is
the only tracked path under `.claude/`; everything else there is local-only and gitignored.

## Stop condition

Do not begin the next roadmap phase unless explicitly instructed.

---

## 8. Factual accuracy

This site is a real person's professional record. Inaccuracy here is a reputational and
employment risk, not a cosmetic defect.

- Do not invent employment, projects, tenure, responsibilities, or outcomes.
- Do not invent or estimate metrics. If a number is not sourced, it does not ship.
- Do not invent certifications, and do not add a certification that has not been confirmed.
- Do not present an expired credential as current. Expired credentials are either removed from
  active lists or explicitly labelled with their expiry.
- Do not strengthen a hedged claim. Where the copy says "an estimated 40%", the qualifier is
  load-bearing and must survive every rewrite. Removing it implies instrumentation that does
  not exist.
- Work-authorization and security-clearance wording is a protected class of claim. Do not
  write, reword, tighten, or infer it. Verify it against `.claude/CANONICAL_FACTS.md` and
  reproduce the approved wording exactly. If that file is unavailable, do not guess and do not
  change the existing wording. Ask for confirmation.
- Do not restate career facts from memory or from an earlier session. Verify against the
  rendered page or the source file before changing it.

A local-only canonical facts checkpoint lives at `.claude/CANONICAL_FACTS.md`. It is the source
of truth for personal and career facts, and it outranks any surface it disagrees with. It is
gitignored and is never committed, published, or copied into a tracked file, this one included.
That is why the rules above state how to handle a class of claim rather than restating the
claims themselves. If the file is unavailable, ask rather than guess.

## 9. Confidentiality and NDA discipline

Some of the work described on this site was performed under client NDA.

Publishable:
- methodology, frameworks, taxonomies, and structure
- tool stacks and architecture descriptions
- retrospective reflection
- public references such as OWASP, MITRE ATLAS, and NIST AI RMF

Not publishable:
- client names or anything client-identifying
- specific findings, severity ratings, indicator counts, or internal architecture detail
- internal threat-feed content, indicators of compromise, or detection rules
- working exploits or jailbreak prompts effective against currently deployed models

Match this discipline in any new case study, blog post, or lab exhibit.

## 10. Canonical degree wording

The degree is **M.S. Computer Science, Cybersecurity** (Oklahoma City University, May 2025).

Permitted grammatical variants: `M.S. in Computer Science, Cybersecurity`,
`M.Sc. Computer Science, Cybersecurity`, `MSc Computer Science, Cybersecurity`,
`Master of Science (MS) in Computer Science, Cybersecurity`.

Never write `M.S. Cybersecurity`, `MSc Cybersecurity`, or `Master's in Cybersecurity`. Those
present a concentration as a standalone degree.

## 11. Generated content discipline

Parts of this repository are generated. Editing generated output directly is silently reverted
by the next build and is treated as a defect.

- Shared markup lives in `partials/` and is stamped into pages by `tools/build-pages.js`.
  Never hand-edit markup between `<!-- build:name -->` and `<!-- /build:name -->`. Edit the
  partial, then re-run the stamper.
- Adding a page means adding an entry to `PAGES` in `tools/build-pages.js` and placing the
  build markers in the markup.
- Blog listing, related rails, next/prev links, and the RSS feed are generated by
  `tools/build-blog.js` from `data/posts.json`. Never hand-edit any of those outputs.
- `404.html` intentionally keeps its own analytics block because it also reports the failed
  path. It is annotated in-file and is not drift.
- Generated output is committed on purpose. The deployed site has no build step.

Before editing any file, check whether it is generated or whether a partial or data source
owns it.

## 12. Engineering and product standard

This is a premium, user-facing product. Preserve the following in every change.

- **Accessibility.** Heading hierarchy, `<main id="main-content">`, the skip-to-content link,
  labelled controls, `aria-expanded` on the nav toggle, live regions, and the global
  `:focus-visible` ring. Do not regress contrast.
- **Responsiveness.** Two breakpoints only: `768px` and `1100px`. Do not introduce a third.
- **Performance.** No framework, no bundler, no runtime dependency. Fonts are self-hosted in
  `assets/fonts/` as latin-subset variable WOFF2. There is no Google Fonts request. CI enforces
  asset size budgets.
- **Design tokens.** Every value comes from the `:root` scale at the top of `css/style.css`:
  type (`--text-*`), space (`--space-*`, 4pt grid), motion (`--duration-*`, `--ease-*`), and
  colour. Prefer semantic colour roles over the raw palette. Never invent a value off-scale.
- **No `!important`** outside the `prefers-reduced-motion` block. Needing one means the
  specificity is wrong. Fix the specificity.
- **The `prefers-reduced-motion` block stays last** in `css/style.css` so its overrides win.
- **Reuse the `.post-*` class family** for any new content page rather than writing fresh
  styles.
- **State and recovery.** Preserve existing client-side behaviour, including recruiter mode
  (`?mode=recruiter`), the `?ref=` attribution parameter and its sanitiser, and `localStorage`
  persistence. The ref value is sanitised once in `readRef()`, capped and allowlisted to strip
  CRLF and therefore mailto header injection. Do not bypass or duplicate that sanitiser.
- **Avoid unnecessary redesign.** Do not restructure the file layout, change the visual
  language, or rewrite working components without an explicit request. The static-deploy
  assumption depends on the current layout.

## 13. Content quality

- Write for a recruiter reading quickly. Concise beats comprehensive.
- Evidence over assertion. Prefer a specific, verifiable claim to an adjective.
- No unsupported claims, and no marketing register.
- **No em dashes in visible copy.** This is a hard rule. Do not mechanically substitute a
  comma; restructure the sentence. Periods, colons and parentheses usually read better. Avoid
  `--` as well. HTML comments are code, not copy, and are exempt. Note that a raw-character
  grep misses two cases that have shipped before: the HTML entity `&mdash;` and the JSON
  escape `\u2014` inside JSON-LD. Verify at render time, not in the raw source.
- Smart quotes are fine in body copy.
- Retired phrasings that must not be reintroduced: the word "intersection", and the former
  slogans "I bring enterprise security rigor to AI safety..." and "I break AI systems to make
  them safer."
- Keep `<meta name="description">` under 155 characters.
- When copying a page as a template, the three fields that have shipped wrong before are the
  `BreadcrumbList` name, the `BlogPosting` headline, and the `BlogPosting` description. Check
  all three.

## 14. Conventions

- **Vanilla stack only.** HTML, CSS and JavaScript. Do not introduce React, Tailwind, a
  bundler, or a build step without an explicit request.
- The repository has no `package.json` or dependency manifest. Do not suggest installing
  dependencies.
- The logo markup is exactly `CU<span class="accent">.</span>` in every nav and footer.
- Footer social links use SVG icons, not text labels. Text labels overflow the 36px circular
  buttons.
- The Plausible analytics tag belongs in every page `<head>`. Carry it forward when adding a
  page.
- Relative paths are hand-written at three directory depths. Always resolve a link from the
  file being edited. From `blog/posts/`, the homepage is `../../index.html`, not `/index.html`.
- Prefer targeted edits over whole-file rewrites. The HTML files are large.
- The `/lab/` exhibits are deterministic and fully client-side. No backend, no API key, no
  model call. This is an architectural constraint, not a temporary state.

## 15. Secrets

Site keys, public form IDs, and analytics IDs are public by design and correctly live in the
tracked HTML and JavaScript. Secret keys and API tokens never enter this repository, in any
form, including comments, fixtures, and screenshots.

## 16. Checks

```bash
node tools/build-pages.js --check        # partials stamped into every page
node tools/build-blog.js --check         # blog index, rails and feed current
npx --yes -p typescript@5 tsc --noEmit   # type check, checkJs over plain JS
project-os-check                         # ProjectOS structure and Premium Build linkage
```

CI runs the stamped-pages check, the blog check, a link check, the type check, and an asset
size budget. Run the relevant checks before reporting work complete, and report actual output
rather than expected output.
