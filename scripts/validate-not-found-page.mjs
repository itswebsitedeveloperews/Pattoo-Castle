import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const failures = [];

function read(relativePath) {
  return readFileSync(fileURLToPath(new URL(relativePath, root)), "utf8");
}

function exists(relativePath) {
  return existsSync(fileURLToPath(new URL(relativePath, root)));
}

if (!exists("src/app/not-found.jsx")) {
  failures.push("Next not-found route must exist at src/app/not-found.jsx.");
}

if (!exists("src/NotFoundPage.jsx")) {
  failures.push("Reusable 404 page component must exist at src/NotFoundPage.jsx.");
}

const route = exists("src/app/not-found.jsx") ? read("src/app/not-found.jsx") : "";
const page = exists("src/NotFoundPage.jsx") ? read("src/NotFoundPage.jsx") : "";
const css = read("src/App.css");

if (!route.includes("metadata")) {
  failures.push("404 route must export metadata.");
}

if (!route.includes("title: 'Page Not Found'")) {
  failures.push("404 route title must use the root title template.");
}

if (!route.includes("export const dynamic = 'force-dynamic'")) {
  failures.push("404 route must explicitly render dynamically.");
}

if (!route.includes("export const revalidate = 0")) {
  failures.push("404 route must disable static revalidation.");
}

if (!route.includes("robots: { index: false, follow: false }")) {
  failures.push("404 route must be noindex/nofollow.");
}

if (!route.includes("alternates") || !route.includes("canonical: '/404/'")) {
  failures.push("404 route must set a canonical URL.");
}

if (!route.includes("getHeaderEntry") || !route.includes("getFooterEntry")) {
  failures.push("404 route must load shared header and footer content.");
}

if (!page.includes("SiteHeader") || !page.includes("SiteFooter")) {
  failures.push("404 page must render the shared header and footer.");
}

if (!page.includes('className="section page-hero not-found-hero"')) {
  failures.push("404 page must use the existing page hero design language.");
}

if (!page.includes('href="/"') || !page.includes('href="/contact/"')) {
  failures.push("404 page must include Home and Contact actions.");
}

if (!css.includes(".not-found-hero") || !css.includes(".not-found-actions")) {
  failures.push("404 page styles must be defined.");
}

if (!css.includes(".not-found-code")) {
  failures.push("404 page must style the 404 code responsively.");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
