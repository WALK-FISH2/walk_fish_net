import type { CollectionEntry } from "astro:content";
import type { ArticleSummary, ProjectSummary } from "../types/content";

export function entrySlug(entry: CollectionEntry<"articles"> | CollectionEntry<"projects">) {
  const explicit = "slug" in entry.data ? entry.data.slug : undefined;
  return explicit || entry.id.replace(/\.(md|mdx)$/i, "");
}

export function articleSummary(entry: CollectionEntry<"articles">): ArticleSummary {
  return {
    kind: "article",
    slug: entrySlug(entry),
    title: entry.data.title,
    description: entry.data.description,
    publishDate: entry.data.publishDate.toISOString().slice(0, 10),
    updatedDate: entry.data.updatedDate?.toISOString().slice(0, 10),
    featured: entry.data.featured,
    tags: entry.data.tags,
    readingTime: Math.max(1, Math.ceil((entry.body ?? "").replace(/\s/g, "").length / 500)),
  };
}

export function projectSummary(entry: CollectionEntry<"projects">): ProjectSummary {
  return {
    kind: "project",
    slug: entrySlug(entry),
    title: entry.data.title,
    description: entry.data.summary,
    summary: entry.data.summary,
    status: entry.data.status,
    startDate: entry.data.startDate,
    endDate: entry.data.endDate,
    featured: entry.data.featured,
    order: entry.data.order,
    stack: entry.data.stack,
    tags: entry.data.tags,
    demoUrl: entry.data.demoUrl || undefined,
    sourceUrl: entry.data.sourceUrl || undefined,
  };
}

export function sortArticles(entries: CollectionEntry<"articles">[]) {
  return entries.sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return b.data.publishDate.getTime() - a.data.publishDate.getTime();
  });
}

export function sortProjects(entries: CollectionEntry<"projects">[]) {
  return entries.sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return a.data.order - b.data.order;
  });
}
