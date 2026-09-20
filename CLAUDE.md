# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
