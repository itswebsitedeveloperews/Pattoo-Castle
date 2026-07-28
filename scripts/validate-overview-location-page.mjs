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

const page = readRequired("src/OverviewLocationPage.jsx");
const route = readRequired("src/app/overview/pattoo-castle-location/page.jsx");
const contentful = readRequired("src/lib/contentful.js");
const seo = readRequired("src/lib/seo.js");
const sitemap = readRequired("src/app/sitemap.js");
const css = readRequired("src/App.css");

if (!page.includes("getOverviewLocationContent")) {
  failures.push("Overview location page must normalize its Contentful fields.");
}

for (const expected of [
  "fields.title",
  "fields.bannerImage",
  "fields.location",
  "fields.directionsButton",
  "fields.directionsButtonLink",
  "fields.locationContent",
  "fields.ctaImage",
  "fields.ctaSubHeading",
  "fields.ctaHeading",
  "fields.ctaContent",
  "fields.ctaButtonText",
  "fields.ctaButtonUrl",
]) {
  if (!page.includes(expected)) {
    failures.push(`Overview location page must consume ${expected}.`);
  }
}

if (!page.includes("parseMapIframe")) {
  failures.push("Overview location page must parse the iframe map field.");
}

if (!page.includes("<iframe")) {
  failures.push("Overview location page must render the map iframe.");
}

if (!page.includes("locationContent: richTextToReact")) {
  failures.push("Overview location content must render rich text.");
}

if (!page.includes("hasCtaSection")) {
  failures.push("Overview location page must gate the CTA section.");
}

if (!page.includes("className=\"section stay-cta-section\"")) {
  failures.push("Overview location page must render the stay CTA section style.");
}

if (!page.includes("ctaContent: richTextToReact")) {
  failures.push("Overview location CTA content must render rich text.");
}

for (const forbidden of ["stay.", "stpageay", "renderRichText"]) {
  if (page.includes(forbidden)) {
    failures.push(
      `Overview location page must not include stray Stay CTA reference: ${forbidden}`,
    );
  }
}

if (!route.includes("getOverviewLocationEntry")) {
  failures.push("Nested route must fetch the overview location entry.");
}

if (!route.includes('createMetadata("/overview/pattoo-castle-location/")')) {
  failures.push("Nested route must set canonical metadata for its slug.");
}

if (!contentful.includes("overviewLocationContentType")) {
  failures.push("Contentful config must expose an overview location content type.");
}

if (!contentful.includes("getOverviewLocationEntry")) {
  failures.push("Contentful helper must export getOverviewLocationEntry.");
}

if (!seo.includes('"/overview/pattoo-castle-location/"')) {
  failures.push("SEO metadata must include the overview location route.");
}

if (!sitemap.includes('"/overview/pattoo-castle-location/"')) {
  failures.push("Sitemap must include the overview location route.");
}

if (!/\.overview-location-map-frame\s+iframe\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9\s*;/s.test(css)) {
  failures.push("Overview location map iframe must have a stable 16:9 frame.");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
