# Sprint 003 - Clean Architecture Trim

## Goal
Apply Uncle Bob-style cleanup by removing unnecessary code, shrinking API surface, and reducing accidental complexity without changing product behavior.

## Scope
- Remove unused planner context API surface.
- Remove ceremonial auth readiness state.
- Remove dead auth model exports.
- Align docs with actual runtime behavior.

## Backlog
1. Remove `runAssistantCommand` from planner context public API.
2. Remove `isReady` from auth context and consuming pages/components.
3. Remove unused `isPrivilegedRole` helper.
4. Remove unused `SessionReadResult` type.
5. Update package management tracker and QA notes.

## Acceptance Criteria
- No consumer references to removed APIs remain.
- Source lint passes for changed modules.
- Existing sign-in and protected shell flows still function.
- Sprint notes and QA artifacts committed.

## Risks
- Consumer breakage from context API changes.
- Redirect timing regressions after `isReady` removal.

## QA Plan
1. Functional QA: sign-in and protected route redirect behavior.
2. Architecture QA: verify reduced public API and dead-code removal.
3. Golden-path QA: core login -> assistant flow sanity checks.
