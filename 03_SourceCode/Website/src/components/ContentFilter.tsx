import { useMemo, useState } from "react";
import { sitePath } from "../config/site.config";
import { PROGRAM_STATUS_LABELS, type ArticleSummary, type ProgramStatus, type ProgramSummary } from "../types/content";

type Props = { kind: "article"; items: ArticleSummary[] } | { kind: "program"; items: ProgramSummary[] };

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

function ProgramCard({ item }: { item: ProgramSummary }) {
  return (
    <article className="content-card program-card">
      <div className="program-cover" aria-hidden="true"><span className="program-cover__orb" /><span className="program-cover__grid" /></div>
      <div className="card-kicker"><span>{PROGRAM_STATUS_LABELS[item.status]}</span><span>{item.category}</span></div>
      <h2><a href={sitePath(`/programs/${item.slug}/`)}>{item.title}</a></h2>
      <p>{item.summary}</p>
      <div className="tag-row">{[...item.stack, ...item.tags].map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="card-footer"><span>{item.featured ? "FEATURED" : "ARCHIVE"}</span><a className="arrow-link" href={sitePath(`/programs/${item.slug}/`)}>查看程序 <span aria-hidden="true">→</span></a></div>
    </article>
  );
}

export function ContentFilter(props: Props) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("全部");
  const [status, setStatus] = useState("全部");
  const [category, setCategory] = useState("全部");
  const tags = useMemo(() => ["全部", ...new Set(props.items.flatMap((item) => item.kind === "article" ? item.tags : [...item.stack, ...item.tags]))], [props.items]);
  const statuses = useMemo(() => props.kind === "program" ? ["全部", ...new Set(props.items.map((item) => item.status))] : [], [props]);
  const categories = useMemo(() => props.kind === "program" ? ["全部", ...new Set(props.items.map((item) => item.category))] : [], [props]);
  const filtered = props.items.filter((item) => {
    const text = item.kind === "article"
      ? `${item.title} ${item.description} ${item.tags.join(" ")}`
      : `${item.title} ${item.summary} ${item.category} ${item.stack.join(" ")} ${item.tags.join(" ")} ${item.ownerContribution.join(" ")}`;
    const itemTags = item.kind === "article" ? item.tags : [...item.stack, ...item.tags];
    return text.toLowerCase().includes(query.trim().toLowerCase())
      && (tag === "全部" || itemTags.includes(tag))
      && (item.kind === "article" || status === "全部" || item.status === status)
      && (item.kind === "article" || category === "全部" || item.category === category);
  });

  return (
    <>
      <div className="filter-panel" aria-label="内容筛选">
        <label className="search-field"><span>搜索</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={props.kind === "article" ? "标题或摘要…" : "程序名称、简介或本人工作…"} /></label>
        <label><span>{props.kind === "article" ? "标签" : "标签 / 技术栈"}</span><select value={tag} onChange={(event) => setTag(event.target.value)}>{tags.map((item) => <option key={item}>{item}</option>)}</select></label>
        {props.kind === "program" && <label><span>状态</span><select value={status} onChange={(event) => setStatus(event.target.value)}>{statuses.map((item) => <option key={item} value={item}>{item === "全部" ? item : PROGRAM_STATUS_LABELS[item as ProgramStatus]}</option>)}</select></label>}
        {props.kind === "program" && <label><span>分类</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>}
      </div>
      <p className="result-count" aria-live="polite">找到 {filtered.length} 条记录</p>
      {filtered.length > 0 ? (
        <div className={`content-grid ${props.kind === "program" ? "content-grid--programs" : ""}`}>
          {props.kind === "article"
            ? (filtered as ArticleSummary[]).map((item) => <ArticleCard key={item.slug} item={item} />)
            : (filtered as ProgramSummary[]).map((item) => <ProgramCard key={item.slug} item={item} />)}
        </div>
      ) : <div className="empty-state"><span aria-hidden="true">··· ?</span><h2>这里暂时没有信号</h2><p>换一个关键词或筛选条件再试试。</p></div>}
    </>
  );
}
