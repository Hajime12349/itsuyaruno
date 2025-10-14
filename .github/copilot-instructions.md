# Copilot / AI assistant instructions for this repository

Follow these concise, actionable rules when editing or adding code in this repo.

- Language: All responses and inline comments should be in Japanese (see `AGENTS.md`). 専門用語は英語併記で説明してください。

- Big picture
  - This is a Next.js 14 application using the App Router (app/ directory). UI pages live under `app/*` and use React + TypeScript.
  - The project follows a simple Domain-Driven Design (DDD) layout under `domain/`, `application/`, `infrastructure/`, and `interfaces/`:
    - `domain/` contains entities and repository interfaces (example: `domain/tasks/Task.ts`).
    - `application/` contains use-case services (e.g. `application/tasks/CreateTask.ts`).
    - `infrastructure/` contains adapters to persistence (Postgres) and other infra code.
    - `interfaces/http/` and `app/api/` contain HTTP handlers and Next.js API routes.

- Key files and patterns to reference
  - `package.json`: standard Next.js scripts (`dev`, `build`, `start`, `lint`). Local development often uses Docker (`docker-compose.yml`) per `README.md`.
  - `app/`: Next.js App Router pages and server components. Check `app/page.tsx`, `app/layout.tsx` for global layout and providers.
  - `lib/auth.ts`, `lib/db_api_wrapper.ts`, `lib/db.js`: central auth and DB helper utilities — prefer using these for DB/auth interactions.
  - `domain/` and `application/` files define data shapes and business rules — modify here for behavior changes rather than changing UI or infra directly.

- Conventions and guarded behaviors
  - Keep domain entities immutable where possible. Factories are used (e.g. `TaskEntity.create(props)`) to validate inputs.
  - The codebase assumes ISO date strings for deadlines (`deadline?: string` on tasks).
  - TypeScript is used across the board; preserve types and update interfaces when changing shapes.

- Build / run / debug
  - Preferred local run during development: `docker-compose up` (see `README.md`). For non-Docker local dev use: `npm run dev` from repo root.
  - To build for production: `npm run build` then `npm start` (or rely on Docker image in `Dockerfile`).

- Testing and linting
  - Linting via `npm run lint` (Next.js eslint). There are no tests included; if you add tests, place them near the code they exercise and wire scripts into `package.json`.

- PR and editing guidance for AI
  - When changing behavior, update `domain/` and `application/` layers first and then adjust `interfaces/` and `app/` UI routes.
  - Preserve existing file exports and public APIs unless a refactor is necessary; list all usages before renaming (search the repo).
  - Small, safe changes: prefer adding new modules over editing many files. For destructive changes, propose a migration plan in the PR description.

- Integration points & third-party dependencies
  - PostgreSQL via `pg` and `@vercel/postgres` — check `postgres/init/` for DB init scripts.
  - Authentication uses `next-auth` and local `lib/auth.ts` helpers.

- Examples from the codebase
  - Domain factory: `domain/tasks/Task.ts` implements `TaskEntity.create(props)` to validate props before construction.
  - UI component example: `components/TaskPanel.tsx` and `components/TaskWindow.tsx` show how domain data is rendered in React components.

- Safety and limits for AI edits
  - Do not change Docker or deployment config without noting impact in the PR.
  - Keep Japanese language requirement in mind for all commit messages, comments, and user-facing text changes unless otherwise discussed.

If anything here is unclear or you want additional examples (tests, end-to-end flow), tell me which area to expand and I'll update this file.
