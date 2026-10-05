import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const failures = [];

function read(relativePath) {
  return readFileSync(fileURLToPath(new URL(relativePath, root)), "utf8");
}

function readRequired(relativePath) {
  const fullPath = fileURLToPath(new URL(relativePath, root));

  if (!existsSync(fullPath)) {
    failures.push(`${relativePath} is missing.`);
    return "";
  }

  return read(relativePath);
}

const page = readRequired("src/GettingHerePage.jsx");
const route = readRequired("src/app/overview/getting-here/page.jsx");
const contentful = readRequired("src/lib/contentful.js");
const seo = readRequired("src/lib/seo.js");
const sitemap = readRequired("src/app/sitemap.js");
const css = readRequired("src/App.css");

for (const expected of [
  "fields.bannerHeading",
  "fields.bannerImage",
  "fields.gettingHereContent",
]) {
  if (!page.includes(expected)) {
    failures.push(`Getting Here page must consume ${expected}.`);
  }
}

if (!page.includes("getGettingHereContent")) {
  failures.push("Getting Here page must normalize its Contentful fields.");
}

if (/fields\.(gettingHereSubHeading|gettingHereHeading|gettingHereImage|cta)|getting-here-detail-section|stay-cta-section/.test(page)) {
  failures.push("Getting Here page must not consume or render the removed detail and CTA fields.");
}

for (const forbidden of ["hasVillaSection", "overview.", "hasVillaButton"]) {
  if (page.includes(forbidden)) {
    failures.push(`Getting Here page must not include stray Overview reference: ${forbidden}`);
  }
}

if (!route.includes("getGettingHereEntry")) {
  failures.push("Getting Here route must fetch the gettingHere entry.");
}

if (!route.includes('createMetadata("/overview/getting-here/")')) {
  failures.push("Getting Here route must set canonical metadata for its slug.");
}

if (!contentful.includes("gettingHereContentType")) {
  failures.push("Contentful config must expose a gettingHere content type.");
}

if (!contentful.includes("getGettingHereEntry")) {
  failures.push("Contentful helper must export getGettingHereEntry.");
}

if (!seo.includes('"/overview/getting-here/"')) {
  failures.push("SEO metadata must include the Getting Here route.");
}

if (!sitemap.includes('"/overview/getting-here/"')) {
  failures.push("Sitemap must include the Getting Here route.");
}

if (!css.includes(".getting-here-hero")) {
  failures.push("Getting Here page must define hero background styling.");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
