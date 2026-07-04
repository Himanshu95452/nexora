import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.nexora.example";
  const routes = ["", "/book", "/login/customer", "/login/professional", "/signup/customer", "/signup/professional"];
  return routes.map((r) => ({ url: `${base}${r}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: r === "" ? 1 : 0.6 }));
}
