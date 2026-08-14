import { readFileSync } from "node:fs";

const sitemap = readFileSync("src/app/sitemap.js", "utf8");
const contentful = readFileSync("src/lib/contentful.js", "utf8");

const requiredRoutes = [
  "/",
  "/accommodation/",
  "/overview/",
  "/overview/about-pattoo-castle/",
  "/overview/getting-here/",
  "/overview/pattoo-castle-location/",
  "/gallery/",
  "/explore-negril/",
  "/explore-negril/about-negril/",
  "/events/",
  "/stay/",
  "/contact/",
  "/privacy-policy/",
  "/terms-condition/",
];

const checks = [
  [sitemap.includes("SITE_URL"), "Sitemap must use the canonical SITE_URL."],
  [
    sitemap.includes("getEventDetailsEntries"),
    "Sitemap must include dynamic event detail entries.",
  ],
  [
    sitemap.includes("export default async function sitemap"),
    "Sitemap must use the Next.js metadata route export.",
  ],
  [
    sitemap.includes('dynamic = "force-dynamic"') ||
      sitemap.includes("dynamic = 'force-dynamic'"),
    "Sitemap must be dynamic because it reads no-store Contentful data.",
  ],
  [
    sitemap.includes("new URL(path, SITE_URL).toString()"),
    "Sitemap must build absolute URLs from paths.",
  ],
  [
    contentful.includes("export async function getEventDetailsEntries"),
    "Contentful helpers must export getEventDetailsEntries.",
  ],
  [
    contentful.includes("limit: 100"),
    "Event detail sitemap helper must request more than one entry.",
  ],
];

for (const route of requiredRoutes) {
  checks.push([
    sitemap.includes(`"${route}"`) || sitemap.includes(`'${route}'`),
    `Sitemap must include ${route}.`,
  ]);
}

const failures = checks
  .filter(([passes]) => !passes)
  .map(([, message]) => message);

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
