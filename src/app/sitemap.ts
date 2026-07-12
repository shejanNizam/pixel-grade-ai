import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Served at /sitemap.xml. Add an entry here for each public marketing route.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/features", "/contact"];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
