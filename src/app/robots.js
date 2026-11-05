import { SITE_URL } from "../lib/seo";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin$",
        "/admin/",
        "/api$",
        "/api/",
        "/netlify-forms.html",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
