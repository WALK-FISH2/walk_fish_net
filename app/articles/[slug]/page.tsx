import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetail } from "../../components/content-detail";
import { PageShell } from "../../components/page-shell";
import { getArticle, getArticles } from "../../lib/content";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getArticles().filter((item) => !item.draft).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: { type: "article", publishedTime: article.publishDate, modifiedTime: article.updatedDate, tags: article.tags },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = getArticles();
  const index = articles.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();
  return (
    <PageShell theme="land">
      <ContentDetail item={articles[index]} previous={articles[index - 1]} next={articles[index + 1]} />
    </PageShell>
  );
}
