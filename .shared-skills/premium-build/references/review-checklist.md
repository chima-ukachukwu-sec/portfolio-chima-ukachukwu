# Premium Build Review Checklist

Use this checklist for substantial UI implementation and review. Apply judgment. Not every item applies to every change.

## Workflow
- Does the primary user task work end to end?
- Is the next action obvious at each step?
- Are unnecessary steps or repeated decisions introduced?
- Does the change preserve existing working behavior unless intentionally changed?

## Hierarchy and visual design
- Is the most important information visually clear?
- Are primary and secondary actions distinguishable?
- Is spacing intentional and consistent?
- Does the design fit this product rather than a generic template?
- Are decorative elements earning their complexity?

## Interaction states
- Loading handled
- Empty handled
- Error handled
- Disabled handled where relevant
- Success feedback handled
- Validation understandable
- Destructive action behavior appropriate
- Interrupted or retryable work recoverable where relevant

## Responsive behavior
- Primary viewport verified
- Constrained/mobile viewport verified when applicable
- No accidental horizontal overflow
- Navigation remains usable
- Critical actions remain reachable
- Dense data adapts intentionally

## Accessibility
- Semantic elements used where possible
- Keyboard path works
- Focus visible
- Accessible names and labels present
- Contrast appropriate
- Status/error meaning not conveyed by color alone
- Reduced motion respected if motion is used

## Performance
- No obvious unnecessary dependency added
- No avoidable re-render or request loop
- No large decorative effect harming interaction
- Media and large lists handled reasonably

## Security-sensitive UX
- Trust state is clear
- Permissions are understandable
- Secrets are not exposed
- Destructive or live actions are explicit
- Preview/test/paper/live state is unambiguous when relevant

## Verification
- Appropriate tests/checks run
- Actual rendered behavior inspected when possible
- Obvious regressions fixed
- Findings distinguish defects from preferences

## Design Gate

For substantial UI phases, complete `design-gate.md` before declaring the phase complete. Use rendered browser evidence when the environment supports it.
