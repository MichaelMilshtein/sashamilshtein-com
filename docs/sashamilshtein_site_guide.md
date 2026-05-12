# SASHAMILSHTEIN_SITE_GUIDE.md

## Purpose of this guide

This document is the working handoff guide for the `sashamilshtein.com` website project. It is intended for future ChatGPT sessions, Codex tasks, other AI systems, and humans working on the site.

The goal is to make it possible to quickly understand how the site is structured, how to preview it locally, how to deploy it safely, and which areas should not be changed casually.

---

## Current operating principle

GitHub is the source of truth.

Hostinger is only the published copy.

Do not make live-site-only edits on Hostinger unless there is an emergency. Any meaningful change should be reflected in GitHub so the repository remains accurate.

The current working chain is:

```text
VS Code → local preview → GitHub Desktop → GitHub → FileZilla → Hostinger → live site
```

Codex can work on the GitHub repository through pull requests. ChatGPT is used as teacher, architect, reviewer, and workflow guide.

Replit is no longer required for `sashamilshtein.com`, but some of the repository structure and dependency configuration originated from Replit/Linux and has been adjusted to support local Mac development.

---

## Repository

GitHub repository:

```text
MichaelMilshtein/sashamilshtein-com
```

Local Mac path:

```text
/Users/michaelmilshtein/Documents/github/sashamilshtein-com
```

Default branch:

```text
main
```

Package manager:

```text
pnpm
```

Michael’s Mac now has pnpm installed globally in a user-owned npm prefix. Current known working pnpm version during setup was:

```text
pnpm 10.33.2
```

Node/npm observed during setup:

```text
Node v24.15.0
npm 11.12.1
```

---

## Main site areas

The repo currently contains multiple types of web projects. Do not assume the entire site is one single technology stack.

### 1. Sasha resume site

The Sasha resume is a React/Vite app.

Likely source location:

```text
artifacts/resume/
```

Main shared resume content/data:

```text
artifacts/resume/src/data/resumeData.ts
```

Mobile resume presentation component:

```text
artifacts/resume/src/pages/MobileResume.tsx
```

`resumeData.ts` is the main place for resume text/content. Editing it should affect both desktop and mobile views because the views read from the shared data object.

Do not upload `resumeData.ts` directly to Hostinger. It is source code, not the final deployed site.

### 2. Greece page

The Greece itinerary page is PHP/static.

Known path:

```text
static-pages/greece2026/index.php
```

This page uses PHP session/password logic. It can run directly on Hostinger as PHP.

### 3. Visa page

The Visa supplemental page is also PHP/static.

Known path direction:

```text
static-pages/visa/
```

This page should not be casually modified because it supports a sensitive job/application-related use case.

### 4. Control test folder

A harmless test folder was used to confirm local-to-Hostinger deployment:

```text
control-test/chatgpt-control-check.md
```

Live test URL after upload:

```text
https://sashamilshtein.com/control-test/chatgpt-control-check.md
```

This confirmed:

```text
local Mac → GitHub Desktop → GitHub → FileZilla → Hostinger → live site
```

---

## Safety rules

### Do not casually touch these areas

Do not casually modify Sasha’s main resume or Visa page unless Michael explicitly asks.

Treat the Visa page as especially sensitive.

Treat Sasha’s main resume as production content.

### Safer places for experiments

The Greece page has historically been used as a safer experiment area, but still avoid unnecessary changes.

The safest test area is:

```text
control-test/
```

### GitHub first

All meaningful changes should go into GitHub. Hostinger should not become the only place where a change exists.

### Hostinger is not the source

Files uploaded to Hostinger are the published copy only. If something is changed directly on Hostinger, recreate or commit the same change in GitHub immediately.

---

## Local tools now in use

### VS Code

VS Code is used to comfortably browse and edit code.

Open this folder in VS Code:

```text
/Users/michaelmilshtein/Documents/github/sashamilshtein-com
```

VS Code terminal can be used instead of the separate Mac Terminal app.

To check the current folder in any terminal:

```bash
pwd
```

Expected repo root:

```text
/Users/michaelmilshtein/Documents/github/sashamilshtein-com
```

### GitHub Desktop

GitHub Desktop is used for visual Git operations:

```text
pull latest → review changes → commit → push
```

Use GitHub Desktop for simple local edits rather than command-line Git.

### FileZilla

FileZilla is used for FTP deployment to Hostinger.

Hostinger FTP credentials are stored outside Replit and should be kept in a password manager or another secure private location. Do not paste credentials into ChatGPT or Codex prompts.

### Homebrew / PHP

Homebrew was installed to install PHP.

PHP is now available on Michael’s Mac.

Observed PHP version after install:

