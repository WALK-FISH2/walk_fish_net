import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    summary: z.string(),
    status: z.string().default("进行中"),
    startDate: z.coerce.string(),
    endDate: z.coerce.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    stack: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    demoUrl: z.string().optional(),
    sourceUrl: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles, projects };
