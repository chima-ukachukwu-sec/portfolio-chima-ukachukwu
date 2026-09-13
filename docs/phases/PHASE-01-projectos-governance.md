# Phase 1: ProjectOS governance

Effort: **security-plus-career-surface-refresh** (see `docs/ROADMAP.md`).

## Goal

Attach this repository to the existing ProjectOS v1.1.0 installation and establish repo-level
agent governance for Claude Code and Codex, so that every later phase of the career-surface
refresh runs under one written contract rather than per-session convention.

## Scope

- ProjectOS v1.1.0 attachment: `.projectos` metadata and the canonical `docs/` structure.
- Premium Build v2 repo-level linkage: `.shared-skills/premium-build` with agent links under
  `.agents/skills/` and `.claude/skills/`.
- `AGENTS.md`: repo-level instructions for all agents, public-safe content only.
- Roadmap and phase records for the refresh effort.

## Out of scope

Everything user-facing. This phase changes no career content and no site output. Specifically
out of scope: resume source and PDFs, portfolio copy, positioning, project selection,
certification content, LinkedIn, the GitHub profile and pins, and any deploy.

## Assumptions

- ProjectOS v1.1.0 is installed at `~/Developer/Projects/_ProjectOS` and its commands are on
  PATH. VERIFIED during this phase.
- Premium Build v2 canonical source is `~/.ai-skills/premium-build`. VERIFIED during this phase.
- ProjectOS v1.1.0 ships no attach command for an existing repository. `project-new` refuses a
  target that already exists. VERIFIED by reading `bin/project-new.v1.0.1.base`.

## Requirements

1. Use the canonical ProjectOS artifacts, not hand-invented equivalents.
2. Do not upgrade or otherwise mutate the global ProjectOS installation.
3. Do not modify sibling repositories.
4. Do not overwrite existing repository files, including `README.md`.
5. Keep private local state out of tracked files. The only tracked path under `.claude/` is
   the Premium Build skill symlink, which the canonical layout expects; everything else there
   stays ignored, and new files there must be ignored by default.
6. Keep the diff governance-only.

## Architecture impact

None to the deployed site. The site remains a static, dependency-free, no-build-step
GitHub Pages deployment. All added files are documentation and agent configuration.

Note: the repository is public and Pages-served with `.nojekyll`, so tracked markdown and
`.shared-skills/` content is publicly fetchable. All added content is public-safe by design.

## Security constraints

- `.claude/CANONICAL_FACTS.md` is local-only and must never be committed or reproduced in a
  tracked file.
- `AGENTS.md` carries rules, not the private facts those rules protect.
- No secrets are introduced. Public-by-design site keys stay where they are.

## Data / migration impact

None. No site data, no `data/posts.json` change, no generated output regenerated.

## UX / Premium Build requirements

None in this phase. Premium Build is attached here so it governs Phase 3 onward.

## Acceptance criteria

1. `project-os-check` passes, including the Premium Design structural check.
2. `project-os-doctor` passes.
3. `node tools/build-pages.js --check` and `node tools/build-blog.js --check` pass unchanged.
4. `AGENTS.md` exists, is public-safe, and contains zero literal em dashes.
5. `git diff` against `809033d` touches no career-content file.
6. One governance-only commit, not pushed.

## Verification

Run the four checks above and inspect the full diff file by file before committing.
Report actual command output.

## Model routing

Update `docs/PHASE_ROUTING.md` for this phase before implementation.

## Independent review

Required: no. Phase 4 provides independent Codex review of the content phases.

## Breaker review

Required: no.

## Stop condition

Stop after the governance commit. Do not push. Do not begin Phase 2.
