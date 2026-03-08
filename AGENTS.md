# AGENTS.md

## Purpose

This repository contains the Stumpwizards Ham Study Guide browser app and related assets. Treat the browser app as the primary maintained product unless the user explicitly asks for Windows app work.

## Source Of Truth

- Browser app entry HTML: `index.html`
- Browser app 404 page: `404.html`
- Browser app CSS: `src/ham-study.css`
- Browser app JS: `src/ham-study-app.js`
- Browser app data: `content/question-bank.json`
- Browser image assets: repo root image files such as `Stumpwizard.png` and `Wizard Logo.png`

## Layout

- The repo root is the app.
- There is no build step.
- Do not reintroduce `site/`, `public/`, or generated deploy copies unless the user explicitly asks for them.

## App Behavior To Preserve

- Keep all 112 original questions.
- The study guide and interactive Q&A app are the deployable product.
- The Ohm’s Law calculator belongs directly below the Ohm’s Law graphic.
- `404.html` is intentionally a custom error page, not a copy of the main app.
- The 404 page should show the Stumpwizard image, say `Something mysterious happened`, and link back to the app index page.

## Working Rules

- Prefer editing the root app files directly.
- If you change question content or exam metadata, update only `content/question-bank.json`.
- Do not move app content into `README.md`.
- Do not add duplicate JS variants, alternate HTML entrypoints, or a new build pipeline unless the user explicitly requests them.

## GitHub Pages Contract

- The repository root should be directly serveable by GitHub Pages.
- If the workflow is used, it should upload the repo as-is without a build step.
- Keep root `.nojekyll` tracked so branch-based Pages serves static files directly.

## Verification

After relevant changes, verify at minimum:

- `index.html` exists at the repo root
- `404.html` exists at the repo root
- `src/ham-study-app.js` exists
- `src/ham-study.css` exists
- `content/question-bank.json` exists
- `Stumpwizard.png` exists
- `Wizard Logo.png` exists

## Notes

- `README.md` is repository documentation only.
- If the user asks about the live Pages site, remember that GitHub Pages behavior can lag until the latest push or Pages deployment finishes.
