# Stumpwizards Ham Study Guide

This repository contains the browser-based ham radio study guide deployed to GitHub Pages and the Windows desktop build.

## Live App

[https://stumpwizard.github.io/Ham-Study-Guide/](https://stumpwizard.github.io/Ham-Study-Guide/)

## Browser App

- App entry HTML lives at `index.html`
- Custom Pages 404 lives at `404.html`
- Styles live in `src/ham-study.css`
- Browser logic lives in `src/ham-study-app.js`
- Study questions and exam metadata live in `content/question-bank.json`
- Image assets live at the repository root

Open `index.html` from the repo root through GitHub Pages or any static file server. The app includes the study guide content, the Ohm's Law graphic and calculator, and randomized 20-question exams drawn from the original 112-question bank.

## GitHub Pages

The app now lives directly at the repository root. GitHub Pages can serve it from the branch root or from the GitHub Actions Pages artifact without any build step.

After pushing this repository to GitHub:

1. Push to `main` or `master`.
2. Ensure Pages is serving the repository root app, either by `Deploy from a branch` at the root or by using the included no-build Pages workflow.
3. The top-level `index.html` is the Pages entrypoint.

## Windows App

- `Stumpwizards Ham Study Guide.exe`: Windows desktop build
- `HamRadioStudyGuideApp.cs`: WinForms source
