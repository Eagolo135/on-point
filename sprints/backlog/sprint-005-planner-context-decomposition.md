# Sprint 005 - Planner Context Decomposition

## Intake Links
- CHG-002

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

## QA Plan
1. Functional regression checks on scheduling commands.
2. Golden-path chat scheduling scenarios.
3. Architecture review of module boundaries.

## Done Criteria
- Context file size and responsibility reduced.
- Behavior parity confirmed.
- Diminishing-returns decision documented.