```text
PHP 8.5.6
```

---

## Running Sasha resume locally

Use this for the React/Vite resume app.

From the repo root:

```bash
pnpm --filter ./artifacts/resume run dev
```

Open:

```text
http://localhost:3000/
```

Leave the terminal running while previewing.

Stop the server with:

```text
Control + C
```

If the local server is closed, VS Code is closed, Terminal is closed, or the Mac sleeps/restarts, the local server stops.

### What “server running” means

A local server means the Mac is temporarily serving the project for preview in the browser. For this workflow it is usually only local:

```text
localhost:3000
```

It is not the live website. It is safe to run while actively working, but stop it when done.

---

## Running Greece / Visa PHP pages locally

Use this for PHP/static pages such as Greece and Visa.

From the repo root:

```bash
php -S localhost:8000
```

Open Greece:

```text
http://localhost:8000/static-pages/greece2026/
```

Open Visa:

```text
http://localhost:8000/static-pages/visa/
```

Leave the terminal running while previewing.

Stop the server with:

```text
Control + C
```

### Simple local-preview memory rule

```text
Resume = pnpm / port 3000
Greece + Visa = PHP / port 8000
```

---

## Deployment: Sasha resume

The Sasha resume is a React/Vite app. It must be built before deployment.

Do not upload raw source files such as `resumeData.ts` to Hostinger expecting the live site to change.

### Correct workflow

1. Edit source in VS Code.

Common content file:

```text
artifacts/resume/src/data/resumeData.ts
```

2. Preview locally:

```bash
pnpm --filter ./artifacts/resume run dev
```

Open:

```text
http://localhost:3000/
```

3. Stop the dev server:

```text
Control + C
```

4. Build for Hostinger:

```bash
pnpm --filter ./artifacts/resume run build:hostinger
```

5. The correct local build output to upload is:

```text
artifacts/resume/dist/public/
```

Important: upload the contents inside `public/`, not the `public` folder itself, and not the ZIP file.

The build may also create:

```text
artifacts/resume/dist/resume-hostinger.zip
```

The ZIP is expected, but FileZilla uploading the ZIP alone does not deploy the site because Hostinger does not automatically unzip it.

6. In FileZilla, remote destination for the main site is:

```text
/domains/sashamilshtein.com/public_html/
```

7. Upload:

```text
contents of artifacts/resume/dist/public/ → contents of /domains/sashamilshtein.com/public_html/
```

Replace existing files when asked.

8. Check live site:

```text
https://sashamilshtein.com/?v=test
```

Use a query string such as `?v=test` to reduce browser-cache confusion.

### Resume deployment shorthand

```text
Edit resume source
→ pnpm --filter ./artifacts/resume run dev
→ confirm localhost:3000
→ Control + C
→ pnpm --filter ./artifacts/resume run build:hostinger
→ upload contents of artifacts/resume/dist/public to /domains/sashamilshtein.com/public_html
→ check live site
```

---

## Deployment: Greece / Visa PHP pages

Greece and Visa pages are PHP/static files. They do not require a Vite build.

### Correct workflow

1. Edit the PHP/static file in VS Code.

Examples:

```text
static-pages/greece2026/index.php
static-pages/visa/...
```

2. Preview locally if needed:

```bash
php -S localhost:8000
```

Open:

```text
http://localhost:8000/static-pages/greece2026/
http://localhost:8000/static-pages/visa/
```

3. Commit/push through GitHub Desktop.

4. Upload the changed file or folder through FileZilla to the corresponding path under Hostinger.

5. Check the live URL.

### PHP/static deployment rule

```text
PHP/static page edits can be uploaded directly.
React/Vite resume source edits must be built first.
```

---

## GitHub / Codex workflow

Codex is connected to GitHub and can create PRs.

Preferred Codex pattern:

```text
Make the smallest safe change.
Do not modify Sasha resume content or visuals unless explicitly requested.
Do not modify Visa or Greece pages unless explicitly requested.
Open a PR with summary and testing notes.
```

For risky or uncertain changes, Codex should work in a branch/PR and should not directly push to `main` without review.

GitHub Desktop should then pull changes after PR merge.

---

## Dependency / Mac compatibility history

The repo was originally shaped around Replit/Linux. Local Mac preview initially failed due to missing native optional dependencies for Apple Silicon macOS.

These issues were fixed through Codex PRs by adding/supporting Darwin ARM64 packages in `pnpm-lock.yaml` and `pnpm-workspace.yaml`.

Known missing native dependency sequence that was resolved:

```text
@rollup/rollup-darwin-arm64
lightningcss-darwin-arm64
@tailwindcss/oxide-darwin-arm64
@esbuild/darwin-arm64
```

