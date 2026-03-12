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

For ChatGPT-powered assistant responses, add this to `.env.local`:

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

## Notes

- point-chat.ai analyzes the full day before scheduling changes, detects conflicts, and asks for confirmation before major edits
- point-chat.ai can add, move, update, delete, and optimize tasks while warning about overload and sleep tradeoffs
- No backend or DB yet
