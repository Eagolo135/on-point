# Sprint 006 - Artifact and Deployment Strategy

## Intake Links
- CHG-003

## Phase
- Phase 4 - Production Hardening and Validation

## Goal
Define and enforce a clear strategy for source code vs generated deployment artifacts to reduce drift and noisy QA signals.

## Planned Scope
1. Decide artifact storage policy (same branch vs release branch vs workflow artifact only).
2. Align build/deploy docs and scripts to selected strategy.
3. Prevent generated artifacts from polluting source quality checks.

## Dependencies
- Decision with repository owner on publishing approach.

## Mandatory Start Gate
Before moving to `sprints/current`:
1. Re-read master spec.
2. Run drift checks against current sprint, latest completed sprint, and next planned sprint.
3. Update package specs before implementation.

## QA Plan
1. Validate local dev workflow remains fast.
2. Validate production build and deploy workflow remains reproducible.
3. Verify lint/test scans target source correctly.

## Done Criteria
- Artifact strategy documented in truth files.
- Repo structure and workflow aligned.
- Diminishing-returns decision documented.
