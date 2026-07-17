import { marked } from "marked";

export type ContentKind = "article" | "project";

export interface TocItem {
  depth: 2 | 3;
  id: string;
  text: string;
}

interface BaseContent {
  slug: string;
  title: string;
  description: string;
  featured: boolean;
  draft: boolean;
  order: number;
  tags: string[];
  body: string;
  html: string;
  toc: TocItem[];
}

export interface Article extends BaseContent {
  kind: "article";
  publishDate: string;
  updatedDate?: string;
  readingTime: number;
}

export interface Project extends BaseContent {
  kind: "project";
  summary: string;
  status: string;
  startDate: string;
  endDate?: string;
  stack: string[];
  demoUrl?: string;
  sourceUrl?: string;
}

export type ContentItem = Article | Project;

const articleSources = import.meta.glob("../content/articles/*.{md,mdx}", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const projectSources = import.meta.glob("../content/projects/*.{md,mdx}", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function parseScalar(value: string): string | boolean | number {
  const trimmed = value.trim().replace(/^['"]|['"]$/g, "");
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

function parseFrontmatter(source: string) {
  if (!source.startsWith("---")) return { data: {}, body: source };
  const end = source.indexOf("\n---", 3);
  if (end === -1) return { data: {}, body: source };

  const raw = source.slice(4, end).trim();
  const body = source.slice(end + 4).trim();
  const data: Record<string, string | number | boolean | string[]> = {};
  let activeList: string | null = null;

  for (const line of raw.split(/\r?\n/)) {
    const listItem = line.match(/^\s*-\s+(.+)$/);
    if (listItem && activeList) {
      const list = data[activeList];
      if (Array.isArray(list)) list.push(String(parseScalar(listItem[1])));
      continue;
    }

    const entry = line.match(/^([\w-]+):\s*(.*)$/);
    if (!entry) continue;
    const [, key, rawValue] = entry;
    if (!rawValue.trim()) {
      data[key] = [];
      activeList = key;
      continue;
    }
    activeList = null;
    data[key] = parseScalar(rawValue);
  }

  return { data, body };
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
}

function renderMarkdown(body: string) {
  const toc: TocItem[] = [];
  const rawHtml = marked.parse(body, { gfm: true, breaks: false }) as string;
  const html = rawHtml.replace(
    /<h([23])>(.*?)<\/h\1>/g,
    (_match, depthValue: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "");
      const id = slugifyHeading(text);
      toc.push({ depth: Number(depthValue) as 2 | 3, id, text });
      return `<h${depthValue} id="${id}">${inner}</h${depthValue}>`;
    },
  );
  return { html, toc };
}

function fileSlug(path: string) {
  return path.split("/").pop()?.replace(/\.(md|mdx)$/, "") ?? "untitled";
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function booleanValue(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function numberValue(value: unknown, fallback = 0) {
  return typeof value === "number" ? value : fallback;
}

function parseArticle(path: string, source: string): Article {
  const { data, body } = parseFrontmatter(source);
  const { html, toc } = renderMarkdown(body);
  return {
    kind: "article",
    slug: stringValue(data.slug, fileSlug(path)),
    title: stringValue(data.title, "未命名文章"),
    description: stringValue(data.description, ""),
    publishDate: stringValue(data.publishDate),
    updatedDate: stringValue(data.updatedDate) || undefined,
    featured: booleanValue(data.featured),
    draft: booleanValue(data.draft),
    order: numberValue(data.order),
    tags: stringArray(data.tags),
    body,
    html,
    toc,
    readingTime: Math.max(1, Math.ceil(body.replace(/\s/g, "").length / 500)),
  };
}

function parseProject(path: string, source: string): Project {
  const { data, body } = parseFrontmatter(source);
  const { html, toc } = renderMarkdown(body);
  const summary = stringValue(data.summary, stringValue(data.description));
  return {
    kind: "project",
    slug: stringValue(data.slug, fileSlug(path)),
    title: stringValue(data.title, "未命名项目"),
    description: summary,
    summary,
    status: stringValue(data.status, "进行中"),
    startDate: stringValue(data.startDate),
    endDate: stringValue(data.endDate) || undefined,
    stack: stringArray(data.stack),
    demoUrl: stringValue(data.demoUrl) || undefined,
    sourceUrl: stringValue(data.sourceUrl) || undefined,
    featured: booleanValue(data.featured),
    draft: booleanValue(data.draft),
    order: numberValue(data.order),
    tags: stringArray(data.tags),
    body,
    html,
    toc,
  };
}

const includeDrafts = process.env.NODE_ENV !== "production";

export function getArticles(): Article[] {
  return Object.entries(articleSources)
    .map(([path, source]) => parseArticle(path, source))
    .filter((item) => includeDrafts || !item.draft)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.publishDate.localeCompare(a.publishDate);
    });
}

export function getProjects(): Project[] {
  return Object.entries(projectSources)
    .map(([path, source]) => parseProject(path, source))
    .filter((item) => includeDrafts || !item.draft)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.order - b.order;
    });
}

export function getArticle(slug: string) {
  return getArticles().find((article) => article.slug === slug);
}

export function getProject(slug: string) {
  return getProjects().find((project) => project.slug === slug);
}
