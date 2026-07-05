# Agent Entry

This repository is mainly maintained with AI coding agents such as DeepSeek.
Keep this file short. It is the routing layer for the project harness, not the
place for full architecture notes.

## Required First Read

Before making code changes, read:

1. `harness/START_HERE.md`
2. `harness/PROJECT_BRIEF.md`
3. The task-specific harness files listed in `harness/START_HERE.md`

## Hard Rules

- Do not rewrite unrelated code while completing a focused task.
- Preserve the current Vite + TypeScript + Three.js architecture unless the
  task explicitly asks for a larger redesign.
- Use TDD for behavior changes: write or update unit tests before changing
  implementation.
- Run the verification commands in `harness/VERIFICATION.md` before handing off.
- Update harness docs when a change modifies architecture, features,
  conventions, or verification steps.
- Keep `AGENTS.md` thin. Add details to files under `harness/`.
