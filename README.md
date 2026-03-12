# On Point

On Point is a mobile-friendly productivity web app for realistic schedule orchestration. The MVP is built with Next.js App Router, TypeScript, Tailwind CSS, reusable components, and local/mock data first.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Local mock data (no backend yet)

## Current MVP Phase

Phase 1 includes:

- Core architecture and folder structure
- Route scaffolding
- Placeholder screens for dashboard, calendar, tasks, assistant, profile
- Auth and onboarding placeholders
- Domain TypeScript models
- Sprint tracking workflow

## Routes

- /auth/sign-in
- /onboarding
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
		(onboarding)/onboarding/
		(app)/
			dashboard/
			calendar/
			tasks/
			assistant/
			profile/
	components/
		layout/
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

- Google sign-in is currently an honest placeholder (mock only)
- Assistant is currently local/mock behavior
- No backend, DB, or external AI integration in Phase 1
