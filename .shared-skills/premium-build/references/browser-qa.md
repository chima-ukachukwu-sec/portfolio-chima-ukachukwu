# Browser QA and Visual Iteration

Version: 2.0

Rendered browser behavior is required evidence for substantial frontend work when the environment supports it.

## Standard loop

1. Build or start the application using the repository's approved commands.
2. Navigate through the changed workflow in a real browser.
3. Use Playwright or the project's approved browser automation when available.
4. Inspect primary and constrained/mobile viewports.
5. Exercise critical states and transitions.
6. Capture screenshots when they improve comparison or review.
7. Record verified problems.
8. Fix the implementation.
9. Repeat until material issues are resolved.

## Minimum responsive evidence

Use the project's defined breakpoints when available. Otherwise inspect at least:

- the primary desktop/laptop viewport
- one constrained/mobile viewport

For layout-heavy or responsive changes, also inspect an intermediate width when it may reveal collapse or overflow problems.

## State coverage

Inspect the states relevant to the feature, which may include:

- initial/loading
- populated
- empty
- partial/stale
- validation error
- request failure
- disabled
- success
- permission denied
- offline/unavailable
- destructive confirmation
- long-running progress

## Visual review

Check for:

- overflow and clipping
- unintended wrapping
- broken alignment
- unstable layout shift
- inconsistent spacing
- hidden or unreachable controls
- weak hierarchy
- accidental duplicate actions
- focus visibility
- touch target problems
- unreadable text or contrast

## Evidence discipline

Do not claim a viewport, state, browser, or workflow was tested unless it was actually inspected. Screenshots support review but do not replace interaction testing.
