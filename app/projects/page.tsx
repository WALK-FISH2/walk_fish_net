import type { Metadata } from "next";
import { ContentFilter } from "../components/content-filter";
import { PageShell } from "../components/page-shell";
import { getProjects } from "../lib/content";

export const metadata: Metadata = {
  title: "做点啥呢",
  description: "完成的工具、正在长大的原型，以及还没想明白的实验。",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const projects = getProjects();
  return (
    <PageShell theme="sea">
      <section className="archive-hero archive-hero--sea">
        <div>
          <p className="eyebrow">SUBMERGED FILES · {String(projects.length).padStart(2, "0")}</p>
          <h1>做点啥呢</h1>
          <p>完成的工具、正在长大的原型，以及那些值得继续追踪的实验信号。</p>
        </div>
        <div className="sonar" aria-hidden="true"><span /><span /><span /></div>
      </section>
      <section className="archive-section" aria-label="项目列表">
        <ContentFilter kind="project" items={projects} />
      </section>
    </PageShell>
  );
}
