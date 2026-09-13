# Project Profile

Project: portfolio-chima-ukachukwu  
Type: web  
Risk: moderate  
Created: 2026-09-13

## User / operator

Operator: the site owner, who is also the sole author and the subject of its content.

Audience: recruiters, hiring managers, and security practitioners, most arriving from a job
application or a LinkedIn link and reading quickly on a phone.

## Problem

Present a verifiable professional record in one place, at a custom domain, without depending on
a platform that controls the presentation. Supporting goal: demonstrate engineering judgment
through the artifact itself rather than only describing it.

## Deployment

Public web. Static GitHub Pages deployment from `main`, apex domain via `CNAME`. No server, no
runtime dependency, no build step at deploy time. One author-time script stamps shared partials
and its output is committed.

## Data sensitivity

The site processes almost nothing. Exceptions:

- Contact form submissions, handled by Formspree with hCaptcha bot protection. The secret key
  lives only in the Formspree dashboard.
- Privacy-preserving analytics via Plausible, including a `?ref=` application-attribution prop.
- `localStorage`, used only for recruiter-mode persistence on the visitor's own device.

Lab exhibits are deterministic and entirely client-side. No backend, no API key, no model call.

Local-only private state lives under `.claude/` and is gitignored. The single exception is the
tracked symlink `.claude/skills/premium-build`. The ignore rules default to "ignored" at every
level beneath `.claude/`, and that default must stay that way.

## Failure consequences

The dominant risk is not downtime, it is inaccuracy. A wrong or overstated claim on a career
surface is a reputational and employment risk and is not repaired by a later correction, since
a PDF or a screenshot may already be in a recruiter's hands. A broken link or a stale generated
page is the most likely mechanical regression and lands directly in front of the audience.

Confidentiality is the second risk. Some described work was performed under client NDA.

## Constraints

- Vanilla HTML, CSS and JavaScript. No framework, bundler, or dependency manifest.
- Two responsive breakpoints only: 768px and 1100px.
- Design values come from the `:root` token scale in `css/style.css`.
- No em dashes in visible copy.
- Accessibility and contrast are not negotiable against visual preference.
- CI enforces asset size budgets, generated-page freshness, link integrity, and type checks.
- Every factual claim must be sourced. See `AGENTS.md` sections 8 and 9.

## Success

A recruiter can verify every claim on the site, reach the owner, and download a correct resume,
on a phone, in under two minutes. Cross-surface consistency holds: the site, the resume, the
LinkedIn profile, and the GitHub profile do not contradict each other.
