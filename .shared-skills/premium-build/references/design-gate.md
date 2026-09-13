# Premium Build Design Gate

Version: 2.0

Use this gate for substantial UI phases before declaring them complete. Mark items N/A when genuinely irrelevant and state why.

## Functional

- [ ] Primary workflow works end to end.
- [ ] Relevant loading, empty, error, disabled, success, and recovery behavior works.
- [ ] Existing behavior outside the requested scope was not casually changed.

## Visual

- [ ] Information hierarchy is clear.
- [ ] Primary and secondary actions are distinguishable.
- [ ] Typography, spacing, density, alignment, and surfaces are coherent.
- [ ] The result fits this product rather than a generic template.
- [ ] Decorative elements earn their complexity.

## Responsive

- [ ] Primary viewport inspected.
- [ ] Constrained/mobile viewport inspected when applicable.
- [ ] Intermediate width inspected for layout-heavy responsive work when applicable.
- [ ] Critical actions remain reachable.
- [ ] No accidental horizontal overflow.

## Interaction

- [ ] Keyboard path works where relevant.
- [ ] Focus is visible and sensible.
- [ ] Critical control states are understandable.
- [ ] Destructive actions communicate consequence.
- [ ] Motion is purposeful and reduced-motion behavior is respected when applicable.

## Accessibility

- [ ] Semantic controls used where practical.
- [ ] Accessible names and labels are present.
- [ ] Status and error meaning does not rely on color alone.
- [ ] Contrast and touch targets are appropriate.

## Performance and engineering

- [ ] No unjustified dependency or abstraction was added.
- [ ] No obvious request loop, render loop, layout shift, or heavy decorative effect was introduced.
- [ ] Relevant automated checks pass.

## Browser evidence

- [ ] Rendered implementation was inspected when the environment allowed it.
- [ ] Playwright or approved browser tooling was used when configured and appropriate.
- [ ] Material visual defects found during inspection were fixed or explicitly documented.

## Independent review

For substantial phases when an alternate capable agent is available:

- [ ] Independent reviewer checked the implementation.
- [ ] Verified defects were separated from taste preferences.
- [ ] Material findings were fixed, accepted with rationale, or tracked.

## Gate result

Record `PASS`, `PASS WITH KNOWN LIMITATIONS`, or `FAIL`, with evidence and any remaining verified limitations.
