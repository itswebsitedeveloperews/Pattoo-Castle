import { getEventDetailsEntries } from "../lib/contentful";
import { SITE_URL } from "../lib/seo";
import { publicPath } from "../lib/publicPaths";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "/",
  "/accommodation/",
  "/villa-inclusion",
  "/outdoors/",
  "/food-and-beverage/",
  "/staff/",
  "/villa-details/",
  "/overview/",
  "/about-pattoo-castle",
  "/overview/getting-here/",
  "/pattoo-castle-location/",
  "/gallery/",
  "/explore-negril/",
  "/about-negril/",
  "/optional-tours-activities/",
  "/events/",
  "/stay/",
  "/contact-us/",
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
  const paths = [...new Set([...STATIC_PATHS, ...eventPaths].map(publicPath))];

  return paths.map(createSitemapEntry);
}
