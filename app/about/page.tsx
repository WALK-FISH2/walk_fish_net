import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../components/page-shell";
import { SITE_CONFIG } from "../config/site.config";

export const metadata: Metadata = {
  title: "关于我",
  description: "关于像素漫游者：开发方向、工具箱、兴趣与联系方式。",
  alternates: { canonical: "/about" },
};

const skills = ["TypeScript", "React", "Vue", "Node.js", "Python", "Java", "Canvas", "Web 可访问性"];

export default function AboutPage() {
  return (
    <PageShell theme="space">
      <section className="about-hero">
        <div className="about-avatar" aria-hidden="true"><span /><i /></div>
        <div>
          <p className="eyebrow">PLAYER PROFILE · SLOT 01</p>
          <h1>你好，我是 {SITE_CONFIG.author}</h1>
          <p className="about-lede">{SITE_CONFIG.role}</p>
          <p>我关心清晰的软件结构，也关心一个按钮按下去时是否有恰到好处的反馈。这里收集我的文章、项目，以及仍在学习的方向。</p>
          <div className="detail-actions">
            <a className="pixel-button pixel-button--primary" href={`mailto:${SITE_CONFIG.email}`}>发一封邮件</a>
            <a className="pixel-button" href={SITE_CONFIG.github} target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
      </section>

      <section className="about-grid">
        <article>
          <p className="eyebrow">CURRENT QUEST</p>
          <h2>正在关注</h2>
          <p>可维护的前端架构、富有叙事感的交互、数据可视化，以及让小工具真正进入日常工作流的方法。</p>
        </article>
        <article>
          <p className="eyebrow">INVENTORY</p>
          <h2>常用工具箱</h2>
          <div className="skill-cloud">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
        </article>
        <article>
          <p className="eyebrow">SIDE PATH</p>
          <h2>旅途之外</h2>
          <p>会记录新学到的东西，也喜欢把重复步骤做成脚本。偶尔为了一个过场动画花掉本来只够修一个按钮的时间。</p>
        </article>
      </section>

      <section className="contact-banner">
        <span aria-hidden="true">✦</span>
        <div><p className="eyebrow">NEXT SIGNAL</p><h2>要不要一起做点啥呢？</h2></div>
        <Link className="arrow-link" href="/projects">先看看项目 →</Link>
      </section>
    </PageShell>
  );
}
