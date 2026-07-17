import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetail } from "../../components/content-detail";
import { PageShell } from "../../components/page-shell";
import { getProject, getProjects } from "../../lib/content";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getProjects().filter((item) => !item.draft).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary, alternates: { canonical: `/projects/${project.slug}` } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projects = getProjects();
  const index = projects.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();
  return (
    <PageShell theme="sea">
      <ContentDetail item={projects[index]} previous={projects[index - 1]} next={projects[index + 1]} />
    </PageShell>
  );
}
