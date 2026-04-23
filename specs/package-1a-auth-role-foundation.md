# Package 1A Spec: Auth Session Domain + Role Model Foundation

## Phase 0 - Understand and Restate
Restated package:
- Define foundational auth/session/role domain so the app can consistently identify anonymous, logged-in, and admin users across UI and future middleware integration.

Assumptions:
- Existing local auth remains temporary backing store in this package.
- No backend token verification is added in Package 1A.
- Admin role is modeled now, trusted-source enforcement lands with middleware package.

Risks:
- Role model may drift if not centralized.
- Existing protected-shell behavior could break if session schema transition is abrupt.
- Local-only admin representation could be misinterpreted as secure enforcement.

Dependencies:
- Current auth provider and sign-in page behavior.
- Route-group shell expectations in app layout.
- Upcoming Package 1B and Package 2 RBAC middleware work.

Package size:
- Split package accepted: 1A is foundation only.

## Objective
Create a clean, typed auth and role foundation that supports anonymous, authenticated user, and admin identities with explicit interfaces and service boundaries.

## User Stories
- As an anonymous user, I am represented by a first-class session type.
- As a signed-in user, I am represented by an authenticated session type.
- As an admin, my role can be identified consistently for middleware/UI checks.
- As a developer, I can consume one role/session API instead of scattered logic.

## Functional Requirements
- Define canonical role type: anonymous, user, admin.
- Define session union model: anonymous and authenticated sessions.
- Define role-resolution utility that returns effective role from session.
- Define auth service boundaries:
  - read session
  - write session
  - clear session
  - transition anonymous to authenticated
- Define compatibility adapter for legacy local session shape.
- Define middleware integration contract stub.
- Define navigation policy contract stub.

## Non-Functional Requirements
- Maintainability through centralized role/auth logic.
- Deterministic parse behavior (fail-closed on invalid payload).
- Clear typing and interface boundaries for future backend adoption.
- No hidden coupling between UI/chat and storage keys.
- Preserve fast local dev workflow.

## Acceptance Criteria
- Role/session types and contracts exist and are importable.
- Existing auth context maps to new interfaces without route regressions.
- Both anonymous and authenticated sessions are representable.
- Admin role is modeled distinctly.
- Legacy compatibility adapter exists.

## Edge Cases
- Missing/invalid session payload.
- Unknown role value.
- Anonymous session with stale/invalid metadata.
- Authenticated session missing required identity fields.

## Security/Auth Implications
- Client-side role is not trust proof; middleware/server validation required later.
- Session parse must fail closed on malformed payload.
- Role escalation by client mutation remains untrusted.

## QA Plan
Spec QA:
- Knuth: correctness, transition coverage, edge-case handling.
- Uncle Bob: separation of responsibilities and boundaries.
- GoF: policy + adapter boundaries to support extension.

Post-implementation QA for Package 1A:
- Functional QA: session parsing, role resolution, transition behavior.
- Golden-path QA: anonymous bootstrap and sign-in transition shape.
- Architecture QA: ensure policy interfaces are used over direct storage coupling.

## Rollback / Refactor Notes
- Keep adapter boundary to support rollback to legacy session schema.
- Defer persistence, message gating, and migration implementation details to later packages.

## Out of Scope
- 5-message anonymous gating.
- Anonymous message migration implementation.
- Middleware enforcement.
- Streaming/multimedia/premium/docker work.

## Phase 2 Spec QA Summary
- Knuth pass complete.
- Uncle Bob pass complete.
- GoF pass complete.
- Status: spec QA complete, ready for scaffold and in-scope implementation.
