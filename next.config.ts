import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `output: "standalone"` would trim each release from ~400 MB of
  // node_modules to ~50 MB, which is worth having on the EC2 box.
  //
  // It is OFF because it breaks the build on Windows under Next 15.5: page-data
  // collection fails with `PageNotFoundError` on a DIFFERENT, arbitrary route
  // every run (and on `/_document`, which does not exist in an App Router
  // project at all). Nothing in this codebase is at fault — plain `next build`
  // succeeds, and the same config with this line removed succeeds.
  //
  // Turn it on in the Linux CI/deploy build only, once verified there. Do not
  // enable it here without re-testing: a config that cannot be built locally
  // means nobody validates what actually ships.

  images: {
    /**
     * Hosts `next/image` may load from. An unlisted host does not degrade
     * gracefully — it throws at request time — so every source that can appear
     * as a card image, avatar, or slab export has to be listed here.
     */
    remotePatterns: [
      {
        // Every uploaded scan, generated slab background, and export lives in
        // Cloudinary. This is the one that matters: it was missing through
        // prototype V1 (the config still pointed at an unrelated template
        // host), which breaks card art everywhere outside local dev.
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        // Avatars for accounts that signed in with Google.
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        // Catalogue artwork served by the identification provider's CDN.
        protocol: "https",
        hostname: "**.scrydex.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
