import type { Metadata } from "next";
import { ContentFilter } from "../components/content-filter";
import { PageShell } from "../components/page-shell";
import { getArticles } from "../lib/content";

export const metadata: Metadata = {
  title: "文章",
  description: "开发笔记、设计思考与一路捡到的奇怪问题。",
  alternates: { canonical: "/articles" },
};

export default function ArticlesPage() {
  const articles = getArticles();
  return (
    <PageShell theme="land">
      <section className="archive-hero archive-hero--land">
        <div>
          <p className="eyebrow">LOG BOOK · {String(articles.length).padStart(2, "0")}</p>
          <h1>沿途记录</h1>
          <p>开发笔记、设计思考，以及把奇怪想法做成东西时留下的脚印。</p>
        </div>
        <div className="pixel-sun" aria-hidden="true" />
      </section>
      <section className="archive-section" aria-label="文章列表">
        <ContentFilter kind="article" items={articles} />
      </section>
    </PageShell>
  );
}
