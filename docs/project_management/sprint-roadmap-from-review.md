# Sprint Roadmap From Clean-Architecture Review

## Source
Based on repo-wide Uncle Bob review findings: dead API surface, auth state noise, planner context size, artifact strategy ambiguity, and golden-path coverage gaps.

## Sprint Mapping

### Sprint 003 - Clean Architecture Trim
Status: completed

Findings addressed:
1. Unused planner context API (`runAssistantCommand`) removed.
2. Ceremonial auth readiness flag removed from context and consumers.
3. Unused auth model exports removed (`isPrivilegedRole`, `SessionReadResult`).
4. README corrected to match current runtime dependencies.

Evidence:
- `src/features/planner/planner-context.tsx`
- `src/features/auth/auth-context.tsx`
- `src/components/layout/app-shell.tsx`
- `src/app/(auth)/auth/sign-in/page.tsx`
- `src/features/auth/model/roles.ts`
- `src/features/auth/model/session.ts`
- `README.md`

### Sprint 004 - Golden Path Hardening
Status: in progress

Findings addressed:
1. Golden-path matrix added to avoid requirement drift.
2. QA sprint report scaffold added.

Evidence:
- `tests/golden-path/golden-path-matrix.md`
- `qa/sprint-003-clean-architecture-trim.md`

### Sprint 005 - Planner Context Decomposition
Status: planned

Findings to address:
1. Break planner god-object into smaller use-case modules.
2. Isolate parsing/intents from scheduling mutations.
3. Preserve current behaviors with low-risk extraction steps.

### Sprint 006 - Artifact and Deployment Strategy
Status: planned

Findings to address:
1. Decide source-branch vs exported-artifact strategy.
2. Prevent generated output clutter from polluting source QA signals.

## Golden Path Definition (Current)
1. User visits sign-in route.
2. User authenticates and reaches assistant.
3. Unauthenticated user attempting protected route is redirected to sign-in.
4. Assistant chat remains responsive for scheduling prompts.

## Diminishing Returns Check
- Additional cleanup-only QA on Sprint 003 has diminishing returns.
- Highest-value next QA is after Sprint 005 decomposition and Sprint 006 artifact strategy decisions.
