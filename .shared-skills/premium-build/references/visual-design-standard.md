# Premium Visual Design Standard

Version: 2.0

Use this standard for substantial user-facing design work. It strengthens visual judgment without replacing product requirements or project-specific design decisions.

## 1. Establish a point of view

Before styling, identify the product category, audience, workflow density, emotional tone, and trust requirements. A study tool, security console, media workflow, productivity app, and consumer landing page should not converge on the same visual system.

## 2. Hierarchy before decoration

Use composition, typography, spacing, alignment, contrast, and grouping to establish priority. Decoration should reinforce hierarchy, not substitute for it.

Avoid:

- card containers around every region
- equal emphasis across unrelated controls
- badges and pills as default labeling
- excessive dividers and borders
- oversized headings that reduce usable workspace
- gradients, glows, glass, or shadows without a functional reason
- decorative icons that do not improve recognition or navigation

## 3. Typography

Use a small, disciplined set of text roles. Optimize for scanning, readability, numeric clarity, and the density appropriate to the task.

Check:

- readable body size and line height
- sensible line length
- meaningful heading contrast
- label and metadata legibility
- truncation and wrapping behavior
- tabular numerals when comparison matters
- localization tolerance for longer labels

Do not change fonts only to create novelty.

## 4. Spacing and layout

Use spacing relationally. Items that belong together should be closer than items that do not. Repeated spacing relationships should be consistent enough to create rhythm without forcing every surface into the same grid.

Prefer:

- clear alignment lines
- stable page anchors
- predictable content widths
- useful whitespace around decisions and transitions
- density appropriate to the user's frequency and expertise

## 5. Surfaces and depth

Use surfaces, borders, shadows, and elevation only when they communicate containment, layering, interaction, or state. Avoid nested panels whose only purpose is visual styling.

## 6. Color

Use color to communicate hierarchy, brand, state, and meaning. Reserve strong accents for meaningful emphasis. Status color must not be the only signal.

## 7. Product-specific patterns

Select interaction models based on the work being performed. Consider editor, queue, timeline, inspector, wizard, command surface, table, canvas, media browser, comparison view, search surface, or another justified pattern instead of defaulting to dashboards.

## 8. Anti-generic review

Before completion, ask:

- Could this interface belong to almost any AI/SaaS product?
- Are cards, pills, gradients, or icons being used by habit rather than need?
- Does the layout reflect the actual workflow?
- Would a frequent user know where to look first?
- Does the product retain a coherent identity across dense and empty states?

If the answer reveals generic decisions, fix the underlying hierarchy or interaction model before adding more styling.
