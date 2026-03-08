import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteDir = path.join(rootDir, "site");
const publicDir = path.join(rootDir, "public");
const siteSrcDir = path.join(siteDir, "src");
const publicSrcDir = path.join(publicDir, "src");

const [htmlTemplate, css, js, questionBank] = await Promise.all([
  readFile(path.join(siteDir, "index.html"), "utf8"),
  readFile(path.join(siteSrcDir, "ham-study.css"), "utf8"),
  readFile(path.join(siteSrcDir, "ham-study-app.js"), "utf8"),
  readFile(path.join(siteDir, "content", "question-bank.json"), "utf8"),
]);

const renderedHtml = htmlTemplate.replace(
  "__QUESTION_BANK_DATA__",
  escapeInlineJson(questionBank.trim())
);

await rm(publicDir, { recursive: true, force: true });
await mkdir(publicSrcDir, { recursive: true });

await Promise.all([
  writeFile(path.join(publicDir, "index.html"), `${renderedHtml}\n`),
  writeFile(path.join(publicSrcDir, "ham-study.css"), css),
  writeFile(path.join(publicSrcDir, "ham-study-app.js"), js),
  writeFile(path.join(publicDir, ".nojekyll"), ""),
  copyFile(path.join(rootDir, "Stumpwizard.png"), path.join(publicDir, "Stumpwizard.png")),
]);

function escapeInlineJson(value) {
  return value
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
