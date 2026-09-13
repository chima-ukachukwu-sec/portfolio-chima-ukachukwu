---
name: premium-build
description: Apply the Premium Human-Designed Product + Engineering Standard when designing, building, redesigning, reviewing, or polishing product UI, UX, frontend behavior, responsive layouts, accessibility, interaction states, browser behavior, and user-facing workflows. Use for web apps, dashboards, settings, onboarding, forms, navigation, visual polish, frontend implementation, and UI review. Do not use for backend-only work with no user-facing behavior.
---

# Premium Build

Apply the Premium Human-Designed Product + Engineering Standard to the current task.

The user's explicit instructions and the repository's product requirements take precedence over this skill. Treat this skill as a quality standard, not as permission to expand scope.

## Authority and model portability

This is the canonical UI/product quality layer for both Claude Code and Codex when ProjectOS attaches it to a repository. Do not create model-specific design philosophies. Repository requirements, project-specific design files, and this shared skill are the source of truth.

## Before implementation

1. Inspect the existing product before changing it.
2. Identify the primary user, task, workflow, constraints, and current design language.
3. Read relevant repository requirements, architecture notes, project design files, tokens, existing components, tests, and screenshots when available.
4. Preserve working behavior unless the requested change requires modifying it.
5. Prefer the smallest coherent change that materially improves the requested experience.

For substantial UI work, read the applicable references:

- `references/premium-product-standard.md`
- `references/visual-design-standard.md`
- `references/interaction-motion.md`
- `references/browser-qa.md`
- `references/design-gate.md`
- `references/review-checklist.md`

## Core execution rules

- Design around the user's workflow, not around a generic component catalog.
- Establish clear information hierarchy before visual decoration.
- Prefer product-specific interaction patterns over generic SaaS or AI-dashboard conventions.
- Use deliberate typography, spacing, density, layout, and visual rhythm.
- Make primary actions obvious without making every element visually loud.
- Treat loading, empty, error, disabled, offline, permission, success, stale, and long-running states as part of the feature.
- Preserve user state and provide recovery for destructive, interrupted, or failed actions where appropriate.
- Make responsive behavior intentional rather than shrinking desktop layouts.
- Support keyboard use, visible focus, semantic structure, and accessible names where relevant.
- Protect performance. Avoid decorative effects that create unnecessary layout shift, input delay, memory use, network cost, or motion.
- Use real product language and realistic content. Do not hide weak hierarchy behind placeholder copy.
- Do not introduce needless frameworks, dependencies, abstractions, or design systems.
- Reuse existing components and tokens when they are fit for purpose. Improve them when they are the source of the problem.
- For security-sensitive flows, make permissions, trust boundaries, destructive actions, secrets, authentication state, and irreversible consequences clear to the user.

## Visual direction

Create a coherent visual point of view that fits the product and audience. Avoid defaulting to repetitive card grids, excessive pills, gratuitous gradients, oversized hero copy, decorative glass effects, random icons, generic purple-blue styling, or animation without a product reason.

Distinctiveness should come from product context, hierarchy, typography, composition, content, and interaction quality rather than decoration alone.

If project-specific files such as `docs/DESIGN_SYSTEM.md`, `docs/UX_FLOWS.md`, or `docs/VISUAL_REFERENCES.md` exist, read them before making substantial UI decisions.

## Browser and visual verification

For user-facing implementation work, rendered output is evidence.

1. Run the checks appropriate to the change.
2. Run the application when the environment permits it.
3. Inspect the changed workflow in a real browser.
4. Use Playwright or the repository's approved browser tooling when available.
5. Inspect the primary viewport and relevant constrained/mobile viewports.
6. Check critical keyboard, focus, loading, error, empty, disabled, success, and destructive states.
7. Capture or inspect screenshots when useful for visual comparison.
8. Fix obvious regressions before declaring completion.
9. Do not add shallow tests solely to increase test count.

Do not claim pixel-perfect verification unless a specific reference and comparison method were actually used.

## Independent review

For substantial UI phases, the builder should not be the only reviewer when an independent agent is available. Claude Code may build and Codex review, or Codex may build and Claude Code review. The reviewer should separate verified defects from taste preferences and provide evidence for material findings.

## Completion standard

A Premium Build task is complete when the requested workflow works, the interface communicates priority clearly, relevant edge states are handled, accessibility and responsiveness are appropriate, rendered behavior has been inspected when possible, regressions have been checked, and the implementation fits the existing product rather than looking like an unrelated redesign.

For substantial UI work, apply `references/design-gate.md` before declaring the phase complete.
