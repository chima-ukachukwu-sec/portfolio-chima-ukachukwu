# Phase 2: resume system refresh

Effort: **security-plus-career-surface-refresh** (see `docs/ROADMAP.md`).

## Goal

Make the resume system factually correct, recruiter-effective, ATS-friendly and
security-operations-first, and place its single source of truth under local version control so
future phases can change it safely.

The resume system was audited as fundamentally strong. This phase repairs identified defects in
place. It does not rewrite the resume and does not replace the builder.

## Scope

In scope:

- Protecting and versioning the resume source in a new local-only repository.
- `build_resume_v2.js`: correctness fixes, in place.
- Factual corrections carried from the Phase 0 canonical baseline.
- CompTIA Security+ integration.
- Certification list cleanup.
- Summary improvements for scannability and target identity.
- Project selection and ordering.
- Microsoft 365 / identity-security reframing of existing supported duties.
- Document metadata restoration at the builder source.
- Maintained-variant policy.
- Build verification, guards, text extraction and metadata inspection.

Out of scope:

- Portfolio HTML or content changes of any kind.
- Copying any generated PDF into the portfolio repository.
- LinkedIn.
- The GitHub profile, repository pins, topics or descriptions.
- `authtrail` implementation changes.
- `phishtrace` implementation changes.
- The Splunk detection library.
- Any deploy.

## Assumptions

- `~/Documents/resume-private/build_resume_v2.js` is the single source of truth for all seven
  resume variants. VERIFIED by reading the file: it is self-contained, reads no external data,
  and every variant is a key in the tables it declares.
- The Phase 0 backup at `~/Documents/resume-private-backups/resume-private-20260913-120253.tar.gz`
  is intact and was verified 16 / 16 byte-identical on test restore. ASSUMED from the canonical
  facts checkpoint; not re-verified in this phase.
- `.claude/CANONICAL_FACTS.md` is the authority for every career fact touched here.

## Requirements

1. Preserve the builder architecture: one source, variant tables, `FACT_GUARD`, phone / nophone
   behaviour, document layout, ATS-safe output and current styling.
2. Copy only what the builder needs. Recruiter correspondence and personal strategy notes must
   not enter version control.
3. The new repository is local only. No remote, no push, no publication.
4. Restore docx core properties in the builder so metadata is emitted by the build rather than
   depending on a hand-authored document.
5. Every factual change traces to `.claude/CANONICAL_FACTS.md` or to inspected project evidence.
6. Add no claim that existing evidence does not already support. A claim that cannot be
   verified is reported as an open question, not written into the resume.
7. Do not strengthen the hedged 40% figure.
8. Do not add the Security+ exam score to any resume output.

## Architecture impact

None to this repository. The portfolio site is untouched.

The resume system moves from a single loose file in `~/Documents/` to a version-controlled local
repository with a declared dependency manifest. The builder itself is modified in place, not
replaced. The docx to PDF step remains external and manual, as it is today.

## Security constraints

- `.claude/CANONICAL_FACTS.md` stays local only and is never reproduced in a tracked file.
- The new resume repository is private and local. It contains a real person's contact details
  and career record, so it gets no remote in this phase.
- Recruiter correspondence, compensation notes and LinkedIn strategy documents are excluded by
  explicit enumeration, not by pattern matching.
- No secrets are introduced. The builder holds none.

## Data / migration impact

Source files are copied, not moved. `~/Documents/resume-private/` is left intact, so the Phase 0
backup and the existing generated PDFs remain exactly where the canonical record says they are.

Generated output is written to the new repository's ignored output directory. No file in this
repository changes except ProjectOS documentation.

## UX / Premium Build requirements

Premium Build does not apply. This phase produces a document, not an interface. The relevant
quality bar is the document standard already in force: ATS-safe structure, a two-page target,
no em dashes in visible copy, and the existing visual system preserved.

## Acceptance criteria

1. Resume source is version-controlled in a local-only repository with a baseline commit taken
   before any content change.
2. No recruiter correspondence, LinkedIn strategy note or compensation note is in that
   repository.
3. That repository has no remote.
4. CompTIA Security+ is represented correctly and leads the active certification list. The exam
   score appears nowhere.
5. BTL1 is absent from every active resume output.
6. The expired AWS Certified Cloud Practitioner is not presented as current.
7. `1.5+` no longer appears. Prose duration reads `2+ years`.
8. Cybersecurity Clarity is not represented as employment.
9. The Hobby Lobby bullets remain factual and intact, with the hedged 40% figure unchanged.
10. Microsoft 365 experience shows its identity and access-control relevance, with the
    historical job title unchanged.
11. Project composition is more defensive-security balanced and less crowded.
12. Any `authtrail` wording stays inside verifiable repository facts.
13. docx core properties are emitted by the builder.
14. `FACT_GUARD` passes for every variant built.
15. Maintained PDFs render at the intended page count with no clipping or layout regression.
16. `master`, `soc` and `aisec` are documented as the routinely maintained outputs.
17. No portfolio career-content file changed.
18. LinkedIn unchanged.
19. GitHub profile and repository metadata unchanged.
20. Nothing pushed, in either repository.

## Verification

- Build every variant and report actual builder output, including the `FACT_GUARD` line.
- Convert the maintained variants to PDF and extract text from the result.
- Search extracted text for the forbidden stale strings and for the required strings.
- Inspect emitted docx core properties, and inspect PDF metadata after conversion.
- Visually inspect the rendered maintained variants for page count and layout regressions.
- Re-run `project-os-check`, `node tools/build-pages.js --check` and
  `node tools/build-blog.js --check` in this repository to prove the site is untouched.

Report actual command output. Name any layer skipped and why.

## Model routing

Update `docs/PHASE_ROUTING.md` for this phase before implementation.

## Independent review

Required: no. Phase 4 provides independent Codex review of the content phases.

## Breaker review

Required: no.

## Stop condition

Stop after the Phase 2 acceptance criteria and verification are complete. Do not copy any
generated PDF into this repository. Do not edit portfolio content. Do not push either
repository. Do not begin Phase 3.

---

## Closeout

Phase 2 is complete. Implementation was approved in substance, then a reconciliation pass
resolved three items. All acceptance criteria are met.

- The phishtrace exclusion was re-verified against the public repository rather than a stale
  local clone, and the recorded reasoning was corrected. The decision did not change.
- The cross-surface positioning record was corrected: LinkedIn already leads
  cybersecurity-first and needs targeted tuning in Phase 5, not repositioning. The portfolio
  site and GitHub are the surfaces genuinely out of step.
- Page-2 whitespace was measured and accepted with no layout change.

No resume content or layout changed during closeout, so the resume-system implementation
commit and the generated artifact hashes are unchanged. Details, including the measurements
and the artifact paths and hashes for Phase 3, are in
`docs/checkpoints/CHECKPOINT-20260913-163622.md`.

Stop condition observed: Phase 3 has not begun, nothing was pushed, and the resume-system
feature branch is left unmerged so its diff is available for the Phase 4 independent review.
