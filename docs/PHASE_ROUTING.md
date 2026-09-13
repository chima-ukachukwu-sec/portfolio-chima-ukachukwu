# Phase Model Routing

Re-evaluate this at each phase boundary.

## Current phase

Phase: Phase 2, resume system refresh.

## Planner
Agent: Claude Code
Model: Claude Opus 5
Reasoning level: high
Why: The phase is bounded and already specified in detail by the user, but every change is a
factual claim about a real person's career. Planning error here is a credibility cost, not a
rework cost.

## Primary builder
Agent: Claude Code
Model: Claude Opus 5
Reasoning level: high
Interface: terminal
Why: The work is a single JavaScript builder plus verification. It is small in volume and high
in consequence, which favours one careful agent over parallel execution.

## Independent reviewer
Agent: Codex
Model: deferred to Phase 4
Reasoning level: deferred
Interface: deferred
Why: Phase 4 provides independent review of all content phases at once, so the reviewer sees the
resume and the site together rather than judging the resume in isolation.

## Breaker
Required: no
Agent: n/a
Model: n/a
Reasoning level: n/a
Why: The output is a document. There is no runtime attack surface, no user input path and no
deployed component in this phase.

## Premium Build
Required: no
Reason: No user interface is produced or changed. The document standard already in force
(ATS-safe structure, two-page target, no em dashes, existing visual system) is the applicable bar.

## Escalation conditions
Use a stronger model only when the phase becomes more ambiguous, cross-cutting, security-sensitive, difficult to debug, or reviewer disagreement remains unresolved.
