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

const programs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/programs" }),
  schema: z.object({
    title: z.string(),
    slug: z.string().min(1),
    summary: z.string(),
    status: z.enum(["completed", "in-progress", "prototype", "archived"]),
    category: z.enum([
      "web-app",
      "desktop-app",
      "mini-program",
      "tool",
      "visualization",
      "automation",
      "game-prototype",
      "experiment",
      "other",
    ]),
    startDate: z.coerce.string().optional(),
    endDate: z.coerce.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    stack: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    demoType: z.enum([
      "static-embedded",
      "external-live",
      "video",
      "gif",
      "screenshots",
      "none",
    ]),
    demoUrl: z.string().optional(),
    sourceUrl: z.string().optional(),
    ownerContribution: z.array(z.string()).min(1),
    limitations: z.array(z.string()).default([]),
    privacy: z.object({
      storesData: z.enum(["none", "local-only", "external"]),
      sendsDataExternally: z.boolean(),
      externalServices: z.array(z.string()).default([]),
    }),
    whatItIs: z.string(),
    whyBuilt: z.string(),
    coreFeatures: z.array(z.string()).min(1),
    technicalApproach: z.array(z.string()).min(1),
    demoDescription: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles, programs };
