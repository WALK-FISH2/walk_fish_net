import Link from "next/link";
import type { Article, Project } from "../lib/content";

function DetailHeader({ item }: { item: Article | Project }) {
  return (
    <header className="detail-header">
      <p className="eyebrow">{item.kind === "article" ? "TRAVEL LOG" : "PROJECT ARCHIVE"}</p>
      <h1>{item.title}</h1>
      <p className="detail-lede">{item.description}</p>
      <div className="detail-meta">
        {item.kind === "article" ? (
          <>
            <time dateTime={item.publishDate}>发布于 {item.publishDate}</time>
            {item.updatedDate && <time dateTime={item.updatedDate}>更新于 {item.updatedDate}</time>}
            <span>{item.readingTime} 分钟阅读</span>
          </>
        ) : (
          <>
            <span className="status-dot">{item.status}</span>
            <span>{item.startDate}{item.endDate ? ` — ${item.endDate}` : " — NOW"}</span>
          </>
        )}
      </div>
      <div className="tag-row detail-tags">
        {(item.kind === "article" ? item.tags : item.stack).map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      {item.kind === "project" && (item.demoUrl || item.sourceUrl) && (
        <div className="detail-actions">
          {item.demoUrl && <a className="pixel-button pixel-button--primary" href={item.demoUrl}>查看演示</a>}
          {item.sourceUrl && <a className="pixel-button" href={item.sourceUrl} target="_blank" rel="noreferrer">查看源码</a>}
        </div>
      )}
    </header>
  );
}

export function ContentDetail({
  item,
  previous,
  next,
}: {
  item: Article | Project;
  previous?: Article | Project;
  next?: Article | Project;
}) {
  const base = item.kind === "article" ? "/articles" : "/projects";
  return (
    <article className="detail-page">
      <Link className="back-link" href={base}>← 返回{item.kind === "article" ? "文章" : "项目"}列表</Link>
      <DetailHeader item={item} />
      <div className="detail-layout">
        <div className="prose" dangerouslySetInnerHTML={{ __html: item.html }} />
        {item.toc.length > 0 && (
          <aside className="toc" aria-label="本页目录">
            <p>IN THIS FILE</p>
            <ol>
              {item.toc.map((entry) => (
                <li key={entry.id} className={entry.depth === 3 ? "toc-subitem" : ""}>
                  <a href={`#${entry.id}`}>{entry.text}</a>
                </li>
              ))}
            </ol>
          </aside>
        )}
      </div>
      <nav className="adjacent-nav" aria-label="相邻内容">
        {previous ? <Link href={`${base}/${previous.slug}`}><span>← 上一篇</span><strong>{previous.title}</strong></Link> : <span />}
        {next ? <Link href={`${base}/${next.slug}`}><span>下一篇 →</span><strong>{next.title}</strong></Link> : <span />}
      </nav>
    </article>
  );
}
