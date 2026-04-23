# PROJECT_SPEC.md

## 1. Project Overview
This document is the living source of truth for the project. Its purpose is to prevent implementation drift during agent-assisted development by preserving the project's goals, architecture, feature requirements, constraints, and QA expectations.

The agent must re-read this file before starting any new package of work, implementation phase, QA phase, or refactor pass.

---

## 2. Core Goal
Build and improve a chat-based application using Next.js and TypeScript with strong spec-driven development, role-based access control, streaming support, multimedia-rich chat UI, and production-ready deployment.

This project should prioritize:
- correctness
- maintainability
- clean architecture
- QA discipline
- minimal drift between intended behavior and actual implementation

---

## 3. Development Method
This project follows spec-driven development.

For every package of work:
1. Write or update the spec first
2. QA the spec before implementation
3. Scaffold before deep implementation
4. Implement only the scoped package
5. Run QA passes
6. Decide whether more QA is worthwhile or has diminishing returns
7. Update this master spec if requirements, architecture, or status changed

---

## 4. Tech Stack
- Next.js
- TypeScript
- Local dev server on port 3000
- Dockerized production build on port 4000
- Playwright for E2E testing
- Lighthouse for audit/performance/accessibility checks
- Streaming support using SSE if suitable

---

## 5. Primary Product Requirements

### Anonymous Role
- Sees hero section
- Can send chat messages without account at first
- After the first message, show prompt encouraging sign-in/sign-up to save messages
- Chat history started anonymously should carry over if the user signs up
- Anonymous users are limited to 5 chat messages before sign-up is required

### Logged-In Role
- Does not see hero section
- Conversation history is saved automatically
- Has access to standard authenticated features

### Admin Role
- Has access to admin-only views and controls
- Admin access must be enforced in both UI and middleware
- Admin routes must not rely only on hidden frontend navigation

---

## 6. Feature Requirements
- Chat interface with persistent conversations for authenticated users
- Anonymous-to-user conversation migration
- 5-message anonymous limit
- Sign-in/sign-up prompts tied to chat usage
- RBAC menu/navigation system
- RBAC enforcement in middleware
- Multimedia support in chat
- Fullscreen images/media support
- Chart support where applicable
- Agent panel/sidebar experience must remain intact
- Premium tool/feature requires authenticated account
- Streaming response support using SSE if practical

---

## 7. Architecture Rules
- RBAC must be enforced at the middleware layer and reflected in UI
- Auth logic must not be scattered randomly across components
- Keep role logic centralized
- Prefer composable services and clear boundaries
- Avoid hidden coupling between chat logic, auth logic, and UI logic
- Avoid implementing large features without an associated spec
- Prefer maintainable patterns over clever hacks

---

## 8. Source of Truth Rules
This file is the long-term source of truth for the project.

The agent must:
- read this file before each package
- update this file when requirements change
- update this file when architecture decisions are finalized
- update this file when scope changes
- update this file when package status changes
- not overwrite important decisions with shorter summaries that lose detail

If a temporary summary conflicts with this file, this file wins.

---

## 9. Package Structure
Recommended package order:

1. Auth and role model design
2. RBAC middleware and protected routing
3. RBAC menu system
4. Anonymous usage flow and 5-message gating
5. Anonymous-to-user conversation carryover
6. Conversation persistence for authenticated users
7. Streaming implementation
8. Multimedia/fullscreen/chart rendering
9. Premium tool auth gating
10. Docker production build and runtime validation
11. Full E2E golden path coverage
12. Refactor and cleanup

---

## 10. QA Standards

### Spec QA
Review specs from these perspectives:
- Knuth-style correctness and structure
- Uncle Bob clean-code hygiene
- Gang of Four design pattern appropriateness

### Implementation QA
Run 2-3 QA passes:
- Functional QA
- E2E / golden path QA
- Architecture / maintainability QA

### Required QA Areas
- role behavior
- route protection
- anonymous gating
- conversation persistence
- sign-up migration flow
- production Docker behavior
- performance/accessibility where relevant

---

## 11. Golden Path Scenarios
- Anonymous user lands and sees hero section
- Anonymous user sends first message and sees save/sign-up prompt
- Anonymous user reaches 5-message limit and is asked to sign up
- Anonymous user signs up and prior conversation history is preserved
- Logged-in user lands without hero section
- Logged-in user sees saved conversation history
- Admin user sees admin UI and can access admin routes
- Non-admin user cannot access admin-only routes directly
- Premium tool is blocked for unauthenticated users
- Docker production build works on port 4000

---

## 12. Directory Expectations
- /specs -> package-level specs
- /refactor -> refactor notes and technical debt
- /qa -> QA reports and summaries
- /tests/e2e -> Playwright end-to-end tests
- /tests/golden-path -> essential user journey tests
- /docs/project_management -> planning and source-of-truth docs

---

## 13. Constraints and Non-Negotiables
- Do not implement major features without a spec
- Do not let package summaries replace this document
- Do not rely on UI-only authorization
- Do not leave auth behavior ambiguous
- Do not skip QA for small packages if they affect auth, routing, chat flow, or persistence
- Keep local dev fast, but validate against production Docker behavior too

---

## 14. Current Status
### Completed
- [x] Package 1A: auth session domain + role model foundation

### In Progress
- [ ]

### Not Started
- [ ] Package 1B: anonymous carryover contract design
- [ ] RBAC middleware
- [ ] RBAC menu system
- [ ] Anonymous chat gating
- [ ] Anonymous-to-user conversation migration
- [ ] Streaming
- [ ] Multimedia support
- [ ] Premium tool gating
- [ ] Docker production validation
- [ ] Full E2E + Lighthouse QA
- [ ] Refactor pass

---

## 15. Open Questions
- Which auth provider is being used in production long-term?
- How will anonymous conversation history be stored before sign-up?
- How should premium-tool permissions differ from normal authenticated permissions?
- Is SSE enough for all streaming needs or is a more interactive protocol needed later?
- What exact admin-only features exist in scope right now?

---

## 16. Update Protocol
After each package of work, update:
- package status
- architecture decisions made
- new constraints discovered
- QA findings
- unresolved risks
- refactor needs
- changes to scope

This document must remain detailed enough that a new agent session can resume accurately without losing essential project intent.
