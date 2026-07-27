export const SITE_URL = "https://pattoocastle.com";

const DEFAULT_TITLE = "Pattoo Castle Jamaica";
const DEFAULT_DESCRIPTION =
  "Discover Pattoo Castle, a private luxury villa in Negril, Jamaica with ocean views, refined stays, events, and Caribbean hospitality.";

const PAGE_METADATA = {
  "/": {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  "/about/": {
    title: "About",
    description:
      "Learn about Pattoo Castle, a private oceanfront villa in Negril designed for secluded luxury, family gatherings, and Caribbean living.",
  },
  "/accommodation/": {
    title: "Accommodation",
    description:
      "Explore Pattoo Castle accommodations, villa inclusions, room details, outdoor spaces, dining options, and staffed luxury amenities.",
  },
  "/overview/": {
    title: "Villa Overview",
    description:
      "View an overview of Pattoo Castle, including the villa, location, accommodations, events, and the Negril experience.",
  },
  "/gallery/": {
    title: "Gallery",
    description:
      "Browse the Pattoo Castle gallery for views of the villa, oceanfront spaces, accommodations, events, and Negril surroundings.",
  },
  "/location/": {
    title: "Explore Negril",
    description:
      "Explore Pattoo Castle's Negril location near the Caribbean Sea, Seven Mile Beach, local restaurants, bars, and island experiences.",
  },
  "/events/": {
    title: "Events",
    description:
      "Host weddings, celebrations, retreats, and private events at Pattoo Castle, an oceanfront villa setting in Negril, Jamaica.",
  },
  "/stay/": {
    title: "Reserve Your Stay",
    description:
      "Plan your stay at Pattoo Castle with villa booking details, inquiry options, guest information, and luxury Negril experiences.",
  },
  "/contact/": {
    title: "Contact",
    description:
      "Contact Pattoo Castle to plan a villa stay, event, celebration, or private getaway in Negril, Jamaica.",
  },
  "/privacy-policy/": {
    title: "Privacy Policy",
    description:
      "Read the Pattoo Castle privacy policy for information about data collection, use, and privacy practices.",
  },
  "/terms-condition/": {
    title: "Terms and Conditions",
    description:
      "Read the Pattoo Castle terms and conditions for website, booking, and guest information.",
  },
};

export function createMetadata(path, overrides = {}) {
  const page = PAGE_METADATA[path] || PAGE_METADATA["/"];
  const title = overrides.title || page.title;
  const description = overrides.description || page.description;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Pattoo Castle",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
