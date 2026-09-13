# Roadmap

## Current effort: security-plus-career-surface-refresh

A controlled, phase-gated refresh of every professional surface: resume, portfolio site,
LinkedIn, GitHub, and project presentation. The goal is cross-surface factual consistency
under a single approved baseline, with no surface edited ahead of the phase that owns it.

Each numbered phase below is a bounded ProjectOS phase. Specifications live in
`docs/phases/`. Durable state lives in `docs/checkpoints/`.

| Phase | Scope | State |
|---|---|---|
| 0 | Factual baseline. Approved canonical facts, backups, live verification. | Complete |
| 1 | ProjectOS attachment and repo-level agent governance. | Complete |
| 2 | Resume source. Builder correctness, document metadata, content. | Complete |
| 3 | Portfolio site. | Next |
| 4 | Independent Codex review. | Not started |
| 4b | Deploy and verify. | Not started |
| 5 | LinkedIn. | Not started |
| 6 | GitHub profile and pins. | Not started |
| 7 | Project improvements. | Not started |
| 8 | Final cross-surface consistency verification. | Not started |
| 9 | Active job-search execution. | Not started |

Phase 0 predates ProjectOS attachment and has no phase specification in `docs/phases/`.
Its approved output is the local-only canonical facts checkpoint. Do not reconstruct that
record from memory.

## Phase gating

Do not begin a phase until the previous phase's acceptance criteria are met and the user has
approved advancing. Do not renumber completed phases.

## Phase 0: Foundation

`docs/phases/PHASE-00-foundation.md` is the ProjectOS template phase and is unused by this
effort. It is retained because ProjectOS structure expects it.
