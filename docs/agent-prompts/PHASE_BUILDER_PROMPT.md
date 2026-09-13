# Phase Builder Prompt

Read the repository source of truth before editing.

First report:
- branch
- HEAD
- working-tree state
- governing phase document
- relevant architecture/security/decision files
- tests or checks you expect to run

Then implement only the current phase.

Requirements:
- preserve existing working behavior unless explicitly changed
- reuse existing patterns when fit for purpose
- avoid unrelated refactors
- do not silently begin later phases
- apply Premium Build when relevant and available
- run appropriate verification
- inspect rendered UI when applicable
- report exact tests/checks and results
- provide final HEAD and remaining risks

Stop after the phase acceptance criteria are met or a blocker prevents safe completion.
