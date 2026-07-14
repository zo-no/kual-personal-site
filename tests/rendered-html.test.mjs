import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the personal homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /把模糊问题/);
  assert.match(html, /最近文章/);
  assert.match(html, /href="\/about"/);
  assert.match(html, /href="\/blog"/);
  assert.match(html, /data-signal-canvas/);
  assert.match(html, /data-filter-announcement/);
  assert.match(html, /data-project-signal="ai-native"/);
  assert.match(html, /data-project-signal="personal-os"/);
  assert.match(html, /data-project-signal="research-writing"/);
  assert.match(html, /data-project-step="ai-native"/);
  assert.match(html, /data-section-link="writing"/);
  assert.match(html, /data-route="blog"/);
  assert.doesNotMatch(html, /id="exploring"/);
  assert.match(html, /href="\/#story-ai-native"/);
});

test("renders the about and blog routes", async () => {
  const [aboutResponse, blogResponse] = await Promise.all([render("/about"), render("/blog")]);
  assert.equal(aboutResponse.status, 200);
  assert.equal(blogResponse.status, 200);
  assert.match(await aboutResponse.text(), /完整的问题解决者/);
  assert.match(await blogResponse.text(), /让判断开始复利/);
});

test("renders both articles", async () => {
  const [knowledgeResponse, tasteResponse] = await Promise.all([
    render("/blog/agent-knowledge-base"),
    render("/blog/taste-in-ai-era"),
  ]);
  assert.equal(knowledgeResponse.status, 200);
  assert.equal(tasteResponse.status, 200);
  const [knowledgeHtml, tasteHtml] = await Promise.all([
    knowledgeResponse.text(),
    tasteResponse.text(),
  ]);
  assert.match(knowledgeHtml, /最小的 AI 应用/);
  assert.match(knowledgeHtml, /data-reading-progress/);
  assert.match(tasteHtml, /删除是一种责任/);
});
