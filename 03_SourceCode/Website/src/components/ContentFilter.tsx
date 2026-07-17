import { useMemo, useState } from "react";
import { sitePath } from "../config/site.config";
import type { ArticleSummary, ProjectSummary } from "../types/content";

type Props = { kind: "article"; items: ArticleSummary[] } | { kind: "project"; items: ProjectSummary[] };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "short", day: "numeric" }).format(new Date(value));
}

function ArticleCard({ item }: { item: ArticleSummary }) {
  return (
    <article className="content-card article-card">
      <div className="card-kicker"><span>{item.featured ? "精选记录" : "旅行日志"}</span><time dateTime={item.publishDate}>{formatDate(item.publishDate)}</time></div>
      <h2><a href={sitePath(`/articles/${item.slug}/`)}>{item.title}</a></h2>
      <p>{item.description}</p>
      <div className="tag-row">{item.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
      <div className="card-footer"><span>{item.readingTime} 分钟阅读</span><a className="arrow-link" href={sitePath(`/articles/${item.slug}/`)}>打开记录 <span aria-hidden="true">→</span></a></div>
    </article>
  );
}

function ProjectCard({ item }: { item: ProjectSummary }) {
  return (
    <article className="content-card project-card">
      <div className="project-cover" aria-hidden="true"><span className="project-cover__orb" /><span className="project-cover__grid" /></div>
      <div className="card-kicker"><span>{item.status}</span><span>{item.startDate}</span></div>
      <h2><a href={sitePath(`/projects/${item.slug}/`)}>{item.title}</a></h2>
      <p>{item.summary}</p>
      <div className="tag-row">{item.stack.map((stack) => <span key={stack}>{stack}</span>)}</div>
      <div className="card-footer"><span>{item.featured ? "FEATURED" : "ARCHIVE"}</span><a className="arrow-link" href={sitePath(`/projects/${item.slug}/`)}>查看档案 <span aria-hidden="true">→</span></a></div>
    </article>
  );
}

export function ContentFilter(props: Props) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("全部");
  const [status, setStatus] = useState("全部");
  const tags = useMemo(() => ["全部", ...new Set(props.items.flatMap((item) => item.kind === "article" ? item.tags : item.stack))], [props.items]);
  const statuses = useMemo(() => props.kind === "project" ? ["全部", ...new Set(props.items.map((item) => item.status))] : [], [props]);
  const filtered = props.items.filter((item) => {
    const text = `${item.title} ${item.description}`.toLowerCase();
    const itemTags = item.kind === "article" ? item.tags : item.stack;
    return text.includes(query.trim().toLowerCase()) && (tag === "全部" || itemTags.includes(tag)) && (item.kind === "article" || status === "全部" || item.status === status);
  });

  return (
    <>
      <div className="filter-panel" aria-label="内容筛选">
        <label className="search-field"><span>搜索</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={props.kind === "article" ? "标题或摘要…" : "项目名称或简介…"} /></label>
        <label><span>{props.kind === "article" ? "标签" : "技术栈"}</span><select value={tag} onChange={(event) => setTag(event.target.value)}>{tags.map((item) => <option key={item}>{item}</option>)}</select></label>
        {props.kind === "project" && <label><span>状态</span><select value={status} onChange={(event) => setStatus(event.target.value)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label>}
      </div>
      <p className="result-count" aria-live="polite">找到 {filtered.length} 条记录</p>
      {filtered.length > 0 ? (
        <div className={`content-grid ${props.kind === "project" ? "content-grid--projects" : ""}`}>
          {props.kind === "article"
            ? (filtered as ArticleSummary[]).map((item) => <ArticleCard key={item.slug} item={item} />)
            : (filtered as ProjectSummary[]).map((item) => <ProjectCard key={item.slug} item={item} />)}
        </div>
      ) : <div className="empty-state"><span aria-hidden="true">··· ?</span><h2>这里暂时没有信号</h2><p>换一个关键词或筛选条件再试试。</p></div>}
    </>
  );
}
