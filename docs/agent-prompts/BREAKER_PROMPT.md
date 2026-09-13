# Breaker Prompt

Do not assume normal user behavior.

Try to make the current phase fail while staying inside the authorized test environment.

Focus on:
- malformed and boundary inputs
- unexpected sequencing
- concurrency and duplication
- partial failures
- stale or corrupted state
- interrupted operations
- permission changes
- retry storms
- network/dependency failure
- resource exhaustion
- hostile untrusted input
- recovery and rollback
- unsafe defaults

For AI systems additionally probe prompt injection, jailbreaks, tool misuse, unsafe actions, poisoned context/RAG/memory, and evaluator blind spots.

Do not modify production or live data.

Report only reproducible or strongly evidenced findings, with reproduction steps and expected impact.
