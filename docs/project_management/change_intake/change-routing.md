# Change Routing Policy

All new work must start as an intake entry before sprint assignment.

## Allowed Intake Types
- feature
- bug
- hotfix
- refactor
- spike

## Routing Rules
1. Create intake entry from `intake-template.md`.
2. Assign intake ID and set status `proposed`.
3. Triage to `approved`, `deferred`, or `rejected`.
4. If approved, map to sprint in `sprints/backlog`.
5. Move sprint to `sprints/current` when execution starts.
6. Keep intake status synchronized: `in-sprint` -> `done`.

## Sprint Interruption Policy
1. Hotfixes can interrupt the active sprint only if severity is critical.
2. Critical hotfix interruption requires explicit record in intake notes and sprint notes.
3. Non-critical hotfixes are queued through backlog like other intake types.

## SLA Guidance
- hotfix: same day triage
- bug: next triage cycle
- feature/refactor/spike: normal sprint planning cycle

## Compliance Check Before Work Starts
- Intake ID exists.
- Sprint assignment exists.
- Package spec updated and QA-reviewed.
- For hotfix: critical severity confirmed and interruption decision documented.
