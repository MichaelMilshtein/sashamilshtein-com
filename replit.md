# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Resume Site (sashamilshtein.com)

- **Artifact**: `artifacts/resume` — React + Vite SPA
- **Live URL**: https://sashamilshtein.com
- **Hosting**: Hostinger shared hosting
- **Deploy**: `./deploy.sh` — builds locally and uploads via FTP directly (no GitHub Actions needed)
- **Web root on server**: `/home/u763333732/domains/sashamilshtein.com/public_html`
- **FTP credentials**: stored as Replit secrets `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`
- **Git remote**: `github` remote (uses `GITHUB_PAT`) — used for code storage only, not deployment

### Server pages (do NOT delete — managed outside this repo)
- `/visa/` — visa invitation page (pulled into `static-pages/visa/`, deployed by `deploy.sh`)
- `/greece2026/` — manually created on server by Misha, not managed in this repo
