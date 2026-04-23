# Sprint 002 - Local Planning Interactions

## Goal
Ship interactive MVP flows for task creation/editing, blocker handling, task overrun handling, and local schedule rebuild explanations.

## Scope
- Interactive local task create/edit flow on Tasks screen
- Add Blocker modal on Dashboard
- Task overrun prompt flow (done, +30, custom, move remaining)
- Local scheduler utility to rebuild day plan and explain changes
- Free-time suggestion utility with profile-aware suggestions

## Out of Scope
- Backend/database persistence
- Real-time sync
- Real Google OAuth wiring
- LLM or external AI integration

## Files Expected to Change
- src/app/(app)/dashboard/page.tsx
- src/app/(app)/tasks/page.tsx
- src/features/dashboard/*
- src/features/tasks/*
- src/lib/scheduler/*
- src/lib/suggestions/*
- src/types/domain.ts
- src/lib/mock/mock-data.ts

## Tasks
- [ ] Implement scheduler utility and explanation output
- [ ] Implement mock free-time suggestions
- [ ] Implement blocker modal on dashboard
- [ ] Implement task overrun prompt actions
- [ ] Implement task create/edit local flow
- [ ] Validate lint and build

## Testing
- Run npm run lint
- Run npm run build
- Verify blocker flow updates timeline and explanations
- Verify overrun actions alter plan and explanation text
- Verify tasks can be created and edited locally
- Verify suggestions appear when free-time windows exist

## Blockers
None currently.

## Status
In Progress

## Definition of Done
- Dashboard supports blocker and overrun flows locally
- Scheduler utility outputs clear change explanation
- Tasks supports local create and edit
- Lint/build pass with no errors
