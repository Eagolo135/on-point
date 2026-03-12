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
- Local authentication (email-based local session)
- Home chat assistant page (ChatGPT-style)
- Visual month calendar view
- Tasks page with create/edit and shared planner state
- AI command handling that updates tasks and calendar
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
