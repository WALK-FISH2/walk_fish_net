import Link from "next/link";
import type { Article, Project } from "../lib/content";

function formatDate(value: string) {
  if (!value) return "时间未定";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: value.length > 7 ? "numeric" : undefined,
  }).format(new Date(value.length === 7 ? `${value}-01` : value));
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="content-card article-card">
      <div className="card-kicker">
        <span>{article.featured ? "精选记录" : "旅行日志"}</span>
        <time dateTime={article.publishDate}>{formatDate(article.publishDate)}</time>
      </div>
      <h2>
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h2>
      <p>{article.description}</p>
      <div className="tag-row">
        {article.tags.map((tag) => <span key={tag}>#{tag}</span>)}
      </div>
      <div className="card-footer">
        <span>{article.readingTime} 分钟阅读</span>
        <Link className="arrow-link" href={`/articles/${article.slug}`}>打开记录 <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="content-card project-card">
      <div className="project-cover" aria-hidden="true">
        <span className="project-cover__orb" />
        <span className="project-cover__grid" />
      </div>
      <div className="card-kicker">
        <span>{project.status}</span>
        <span>{project.startDate}</span>
      </div>
      <h2>
        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
      </h2>
      <p>{project.summary}</p>
      <div className="tag-row">
        {project.stack.map((item) => <span key={item}>{item}</span>)}
      </div>
      <div className="card-footer">
        <span>{project.featured ? "FEATURED" : "ARCHIVE"}</span>
        <Link className="arrow-link" href={`/projects/${project.slug}`}>查看档案 <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}
