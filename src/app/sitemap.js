import { getEventDetailsEntries } from "../lib/contentful";
import { SITE_URL } from "../lib/seo";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "/",
  "/accommodation/",
  "/accommodation/outdoors/",
  "/accommodation/food-and-beverage/",
  "/accommodation/staff/",
  "/accommodation/villa-details/",
  "/overview/",
  "/overview/about-pattoo-castle/",
  "/overview/getting-here/",
  "/overview/pattoo-castle-location/",
  "/gallery/",
  "/explore-negril/",
  "/explore-negril/about-negril/",
  "/explore-negril/optional-tours-activities/",
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
