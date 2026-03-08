# Stumpwizards Ham Study Guide

This repository contains the browser-based ham radio study guide deployed to GitHub Pages and the Windows desktop build.

## Live App

[https://stumpwizard.github.io/Ham-Study-Guide/](https://stumpwizard.github.io/Ham-Study-Guide/)

## Browser App

- Source HTML lives in `site/index.html`
- Source image assets live in `site/`
- Source styles live in `site/src/ham-study.css`
- Source browser logic lives in `site/src/ham-study-app.js`
- Study questions and exam metadata live in `site/content/question-bank.json`
- Generated deploy output is written to `public/` and is not tracked in git

## Local Build

```bash
npm ci
npm run build
```

Open `public/index.html` in a modern browser after building. The app includes the study guide content, the Ohm's Law graphic and calculator, and randomized 20-question exams drawn from the original 112-question bank.

## GitHub Pages

GitHub Actions builds the site from `site/` and uploads `public/` to Pages.

After pushing this repository to GitHub:

1. Push to `main` or `master`.
2. In the GitHub repository settings, set Pages to use `GitHub Actions` as the source.
3. The deploy workflow runs `npm ci`, `npm run build`, and publishes `public/index.html` as the Pages entrypoint.

## Windows App

- `Stumpwizards Ham Study Guide.exe`: Windows desktop build
- `HamRadioStudyGuideApp.cs`: WinForms source
