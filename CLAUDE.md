# Claude Code

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

## Package manager

Use `pnpm`, never `npm`. Run binaries with `pnpm exec` (e.g. `pnpm exec payload migrate`).

## Database / migrations

Postgres (Neon) with `push: false` — schema is never auto-synced on boot. Every schema
change goes through a migration: `pnpm exec payload migrate:create <name>`, review the
generated SQL, then `pnpm exec payload migrate`. Note: with an empty migration history
`migrate:create` emits a full from-scratch baseline, not a diff — hand-edit it down to the
real delta when the live DB already has the tables.
