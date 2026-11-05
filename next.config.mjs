/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deliver the existing styles with the first response, avoiding a blocking
  // stylesheet round trip. Next retains stylesheet loading for navigation.
  experimental: { inlineCss: true },
  async headers() {
    // Preserve Netlify's indexing restrictions on preview and branch deploys.
    if (process.env.CONTEXT && process.env.CONTEXT !== "production") return [];

    const publicPages = [
      "/",
      "/accommodation",
      "/accommodation/outdoors",
      "/accommodation/food-and-beverage",
      "/accommodation/staff",
      "/accommodation/villa-details",
      "/accommodation/villa-inclusion",
      "/overview",
      "/overview/about-pattoo-castle",
      "/overview/getting-here",
      "/overview/pattoo-castle-location",
      "/gallery",
      "/explore-negril",
      "/explore-negril/about-negril",
      "/explore-negril/optional-tours-activities",
      "/events",
      "/events/:slug",
      "/stay",
      "/contact-us",
      "/privacy-policy",
      "/terms-condition",
    ];

    return publicPages.map((source) => ({
      source,
      headers: [{ key: "X-Robots-Tag", value: "index, follow" }],
    }));
  },
};

export default nextConfig;
