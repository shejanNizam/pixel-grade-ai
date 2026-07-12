import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Served at /robots.txt. Update `siteConfig.url` for your deployment.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep authenticated areas out of search indexes.
      disallow: ["/user-dashboard", "/admin"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
