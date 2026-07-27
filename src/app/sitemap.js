import { getEventDetailsEntries } from "../lib/contentful";
import { SITE_URL } from "../lib/seo";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "/",
  "/about/",
  "/accommodation/",
  "/overview/",
  "/gallery/",
  "/location/",
  "/events/",
  "/stay/",
  "/contact/",
  "/privacy-policy/",
  "/terms-condition/",
];

function createSitemapEntry(path) {
  return {
    url: new URL(path, SITE_URL).toString(),
  };
}

function getEventDetailPath(entry) {
  const slug = entry?.fields?.eventSlug;

  return slug ? `/events/${slug}/` : "";
}

export default async function sitemap() {
  const eventEntries = await getEventDetailsEntries();
  const eventPaths = eventEntries.map(getEventDetailPath).filter(Boolean);
  const paths = [...new Set([...STATIC_PATHS, ...eventPaths])];

  return paths.map(createSitemapEntry);
}
