# Interaction and Motion Standard

Version: 2.0

## Interaction states

Interactive controls should communicate their state when applicable: default, hover, focus, pressed, selected, disabled, loading, success, validation error, failure, and destructive consequence.

Do not rely on hover alone for essential information or actions.

## Motion principles

Motion should explain change, causality, continuity, hierarchy, or spatial relationship. It should not exist merely to make the interface feel animated.

Prefer motion that is:

- short enough to preserve responsiveness
- consistent for similar transitions
- interruptible when possible
- restrained in high-frequency workflows
- compatible with reduced-motion preferences

Avoid:

- entrance animation on every component
- decorative perpetual motion
- animation that delays access to controls
- large layout movement after content is already interactive
- motion that obscures state changes instead of clarifying them

## Microinteractions

Use microinteractions to confirm meaningful actions, expose affordance, or communicate system state. Feedback should match the importance of the action. Routine actions should not trigger theatrical responses.

## Keyboard and focus

Keyboard behavior, focus order, focus visibility, escape behavior, and shortcut scope are part of interaction design. Modal and popover focus should be deliberate, not incidental.
