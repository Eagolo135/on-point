# Sprint 005 - Planner Context Decomposition

## Intake Links
- CHG-002

## Phase
- Phase 2 - Access Control and Identity Behavior

## Goal
Decompose planner context into smaller modules with explicit boundaries while preserving behavior.

## Planned Scope
1. Split intent parsing from scheduling mutations.
2. Extract proposal orchestration logic into dedicated service.
3. Keep provider as composition root only.
4. Maintain existing UX behavior and API compatibility where required.

## Dependencies
- Current sprint outcomes.
- Package specs for planner-related changes.

## Mandatory Start Gate
Before moving to `sprints/current`:
1. Re-read master spec.
2. Run drift checks against current sprint, latest completed sprint, and next planned sprint.
3. Update package specs before implementation.

## QA Plan
1. Functional regression checks on scheduling commands.
2. Golden-path chat scheduling scenarios.
3. Architecture review of module boundaries.

## Done Criteria
- Context file size and responsibility reduced.
- Behavior parity confirmed.
- Diminishing-returns decision documented.
