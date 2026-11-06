import assert from "node:assert/strict";
import { PAGE_REDIRECTS, publicPath } from "../src/lib/publicPaths.js";
import { getInternalHref } from "../src/linkUtils.js";

const base = process.argv[2] || "http://localhost:3023";
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const home = await (await fetch(base)).text();

for (const [oldPath, newPath] of Object.entries(PAGE_REDIRECTS)) {
  for (const input of [oldPath, `${oldPath}/`, `https://pattoocastle.com${oldPath}/`]) {
    assert.equal(getInternalHref(input), newPath);
  }
  assert.equal(publicPath(`${oldPath}/?source=menu#details`), `${newPath}?source=menu#details`);
  const redirect = await fetch(`${base}${oldPath}?source=menu`, { redirect: "manual" });
  assert.equal(redirect.status, 308, oldPath);
  const target = new URL(redirect.headers.get("location"), base);
  assert.equal(target.pathname, newPath);
  assert.equal(target.searchParams.get("source"), "menu");

  const response = await fetch(`${base}${newPath}`, { redirect: "manual" });
  assert.equal(response.status, 200, newPath);
  assert.equal(response.headers.get("x-robots-tag"), "index, follow", newPath);
  const html = await response.text();
  assert(html.includes(`rel="canonical" href="https://pattoocastle.com${newPath}"`), `Canonical: ${newPath}`);
  assert(sitemap.includes(`<loc>https://pattoocastle.com${newPath}</loc>`), `Sitemap: ${newPath}`);
  assert(!sitemap.includes(`https://pattoocastle.com${oldPath}`), `Old sitemap URL: ${oldPath}`);
  assert(![...home.matchAll(/href="([^"\s]+)"/g)].some((m) => m[1].split(/[?#]/)[0].replace(/\/$/, "").endsWith(oldPath)), `Old menu URL: ${oldPath}`);
  if (newPath === "/groups-events" || newPath === "/weddings") {
    assert(html.includes('name="eventType"'));
    assert(html.includes('name="event-inquiry"'));
    assert(!html.includes('name="contactEventType"'));
  }
  console.log(`PASS ${oldPath} -> ${newPath}`);
}

assert.equal((await fetch(`${base}/weddings`)).status, 200);
console.log("All migrations, SEO URLs and event enquiry fields passed.");
