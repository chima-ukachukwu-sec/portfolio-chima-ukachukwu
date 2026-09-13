# Premium Human-Designed Product + Engineering Standard

Version: 1.0

This document defines the shared product-quality standard used by the `premium-build` skill.

## 1. Product and workflow first

Start with the user's actual job to be done. Understand what they are trying to accomplish, what they need to know at each step, and what can go wrong.

A screen should answer, in order:

1. Where am I?
2. What matters here?
3. What can I do?
4. What changed after I acted?
5. How do I recover if something fails?

Do not treat every screen as a dashboard. Use the interaction model that fits the task: editor, queue, timeline, inspector, wizard, search, table, workspace, command surface, media browser, form, comparison view, or another pattern justified by the product.

## 2. Information hierarchy

Establish hierarchy through structure before decoration.

Use:
- meaningful grouping
- clear primary and secondary actions
- consistent spacing relationships
- typography that signals role and importance
- progressive disclosure for secondary detail
- sensible density for the task

Avoid:
- equal visual weight everywhere
- nested containers without purpose
- cards around every block of content
- excessive labels, badges, pills, borders, and dividers
- repeated headings that add no information
- large empty regions that force unnecessary scrolling

## 3. Product-specific visual identity

The interface should feel like it belongs to this product.

Choose typography, density, iconography, imagery, motion, border treatment, surfaces, and color based on audience and context. A cybersecurity console, media processor, study simulator, trading interface, and productivity tool should not all look like the same template.

Avoid a generic "AI app" look unless the brief explicitly calls for it.

## 4. Typography

Use a disciplined type scale with a small number of roles. Prioritize readability, scanning, and density appropriate to the workflow.

Check:
- body text readability
- line length
- heading hierarchy
- numeric alignment where data matters
- tabular numerals where appropriate
- truncation behavior
- long labels and localization tolerance

Do not change the product font solely to appear distinctive if the existing type system works well.

## 5. Color and contrast

Use color to communicate hierarchy, state, and meaning.

Reserve strong accent treatment for elements that deserve attention. Status colors must not be the only way information is conveyed. Maintain sufficient contrast for text, controls, focus indicators, and important boundaries.

Do not introduce decorative gradients or glow effects without a product reason.

## 6. Layout and responsiveness

Design responsive behavior intentionally rather than shrinking a desktop layout.

For each relevant breakpoint, decide:
- what remains visible
- what moves
- what collapses
- what becomes scrollable
- what becomes a menu or drawer
- which actions remain immediately accessible
- how dense data views adapt

Prevent accidental horizontal scrolling unless the content type requires it.

## 7. Interaction design

Every interactive element should communicate affordance and state.

Handle:
- hover when applicable
- focus
- pressed or active
- selected
- disabled
- loading
- success
- failure
- validation
- destructive confirmation when justified

Avoid interactions that depend on hover alone.

Motion should clarify change, orientation, causality, or continuity. Respect reduced-motion preferences.

## 8. Forms and input

Forms should minimize effort and ambiguity.

Use:
- clear labels
- useful defaults
- inline validation where it helps
- specific error messages
- preserved input after recoverable failures
- appropriate input types and autocomplete
- visible required or optional status when needed

Do not clear user-entered data after a failed submission unless necessary for security.

## 9. System states

Treat system states as first-class product surfaces.

Design and implement:
- loading
- empty
- partial data
- stale data
- offline or unavailable
- permission denied
- expired session
- error
- retry
- success
- background processing
- long-running task progress

The user should understand what happened and what they can do next.

## 10. State preservation and recovery

Preserve meaningful user state across navigation, refreshes, interrupted work, and recoverable failures when the product architecture supports it.

For destructive or irreversible actions:
- communicate consequences clearly
- require confirmation when the risk justifies the friction
- offer undo where technically and conceptually appropriate
- never hide destructive actions behind ambiguous wording

## 11. Accessibility

Use semantic HTML and native controls when possible.

Verify:
- keyboard navigation
- visible focus
- label associations
- accessible names
- logical heading structure
- sufficient contrast
- touch target size
- screen-reader-relevant status changes
- reduced motion
- zoom and text resizing
- error identification that does not rely only on color

Accessibility fixes should address the interaction, not merely silence an audit tool.

## 12. Keyboard efficiency

For productivity-oriented products, support efficient keyboard workflows where they reduce repeated pointer work.

Shortcuts should:
- avoid conflicts with browser and operating-system conventions
- be discoverable
- have a visible alternative
- avoid triggering destructive actions accidentally
- work consistently across the product

## 13. Performance

Protect responsiveness and perceived speed.

Watch for:
- unnecessary client-side JavaScript
- oversized dependencies
- avoidable re-renders
- layout shift
- image and media over-fetching
- expensive visual effects
- blocking network calls
- unbounded lists
- unnecessary polling
- animation that degrades interaction latency

Optimize based on evidence and the product's actual bottlenecks.

## 14. Security-sensitive UX

Security is part of product design.

For relevant flows:
- distinguish trusted from untrusted content
- make authentication and authorization state understandable
- avoid exposing secrets in UI, logs, URLs, or copyable debug output
- communicate permission scope
- make destructive actions explicit
- prevent accidental execution when reviewing generated commands or code
- distinguish preview, simulation, paper, staging, and live modes
- show high-risk state clearly without relying on color alone

Do not weaken security controls to make a workflow feel smoother.

## 15. Content and copy

Use concise, specific language that reflects the actual product.

Buttons should normally describe the action. Errors should explain what failed and, when known, what the user can do. Empty states should help the user start or recover.

Avoid filler marketing language inside operational products.

## 16. Implementation discipline

Work with the existing architecture.

Before creating something new:
1. search for an existing component, token, pattern, hook, utility, or state model
2. determine whether reuse is appropriate
3. change shared primitives only when the broader impact is understood

Do not add dependencies for problems that the existing stack can solve cleanly.

Keep business logic out of purely presentational components where the architecture already separates concerns.

## 17. Visual verification

Rendered output is evidence.

When tooling permits:
- run the application
- inspect the changed flow
- capture or inspect screenshots
- test relevant viewport sizes
- verify real content and edge cases
- compare against the intended hierarchy and product language

Do not declare visual work complete based only on static code inspection when rendering is available.

## 18. Review discipline

When reviewing another agent's work, prioritize:
1. broken user workflows
2. security or trust problems
3. accessibility blockers
4. state-loss and recovery problems
5. responsive failures
6. misleading or unclear hierarchy
7. performance regressions
8. visual inconsistency
9. cosmetic polish

Separate verified defects from taste preferences.

## 19. Definition of done

A user-facing change is done when:
- the requested workflow is complete
- primary and secondary actions are clear
- relevant states are handled
- layout works at target viewport sizes
- keyboard and accessibility behavior are appropriate
- security-sensitive states are clear where relevant
- performance is reasonable for the change
- relevant tests or checks pass
- the rendered result has been inspected when possible
- unrelated behavior has not been casually changed

## ProjectOS Premium Build v2 integration

For substantial UI work, also apply `visual-design-standard.md`, `interaction-motion.md`, `browser-qa.md`, and `design-gate.md`. Project-specific design files remain authoritative for the product's visual direction and workflows.
