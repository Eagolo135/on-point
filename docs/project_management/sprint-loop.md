# Sprint Loop Operating Model

## Purpose
Establish a formal, repeatable sprint loop that prevents drift and enforces spec-first delivery.

## Loop Stages
1. Change intake
2. Triage and scope decision
3. Backlog placement
4. Move sprint to current
5. Package execution with spec-first gates
6. QA passes and diminishing-returns decision
7. Move sprint to completed
8. Update all truth files

## Mandatory Pre-Work Gate (Before Every Package)
1. Re-read `PROJECT_SPEC.md`.
2. Read current sprint spec.
3. Read previous and next sprint docs to check boundary drift.
4. If drift exists, update specs/sprint docs first.
5. Only then start scaffold/implementation.

## Mandatory Per-Package Gate
1. Phase 0: understand/restate, assumptions, risks, dependencies, package-size check.
2. Phase 1: spec written/updated.
3. Phase 2: spec QA (Knuth, Uncle Bob, GoF).
4. Phase 3: scaffold.
5. Phase 4: implementation.
6. Phase 5: QA passes (functional, golden path/E2E, architecture).
7. Phase 6: diminishing-returns decision.

## Truth Files To Update Continuously
- `PROJECT_SPEC.md`
- `docs/project_management/package-status.md`
- `docs/project_management/sprint-roadmap-from-review.md`
- `docs/project_management/change_intake/intake-register.md`
- `qa/*.md` for each package/sprint
- sprint file in `sprints/current` and then `sprints/completed`

## Completion Criteria for Moving Sprint to Completed
- Scope items marked done or explicitly deferred.
- QA evidence linked.
- Risks and follow-ups recorded.
- Diminishing-returns decision documented.
