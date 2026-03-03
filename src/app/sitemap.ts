import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://saju-myeongri.com";
const locales = ["ko", "en", "ja", "zh"];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/saju", "/today", "/compatibility", "/payment", "/login"];

  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "/today" ? ("daily" as const) : ("weekly" as const),
      priority: route === "" ? 1 : 0.8,
    }))
  );
}
