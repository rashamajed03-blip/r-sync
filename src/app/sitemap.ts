import type { MetadataRoute } from "next";
import { getAllTracks } from "@/lib/data/tracks";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://rsync.app";
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/search`, changeFrequency: "daily", priority: 0.8 },
  ];

  const tracks = await getAllTracks();
  const trackRoutes: MetadataRoute.Sitemap = tracks.map((t) => ({
    url: `${base}/track/${t.id}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...trackRoutes];
}
