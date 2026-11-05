import { PAGE_REDIRECTS } from "./src/lib/publicPaths.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deliver the existing styles with the first response, avoiding a blocking
  // stylesheet round trip. Next retains stylesheet loading for navigation.
  experimental: { inlineCss: true },
  async redirects() {
    return Object.entries(PAGE_REDIRECTS).map(([source, destination]) => ({
      source, destination, permanent: true,
    }));
  },
  async headers() {
    // Preserve Netlify's indexing restrictions on preview and branch deploys.
    if (process.env.CONTEXT && process.env.CONTEXT !== "production") return [];

    const publicPages = [
      "/",
      "/accommodation",
      "/outdoors",
      "/food-and-beverage",
      "/staff",
      "/villa-details",
      "/villa-inclusion",
      "/overview",
      "/about-pattoo-castle",
      "/getting-here",
      "/pattoo-castle-location",
      "/gallery",
      "/explore-negril",
      "/about-negril",
      "/optional-tours-activities",
      "/events",
      "/events/:slug",
      "/groups-events",
      "/stay",
      "/contact-us",
      "/privacy-policy",
      "/terms-condition",
    ];

    return publicPages.map((source) => ({
      source,
      // Search indexing directives belong on document responses, not the
      // background React Server Component and prefetch responses used by Link.
      missing: [
        { type: "header", key: "rsc" },
        { type: "header", key: "next-router-prefetch" },
      ],
      headers: [{ key: "X-Robots-Tag", value: "index, follow" }],
    }));
  },
};

export default nextConfig;
