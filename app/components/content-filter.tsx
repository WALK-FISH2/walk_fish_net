"use client";

import { useMemo, useState } from "react";
import type { Article, Project } from "../lib/content";
import { ArticleCard, ProjectCard } from "./content-card";

type Props =
  | { kind: "article"; items: Article[] }
  | { kind: "project"; items: Project[] };

export function ContentFilter(props: Props) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("全部");
  const [status, setStatus] = useState("全部");
  const tags = useMemo(
    () => ["全部", ...new Set(props.items.flatMap((item) => item.kind === "article" ? item.tags : item.stack))],
    [props.items],
  );
  const statuses = useMemo(
    () => props.kind === "project" ? ["全部", ...new Set(props.items.map((item) => item.status))] : [],
    [props],
  );

  const filtered = props.items.filter((item) => {
    const haystack = `${item.title} ${item.description}`.toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    const itemTags = item.kind === "article" ? item.tags : item.stack;
    const matchesTag = tag === "全部" || itemTags.includes(tag);
    const matchesStatus = item.kind === "article" || status === "全部" || item.status === status;
    return matchesQuery && matchesTag && matchesStatus;
  });

  return (
    <>
      <div className="filter-panel" aria-label="内容筛选">
        <label className="search-field">
          <span>搜索</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={props.kind === "article" ? "标题或摘要…" : "项目名称或简介…"} />
        </label>
        <label>
          <span>{props.kind === "article" ? "标签" : "技术栈"}</span>
          <select value={tag} onChange={(event) => setTag(event.target.value)}>
            {tags.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        {props.kind === "project" && (
          <label>
            <span>状态</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              {statuses.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        )}
      </div>

      <p className="result-count" aria-live="polite">找到 {filtered.length} 条记录</p>
      {filtered.length > 0 ? (
        <div className={`content-grid ${props.kind === "project" ? "content-grid--projects" : ""}`}>
          {props.kind === "article"
            ? (filtered as Article[]).map((item) => <ArticleCard key={item.slug} article={item} />)
            : (filtered as Project[]).map((item) => <ProjectCard key={item.slug} project={item} />)}
        </div>
      ) : (
        <div className="empty-state">
          <span aria-hidden="true">··· ?</span>
          <h2>这里暂时没有信号</h2>
          <p>换一个关键词或筛选条件再试试。</p>
        </div>
      )}
    </>
  );
}
