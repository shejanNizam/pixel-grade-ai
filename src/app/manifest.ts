import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Served at /manifest.webmanifest — makes the app installable (PWA-ready).
// Drop icon files into /public and update the `icons` array below.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#12203b",
    icons: [
      {
        src: "/assets/main_logo.png",
        sizes: "260x260",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
