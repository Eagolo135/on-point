# Sprint 004 - Golden Path Hardening

## Intake Links
- CHG-001

## Goal
Establish a deterministic golden-path matrix tied to current implementation and future RBAC/anonymous packages.

## Scope
- Define executable-like golden path checklist for current app behavior.
- Define upcoming anonymous/RBAC gating golden paths for package implementation.
- Add QA report template for per-sprint validation.

## Backlog
1. Add golden-path matrix in `/tests/golden-path`.
2. Add QA report scaffold in `/qa` for sprint execution outcomes.
3. Tie tracker updates to package status and sprint completion.

## Acceptance Criteria
- Golden-path scenarios exist for current behavior and target behavior.
- QA report structure supports pass/fail evidence and risk notes.
- Project management docs reference golden-path artifacts.

## Risks
- Matrix can drift if not updated after package changes.

## QA Plan
- Keep matrix synchronized after each package completion.
- Validate at least one current-behavior path each sprint.

## Mandatory Pre-Package Loop
1. Re-read `PROJECT_SPEC.md`.
2. Check drift against previous and next sprint docs.
3. Update specs first if drift is found.
4. Run implementation only after spec QA is complete.

## QA Decision Gate (Required)
After each package, explicitly record:
1. Remaining issues.
2. Remaining risks.
3. Whether another QA pass is likely to find meaningful issues.
4. Whether additional QA now has diminishing returns.