A later final verification added `supportedArchitectures` so pnpm keeps both Linux x64 and Darwin ARM64 optional native packages available.

This matters because the project now needs to work in both contexts:

```text
Linux x64 = Replit/Hostinger-like environment
Darwin ARM64 = Michael’s Apple Silicon Mac local preview
```

Local resume preview was confirmed working after these fixes:

```bash
rm -rf node_modules
pnpm install
pnpm --filter ./artifacts/resume run dev
```

The resume opened successfully at:

```text
http://localhost:3000/
```

---

## Common commands

### Check current folder

```bash
pwd
```

### Install dependencies

```bash
pnpm install
```

### Run resume locally

```bash
pnpm --filter ./artifacts/resume run dev
```

Open:

```text
http://localhost:3000/
```

### Build resume for Hostinger

```bash
pnpm --filter ./artifacts/resume run build:hostinger
```

Upload contents of:

```text
artifacts/resume/dist/public/
```

to:

```text
/domains/sashamilshtein.com/public_html/
```

### Run PHP pages locally

```bash
php -S localhost:8000
```

Open:

```text
http://localhost:8000/static-pages/greece2026/
http://localhost:8000/static-pages/visa/
```

### Stop any local server

```text
Control + C
```

---

## Troubleshooting

### Local resume server does not show updated content

Check that the source change is saved.

Restart the dev server if needed.

Use browser hard refresh.

### Live resume does not show updated content after upload

Check these in order:

1. Did the change appear on localhost?
2. Did `build:hostinger` run successfully?
3. Did the built output contain the change?
4. Did you upload the contents of `artifacts/resume/dist/public/`, not `dist/` and not the ZIP?
5. Did you upload into `/domains/sashamilshtein.com/public_html/`?
6. Did you refresh the live site with a query string such as `?v=test2`?

### Build output confusion

For the resume, `dist/` contains a `public/` folder and a ZIP.

Correct upload source:

```text
artifacts/resume/dist/public/
```

Incorrect upload source:

```text
artifacts/resume/dist/
```

Incorrect by itself:

```text
resume-hostinger.zip
```

### Terminal says localhost stopped or command failed with SIGINT

If this happens after pressing `Control + C`, it is normal. It means the local server was stopped manually.

### Hidden files in Finder

Show/hide hidden files:

```text
Command + Shift + .
```

### FTP secrets

Do not paste secrets into ChatGPT or Codex.

Hostinger FTP values that were preserved outside Replit:

```text
FTP_SERVER
FTP_USERNAME
FTP_PASSWORD
```

Other Replit secrets seen and saved/considered:

```text
GITHUB_PAT
SESSION_SECRET
```

Replit is no longer the only place holding deployment credentials.

---

## Technology summary

### PHP pages

Greece and Visa are PHP/static pages. They run directly on Hostinger and can be previewed with PHP’s built-in local server.

### React resume

Sasha’s resume is a React/Vite app. It needs local dev preview and a build step before deployment.

### Vite

Vite is the dev/build tool used by the resume app and also by Michael’s separate Trivia project. Vite is not the same thing as React; React is the UI framework, Vite is the build/dev server tool.

---

## Recommendation going forward

Do not refactor the site just to make all technologies consistent.

The better strategy is to keep each part in the technology that currently fits:

```text
Visa/Greece = PHP because they need simple server-side behavior/password protection and already work on Hostinger.
Sasha resume = React/Vite because it is a polished interactive app and now has local preview/build/deploy working.
Trivia = separate Vite/Supabase learning app and should remain separate.
```

Consistency should come from documentation and workflow discipline, not unnecessary refactoring.

---

## Current final status

As of this guide:

```text
GitHub source control works.
Codex can work on the repo.
Local repo exists on Michael’s Mac.
GitHub Desktop works.
VS Code works as editor.
FileZilla works for Hostinger deployment.
Sasha resume local preview works at localhost:3000.
Greece/Visa PHP local preview works at localhost:8000 after installing PHP.
Sasha resume deployment requires uploading artifacts/resume/dist/public contents to Hostinger public_html.
Replit is no longer required for sashamilshtein.com.
```

---

## Suggested future improvement

Add this guide to the repo as:

```text
SASHAMILSHTEIN_SITE_GUIDE.md
```

or:

```text
LOCAL_DEVELOPMENT_GUIDE.md
```

If adding to the repo, consider also adding a short README section linking to it.

Potential future automation:

- Create a safer deploy script for the resume.
- Create a one-command build/deploy checklist.
- Possibly create GitHub Actions deployment later using GitHub Secrets, but do not start there unless Michael explicitly wants automation.

For now, manual FileZilla deployment is acceptable because it has been proven to work and keeps the workflow understandable.

