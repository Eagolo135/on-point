# Golden Path Matrix

## Current Behavior (Implemented)
1. Sign-in flow:
- Navigate to `/auth/sign-in`
- Submit email
- Expect redirect to `/assistant`

2. Protected shell redirect:
- Without authenticated user state, open `/assistant`
- Expect redirect to `/auth/sign-in`

3. Planner chat basic path:
- Send scheduling prompt in assistant
- Expect assistant response and no crash

## Target Behavior (Planned Packages)
1. Anonymous entry sees hero section and can send first message.
2. After first message, sign-in/sign-up save prompt appears.
3. Anonymous user blocked at 5 messages and asked to sign up.
4. Anonymous history carries over after sign-up.
5. Admin route guarded in middleware and hidden from non-admin menu.
6. Premium feature blocked for unauthenticated users.
7. Docker production runtime available on port 4000.

## Per-Sprint Execution Log
- Sprint 003: current behavior checks updated for auth cleanup.
- Sprint 004+: expand with Playwright automation when package scope enables it.
