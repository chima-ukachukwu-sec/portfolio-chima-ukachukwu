# Independent Reviewer Prompt

Operate in read-only mode unless explicitly authorized to modify files.

Inspect the current phase implementation against:
- current phase specification
- PRD
- architecture and decision records
- security requirements
- applicable quality budgets
- tests
- Premium Build for relevant user-facing work

Prioritize:
1. broken workflows
2. security or trust failures
3. data integrity / recovery failures
4. correctness defects
5. accessibility blockers
6. responsive failures
7. performance regressions
8. maintainability problems that materially affect the phase
9. cosmetic issues

Separate verified defects from preferences.

For every material finding include:
- severity
- evidence
- affected file/behavior
- why it violates a requirement or creates risk
- smallest reasonable fix

If no material defect is verified, say so plainly.
