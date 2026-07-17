import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "./config/site.config";
import { getArticles, getProjects } from "./lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixedRoutes = ["", "/articles", "/projects", "/about"].map((path) => ({
    url: `${SITE_CONFIG.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" as const : "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const articles = getArticles().map((article) => ({
    url: `${SITE_CONFIG.url}/articles/${article.slug}`,
    lastModified: new Date(article.updatedDate ?? article.publishDate),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const projects = getProjects().map((project) => ({
    url: `${SITE_CONFIG.url}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...fixedRoutes, ...articles, ...projects];
}
