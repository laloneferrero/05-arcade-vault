# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Skills
Usa siempre /frontend-design para diseñar la UI

## Project

Arcade Vault: online games platform, compete for highest score. README (Spanish) says project uses Spec Driven Design (`/spec`, `/spec-impl`) following https://github.com/Klerith/fernando-skills (installed via `npx skills@latest add Klerith/fernando-skills`).

Current state: fresh `create-next-app` scaffold. `app/page.tsx` still default template; layout metadata still "Create Next App". No games, scoring, API, DB, or tests yet.

## Commands

```bash
npm run dev     # dev server
npm run build   # production build
npm start       # serve production build
npm run lint    # eslint (flat config, eslint.config.mjs)
```

No test runner configured.

## Stack

- Next.js 16.3.5 App Router (`app/`), React 19, TypeScript strict
- Tailwind CSS v4 via `@tailwindcss/postcss`; theme tokens in `app/globals.css` (`@theme inline`, light/dark via `prefers-color-scheme`)
- Fonts: Geist Sans/Mono via `next/font/google` in `app/layout.tsx`
- Path alias `@/*` → repo root
- `RootLayout` typed with global `LayoutProps<"/">` (Next typed-routes helper, generated types in `.next/`), no import needed

Next 16 is newer than much training data; verify APIs against official docs.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
