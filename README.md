# On Point

On Point is a mobile-friendly productivity web app for realistic schedule orchestration. The MVP is built with Next.js App Router, TypeScript, Tailwind CSS, reusable components, and local/mock data first.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Local mock data (no backend yet)

## Current MVP Phase

Current MVP includes:

- Core architecture and folder structure
- Firebase Authentication (Google sign-in)
- Home chat assistant page (ChatGPT-style)
- Visual month calendar view
- Tasks page with create/edit and shared planner state
- AI command handling that updates tasks and calendar
- Google Calendar API read/create/update from client (MVP)
- Sprint tracking workflow

## Routes

- /auth/sign-in
- /dashboard
- /calendar
- /tasks
- /assistant
- /profile

## Project Structure

```
src/
	app/
		(auth)/auth/sign-in/
		(app)/
			dashboard/
			calendar/
			tasks/
			assistant/
			profile/
	features/
		auth/
			google/
		assistant/
		planner/
	components/
		layout/
		providers/
		ui/
	config/
	lib/mock/
	types/
sprints/
	active/
	completed/
```

## Sprint Workflow

- Add active sprint plans in `sprints/active/`
- Move completed sprint files to `sprints/completed/`
- Keep only in-progress sprint files in `sprints/active/`

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Notes

- Assistant command parsing is local (no external LLM backend yet)
- No backend or DB yet

## Firebase Google Auth + Calendar Scope

This project uses Firebase Authentication with Google as the only sign-in method.

During sign-in, it requests this additional Google OAuth scope:

- https://www.googleapis.com/auth/calendar

This is required so On Point can call Google Calendar APIs for:

- Reading events
- Creating events
- Updating events

### Required environment variables

Set these in local `.env.local` and in GitHub Actions secrets:

- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

### Firebase Console setup checklist

1. Enable Firebase Authentication → Google provider.
2. Add authorized domains:
	- localhost
	- eagolo135.github.io
3. In Google Cloud, ensure Google Calendar API is enabled for the same project.

### App-specific user data separation

On Point stores app-specific user data separately from Firebase identity.

- Identity/session: managed by Firebase Auth
- App profile/preferences: local app storage key scoped by Firebase UID

### MVP token handling note (important)

For this static MVP, the Google Calendar access token is handled client-side only.
This is acceptable for MVP/demo use, but production should use a backend-backed host to:

- Store tokens securely server-side
- Perform token refresh/rotation safely
- Enforce server-side authorization for calendar operations
