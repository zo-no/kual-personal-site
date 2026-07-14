import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const outputDir = resolve(projectRoot, "static");
const requestedBasePath = process.env.SITE_BASE_PATH?.trim() ?? "";
const basePath = requestedBasePath === "/"
  ? ""
  : requestedBasePath
      ? `/${requestedBasePath.replace(/^\/+|\/+$/g, "")}`
      : "";

const routes = [
  { source: "/", destination: "index.html" },
  { source: "/about", destination: "about/index.html" },
  { source: "/blog", destination: "blog/index.html" },
  { source: "/blog/agent-knowledge-base", destination: "blog/agent-knowledge-base/index.html" },
  { source: "/blog/taste-in-ai-era", destination: "blog/taste-in-ai-era/index.html" },
];

function publicPath(path = "") {
  const suffix = path.replace(/^\/+/, "");
  return `${basePath}/${suffix}`;
}

function rewriteAnchor(start, target) {
  if (target.startsWith("#")) return `${start}${publicPath(target)}`;
  if (!target) return `${start}${publicPath()}`;
  return `${start}${publicPath(`${target.replace(/\/$/, "")}/`)}`;
}

function prepareHtml(rawHtml) {
  return rawHtml
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<link\b[^>]*rel="modulepreload"[^>]*\/?>/gi, "")
    .replace(/<link\b[^>]*rel="preload"[^>]*as="font"[^>]*\/?>/gi, "")
    .replace(/<link\b[^>]*rel="stylesheet"[^>]*\/?>/gi, "")
    .replace(/<link\b[^>]*rel="icon"[^>]*\/?>/gi, "")
    .replace(/<style\b[^>]*data-vinext-fonts[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/(<a\b[^>]*\bhref=")\/([^"\s]*)"/gi, (_match, start, target) =>
      `${rewriteAnchor(start, target)}"`,
    )
    .replace(
      "</head>",
      `<link rel="stylesheet" href="${publicPath("style.css")}"/><link rel="icon" href="${publicPath("favicon.svg")}"/></head>`,
    )
    .replace(
      "</body>",
      `<script src="${publicPath("site-effects.js")}" defer></script></body>`,
    );
}

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("static-export", `${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const css = (await readFile(resolve(projectRoot, "app/globals.css"), "utf8"))
  .replace(/^@import\s+"tailwindcss";\s*/m, "");

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

for (const route of routes) {
  const response = await worker.fetch(
    new Request(`http://localhost${route.source}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  if (!response.ok) {
    throw new Error(`Static render failed for ${route.source} with ${response.status}`);
  }

  const destination = resolve(outputDir, route.destination);
  await mkdir(resolve(destination, ".."), { recursive: true });
  await writeFile(destination, prepareHtml(await response.text()), "utf8");
}

await writeFile(resolve(outputDir, "style.css"), css, "utf8");
await writeFile(resolve(outputDir, ".nojekyll"), "", "utf8");
await copyFile(resolve(projectRoot, "public/favicon.svg"), resolve(outputDir, "favicon.svg"));
await copyFile(resolve(projectRoot, "public/og.png"), resolve(outputDir, "og.png"));
await copyFile(resolve(projectRoot, "public/site-effects.js"), resolve(outputDir, "site-effects.js"));

console.log(`Static site exported to ${outputDir}`);
console.log(`Public base path: ${basePath || "/"}`);
