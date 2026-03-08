import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteDir = path.join(rootDir, "site");
const publicDir = path.join(rootDir, "public");
const siteContentDir = path.join(siteDir, "content");
const siteSrcDir = path.join(siteDir, "src");
const publicContentDir = path.join(publicDir, "content");
const publicSrcDir = path.join(publicDir, "src");

const [htmlTemplate, css, js, questionBank] = await Promise.all([
  readFile(path.join(siteDir, "index.html"), "utf8"),
  readFile(path.join(siteSrcDir, "ham-study.css"), "utf8"),
  readFile(path.join(siteSrcDir, "ham-study-app.js"), "utf8"),
  readFile(path.join(siteContentDir, "question-bank.json"), "utf8"),
]);

const renderedHtml = htmlTemplate
  .replaceAll("../Stumpwizard.png", "./Stumpwizard.png")
  .replace(
    '<script defer src="./src/ham-study-app.js"></script>',
    `    <script id="study-data" type="application/json">${escapeInlineJson(questionBank.trim())}</script>\n    <script defer src="./src/ham-study-app.js"></script>`
  );
const rootHtml = htmlTemplate
  .replace('<link rel="stylesheet" href="./src/ham-study.css" />', `    <style>\n${css.trim()}\n    </style>`)
  .replaceAll("../Stumpwizard.png", "./Stumpwizard.png")
  .replace(
    '<script defer src="./src/ham-study-app.js"></script>',
    `    <script id="study-data" type="application/json">${escapeInlineJson(questionBank.trim())}</script>\n    <script>\n${js.trim()}\n    </script>`
  );

await rm(publicDir, { recursive: true, force: true });
await Promise.all([
  mkdir(publicSrcDir, { recursive: true }),
  mkdir(publicContentDir, { recursive: true }),
]);

await Promise.all([
  writeFile(path.join(rootDir, "index.html"), `${rootHtml}\n`),
  writeFile(path.join(publicDir, "index.html"), `${renderedHtml}\n`),
  writeFile(path.join(publicSrcDir, "ham-study.css"), css),
  writeFile(path.join(publicSrcDir, "ham-study-app.js"), js),
  copyFile(path.join(siteContentDir, "question-bank.json"), path.join(publicContentDir, "question-bank.json")),
  writeFile(path.join(publicDir, ".nojekyll"), ""),
  copyFile(path.join(rootDir, "Stumpwizard.png"), path.join(publicDir, "Stumpwizard.png")),
]);

function escapeInlineJson(value) {
  return value
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
