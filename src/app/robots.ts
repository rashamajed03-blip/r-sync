import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/search", "/track"],
      disallow: [
        "/dashboard",
        "/crates",
        "/planner",
        "/profile",
        "/import",
        "/library",
        "/assistant",
        "/recommendations",
        "/api/",
      ],
    },
    sitemap: "https://rsync.app/sitemap.xml",
  };
}
