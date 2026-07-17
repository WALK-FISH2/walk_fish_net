export interface ArticleSummary {
  kind: "article";
  slug: string;
  title: string;
  description: string;
  publishDate: string;
  updatedDate?: string;
  featured: boolean;
  tags: string[];
  readingTime: number;
}

export interface ProjectSummary {
  kind: "project";
  slug: string;
  title: string;
  description: string;
  summary: string;
  status: string;
  startDate: string;
  endDate?: string;
  featured: boolean;
  order: number;
  stack: string[];
  tags: string[];
  demoUrl?: string;
  sourceUrl?: string;
}
