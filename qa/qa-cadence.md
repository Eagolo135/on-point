# QA Cadence Policy

## Purpose
Ensure QA is continuous within sprint execution, not end-loaded.

## Required Cadence
1. Start-of-package QA: spec QA (Knuth, Uncle Bob, GoF).
2. Mid-package QA: functional smoke checks after each meaningful implementation unit.
3. End-of-package QA: functional, golden path/E2E (as applicable), architecture.
4. QA decision gate: decide if another pass is useful or diminishing returns.

## Minimum Evidence Per Package
- one mid-package QA checkpoint entry
- one end-package QA summary
- one diminishing-returns decision entry

## Storage
- Place sprint/package QA evidence in /qa.
- Use qa-diminishing-returns-template.md for decision records.
