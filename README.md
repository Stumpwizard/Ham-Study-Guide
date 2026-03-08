# Stumpwizards Ham Study Guide

## Live App

Open the study guide in your browser here:

[https://stumpwizard.github.io/Ham-Study-Guide/](https://stumpwizard.github.io/Ham-Study-Guide/)

This project contains the ham radio operator study guide deliverables for Windows and browser use.

## Files

- `study-guide.html`: self-contained browser version for Windows, macOS, and mobile browsers
- `ham-radio-study-guide.md`: Markdown study guide source
- `Stumpwizards Ham Study Guide.exe`: Windows desktop build
- `HamRadioStudyGuideApp.cs`: WinForms source for the Windows build

## Browser Use

Use the live GitHub Pages app at [https://stumpwizard.github.io/Ham-Study-Guide/](https://stumpwizard.github.io/Ham-Study-Guide/) or open `study-guide.html` in a modern browser locally. It includes the study content, an Ohm's Law graphic, calculator, and randomized 20-question exams drawn from a 100-question bank.

## GitHub Pages

GitHub Actions deploys the browser version to GitHub Pages from `study-guide.html`.

After pushing this repository to GitHub:

1. Push to `main` or `master`.
2. In the GitHub repository settings, set Pages to use `GitHub Actions` as the source.
3. The workflow publishes the site with `study-guide.html` served as the Pages `index.html`.

## Windows App

Launch `Stumpwizards Ham Study Guide.exe` on Windows.
