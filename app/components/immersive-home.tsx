"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SITE_CONFIG } from "../config/site.config";
import { STORY_CONFIG } from "../config/story.config";
import { SceneController, detectQuality } from "../interactive/SceneController";
import type { Article, Project } from "../lib/content";
import { SiteNav } from "./site-nav";

type Phase = "land" | "sea" | "space";

function phaseFor(progress: number): Phase {
  if (progress < STORY_CONFIG.sections.underwater[0]) return "land";
  if (progress < STORY_CONFIG.sections.space[0]) return "sea";
  return "space";
}

export function ImmersiveHome({ articles, projects }: { articles: Article[]; projects: Project[] }) {
  const storyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<SceneController | null>(null);
  const phaseRef = useRef<Phase>("land");
  const [phase, setPhase] = useState<Phase>("land");
  const [ready, setReady] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [canvasFailed, setCanvasFailed] = useState(false);
  const reducedMotionRef = useRef(false);

  const updateProgress = useCallback((progress: number) => {
    const nextPhase = phaseFor(progress);
    const story = storyRef.current;
    story?.style.setProperty("--story-progress", String(progress));
    story?.style.setProperty("--waterline", `${Math.max(0, Math.min(100, (progress - 0.3) * 125))}%`);
    story?.setAttribute("data-phase", nextPhase);
    controllerRef.current?.update(progress);
    if (phaseRef.current !== nextPhase) {
      phaseRef.current = nextPhase;
      setPhase(nextPhase);
    }
  }, []);

  useEffect(() => {
    let disposed = false;
    let resizeFrame = 0;
    const canvas = canvasRef.current;
    const story = storyRef.current;
    if (!canvas || !story) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = media.matches;
    const controller = new SceneController({ onContextLost: () => setCanvasFailed(true) });
    controllerRef.current = controller;

    const initialize = async () => {
      try {
        controller.setQuality(detectQuality());
        await controller.init(canvas);
        if (disposed) {
          controller.destroy();
          return;
        }
        controller.setReducedMotion(media.matches);
        setReady(true);
      } catch {
        if (!disposed) {
          setCanvasFailed(true);
          setReady(true);
        }
      }
    };
    void initialize();

    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: story,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => updateProgress(self.progress),
    });

    const onResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        controller.resize(window.innerWidth, window.innerHeight, window.devicePixelRatio);
        ScrollTrigger.refresh();
      });
    };
    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
      controller.setReducedMotion(event.matches);
    };
    window.addEventListener("resize", onResize);
    media.addEventListener("change", onMotionChange);

    return () => {
      disposed = true;
      cancelAnimationFrame(resizeFrame);
      trigger.kill();
      window.removeEventListener("resize", onResize);
      media.removeEventListener("change", onMotionChange);
      controller.destroy();
      controllerRef.current = null;
    };
  }, [updateProgress]);

  const jumpTo = (progress: number) => {
    const story = storyRef.current;
    if (!story) return;
    const distance = story.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: story.offsetTop + distance * progress,
      behavior: reducedMotionRef.current ? "auto" : "smooth",
    });
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    controllerRef.current?.setPointer(event.clientX / window.innerWidth, event.clientY / window.innerHeight);
  };

  const loadingVisible = !ready && !skipped;

  return (
    <div
      ref={storyRef}
      className={`immersive-home ${canvasFailed ? "immersive-home--fallback" : ""}`}
      data-phase={phase}
      style={{ "--story-height": `${STORY_CONFIG.scrollHeightVh}vh` } as React.CSSProperties}
      onPointerMove={handlePointerMove}
    >
      <div className={`world-loader ${loadingVisible ? "" : "world-loader--done"}`} aria-hidden={!loadingVisible}>
        <div className="loader-mark" aria-hidden="true"><span /><span /><span /></div>
        <p>正在生成世界……</p>
        <strong>LOADING WORLD</strong>
        <div className="loader-track" role="progressbar" aria-label="世界加载进度" aria-valuemin={0} aria-valuemax={100} aria-valuenow={ready ? 100 : 0}>
          <span style={{ width: ready ? "100%" : "16%" }} />
        </div>
        <button type="button" onClick={() => setSkipped(true)}>跳过动画</button>
      </div>

      <canvas ref={canvasRef} className="story-canvas pixel-art" aria-hidden="true" />
      <div className="canvas-fallback" aria-hidden="true" />
      <SiteNav floating />

      <nav className="story-progress" aria-label="旅程阶段">
        {([
          ["land", "陆地", 0],
          ["sea", "深海", STORY_CONFIG.sections.underwater[0]],
          ["space", "星空", STORY_CONFIG.sections.space[0]],
        ] as const).map(([id, label, progress]) => (
          <button key={id} className={phase === id ? "is-active" : ""} type="button" onClick={() => jumpTo(progress)} aria-current={phase === id ? "step" : undefined}>
            <span aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>

      <main id="main-content" className="story-content">
        <section className="story-stage story-stage--hero" aria-labelledby="home-title">
          <div className="hero-copy story-panel">
            <p className="eyebrow">PRESS ↓ TO EXPLORE · WORLD 01</p>
            <h1 id="home-title">你好，我是 <span>{SITE_CONFIG.author}</span></h1>
            <p>{SITE_CONFIG.role}</p>
            <div className="hero-actions">
              <Link className="pixel-button pixel-button--primary" href="/articles">看看文章</Link>
              <Link className="pixel-button" href="/projects">做点啥呢</Link>
            </div>
            <button className="scroll-cue" type="button" onClick={() => jumpTo(0.16)}>
              <span aria-hidden="true">↓</span> 向下滚动
            </button>
          </div>
          <div className="scene-label" aria-hidden="true"><span>01</span> OVERWORLD</div>
        </section>

        <section className="story-stage story-stage--articles" aria-labelledby="featured-articles-title">
          <div className="stage-copy">
            <p className="eyebrow">ROAD SIGNS · 03</p>
            <h2 id="featured-articles-title">沿途捡到的想法</h2>
            <p>有些问题走着走着就有了答案，有些会变成下一段路。</p>
          </div>
          <div className="road-signs">
            {articles.map((article, index) => (
              <article key={article.slug} className="road-sign" style={{ "--sign-index": index } as React.CSSProperties}>
                <span className="road-sign__number">0{index + 1}</span>
                <h3><Link href={`/articles/${article.slug}`}>{article.title}</Link></h3>
                <p>{article.description}</p>
                <div>{article.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
              </article>
            ))}
          </div>
          <Link className="stage-link" href="/articles">查看全部文章 <span aria-hidden="true">→</span></Link>
        </section>

        <section className="story-stage story-stage--projects" aria-labelledby="featured-projects-title">
          <div className="stage-copy stage-copy--light">
            <p className="eyebrow">DEPTH 3800 · SIGNAL FOUND</p>
            <h2 id="featured-projects-title">沉在海里的项目档案</h2>
            <p>完成的、正在做的，以及值得留下一盏信号灯的实验。</p>
          </div>
          <div className="portholes">
            {projects.map((project, index) => (
              <article key={project.slug} className="porthole" style={{ "--porthole-index": index } as React.CSSProperties}>
                <div className="porthole__glass" aria-hidden="true"><span /><i /></div>
                <div className="porthole__copy">
                  <div><span>{project.status}</span><span>FILE 0{index + 1}</span></div>
                  <h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3>
                  <p>{project.summary}</p>
                  <ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
                  <Link className="arrow-link" href={`/projects/${project.slug}`}>查看详情 →</Link>
                </div>
              </article>
            ))}
          </div>
          <Link className="stage-link stage-link--light" href="/projects">打开全部档案 <span aria-hidden="true">→</span></Link>
        </section>

        <section className="story-stage story-stage--space" aria-labelledby="space-about-title">
          <div className="constellation-card story-panel">
            <p className="eyebrow">NEW SKY · SIGNAL STABLE</p>
            <h2 id="space-about-title">海的另一面，是还没命名的星空。</h2>
            <p>我关注软件开发、交互与可视化，也喜欢记录一件东西从想法到能用之间发生了什么。</p>
            <div className="skill-orbit" aria-label="关注方向">
              <span>TypeScript</span><span>Web</span><span>Canvas</span><span>Tools</span>
            </div>
            <div className="hero-actions">
              <Link className="pixel-button pixel-button--primary" href="/about">关于我</Link>
              <a className="pixel-button" href={`mailto:${SITE_CONFIG.email}`}>发个信号</a>
            </div>
          </div>
          <div className="journey-end">
            <button type="button" onClick={() => jumpTo(0)}>↺ 重新开始旅程</button>
            <p>© {new Date().getFullYear()} {SITE_CONFIG.name} · WORLD CONTINUES</p>
          </div>
        </section>
      </main>
      <noscript><div className="noscript-note">动画需要 JavaScript，但文章、项目和导航仍然可以正常访问。</div></noscript>
    </div>
  );
}
