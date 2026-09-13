# Release Review Prompt

Perform a release-readiness review.

Do not modify files unless explicitly authorized.

Check the release gate against repository evidence. Verify, do not assume:
- critical workflow
- tests/build/type/lint
- security controls
- migrations
- rollback/recovery
- configuration/secrets
- observability
- performance
- accessibility/rendered UI
- documentation
- Git state
- post-release smoke test

Return:
- GO or NO-GO
- blocking findings
- non-blocking findings
- missing evidence
- exact recommended next action
