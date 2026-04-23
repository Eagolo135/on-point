# Development Phase Plan

## Purpose
Define explicit project phases and map sprint/package work under them.

## Phase 1 - Foundation and Governance
Status: in progress

Objectives:
1. Establish master spec and sprint-control loop.
2. Establish change intake and truth-file update discipline.
3. Stabilize baseline architecture before feature acceleration.

Sprint mapping:
- sprint-003-clean-architecture-trim (completed)
- sprint-004-golden-path-hardening (current)

Package mapping:
- Package 1A complete
- Package 1B planned

## Phase 2 - Access Control and Identity Behavior
Status: planned

Objectives:
1. Implement role-aware middleware and UI enforcement.
2. Implement anonymous gating and migration paths.
3. Ensure premium gating and admin enforcement align with product requirements.

Sprint candidates:
- sprint-005-planner-context-decomposition
- future sprint(s) for RBAC and anonymous flow

Package mapping:
- Package 2 through Package 6
- Package 9

## Phase 3 - Experience and Streaming
Status: planned

Objectives:
1. Implement streaming chat responses (SSE-first).
2. Add multimedia/fullscreen/chart support while preserving agent panel UX.
3. Strengthen reliability for high-frequency chat interactions.

Package mapping:
- Package 7
- Package 8

## Phase 4 - Production Hardening and Validation
Status: planned

Objectives:
1. Validate Docker production runtime on port 4000.
2. Complete full E2E golden path and Lighthouse audit loop.
3. Close refactor backlog from QA findings.

Package mapping:
- Package 10
- Package 11
- Package 12

## Phase Governance Rules
1. Every sprint must declare its phase.
2. Phase transitions require updates to PROJECT_SPEC and package-status.
3. Drift checks must include phase alignment between current, latest completed, and next sprint.
