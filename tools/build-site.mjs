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

const renderedHtml = htmlTemplate.replace(
  '<script defer src="./src/ham-study-app.js"></script>',
  `    <script id="study-data" type="application/json">${escapeInlineJson(questionBank.trim())}</script>\n    <script defer src="./src/ham-study-app.js"></script>`
);
const notFoundHtml = renderNotFoundHtml();

await rm(publicDir, { recursive: true, force: true });
await Promise.all([
  mkdir(publicSrcDir, { recursive: true }),
  mkdir(publicContentDir, { recursive: true }),
]);

await Promise.all([
  writeFile(path.join(publicDir, "index.html"), `${renderedHtml}\n`),
  writeFile(path.join(publicDir, "404.html"), `${notFoundHtml}\n`),
  writeFile(path.join(publicSrcDir, "ham-study.css"), css),
  writeFile(path.join(publicSrcDir, "ham-study-app.js"), js),
  copyFile(path.join(siteContentDir, "question-bank.json"), path.join(publicContentDir, "question-bank.json")),
  writeFile(path.join(publicDir, ".nojekyll"), ""),
  copyFile(path.join(siteDir, "Stumpwizard.png"), path.join(publicDir, "Stumpwizard.png")),
]);

function escapeInlineJson(value) {
  return value
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function renderNotFoundHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#155e63" />
    <title>Page Not Found | Stumpwizards Ham Study Guide</title>
    <style>
      :root {
        --canvas: #f3ecdf;
        --ink: #1f2a2e;
        --muted: #5b645f;
        --panel: rgba(255, 252, 245, 0.94);
        --accent: #155e63;
        --line: rgba(31, 42, 46, 0.12);
        font-family: Georgia, "Times New Roman", serif;
        color: var(--ink);
        background:
          radial-gradient(circle at top left, rgba(21, 94, 99, 0.16), transparent 28%),
          radial-gradient(circle at right, rgba(183, 111, 49, 0.16), transparent 24%),
          linear-gradient(180deg, #f8f3e9 0%, #efe4d1 100%);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
      }

      .not-found {
        width: min(560px, 100%);
        padding: 28px;
        border: 1px solid var(--line);
        border-radius: 24px;
        background: var(--panel);
        box-shadow: 0 18px 42px rgba(63, 44, 24, 0.08);
        text-align: center;
      }

      .not-found img {
        width: min(240px, 100%);
        height: auto;
        border-radius: 20px;
        border: 1px solid var(--line);
        box-shadow: 0 12px 24px rgba(63, 44, 24, 0.18);
      }

      .eyebrow {
        margin: 18px 0 10px;
        font-size: 0.74rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--accent);
      }

      h1 {
        margin: 0 0 12px;
        font-size: clamp(2rem, 7vw, 3.25rem);
        line-height: 1.02;
      }

      p {
        margin: 0;
        color: var(--muted);
        font-size: 1rem;
        line-height: 1.55;
      }

      .home-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-top: 22px;
        padding: 12px 18px;
        border-radius: 999px;
        background: var(--accent);
        color: #f9f8f3;
        font-weight: 700;
        text-decoration: none;
      }

      .home-link:hover,
      .home-link:focus-visible {
        filter: brightness(1.08);
      }
    </style>
  </head>
  <body>
    <main class="not-found">
      <img id="not-found-image" src="./Stumpwizard.png" alt="Stumpwizard portrait" />
      <p class="eyebrow">404</p>
      <h1>Something mysterious happened</h1>
      <p>The page you asked for could not be found.</p>
      <a id="home-link" class="home-link" href="./index.html">Back to the study guide</a>
    </main>
    <script>
      (() => {
        let basePath = "./";

        if (window.location.protocol.startsWith("http")) {
          if (window.location.hostname.endsWith("github.io")) {
            const [repoName] = window.location.pathname.split("/").filter(Boolean);
            basePath = repoName ? \`/\${repoName}/\` : "/";
          } else {
            basePath = "/";
          }
        }

        document.getElementById("not-found-image").src = \`\${basePath}Stumpwizard.png\`;
        document.getElementById("home-link").href = basePath;
      })();
    </script>
  </body>
</html>`;
}
