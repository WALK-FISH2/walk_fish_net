import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { SITE_CONFIG, sitePath } from "../config/site.config";
import { STORY_CONFIG, getDiveState, getOceanSpaceMorphState } from "../config/story.config";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { SceneController, detectQuality } from "../interactive/SceneController";
import { DEMO_TYPE_LABELS, PROGRAM_STATUS_LABELS, type ArticleSummary, type ProgramSummary } from "../types/content";
import { MeteorOverlay } from "./MeteorOverlay";
import { MotionModeControl } from "./MotionModeControl";

type Phase = "land" | "sea" | "space";
function phaseFor(progress: number): Phase { return progress < 0.38 ? "land" : progress < 0.8 ? "sea" : "space"; }

export function ImmersiveHome({ articles, programs }: { articles: ArticleSummary[]; programs: ProgramSummary[] }) {
  const storyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<SceneController | null>(null);
  const phaseRef = useRef<Phase>("land");
  const progressRef = useRef(0);
  const motionRestoreFrameRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const [phase, setPhase] = useState<Phase>("land");
  const [ready, setReady] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [canvasFailed, setCanvasFailed] = useState(false);
  const motionPreference = useMotionPreference();
  const reducedMotion = motionPreference.mode === "reduce";

  useLayoutEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  const updateProgress = useCallback((progress: number) => {
    progressRef.current = progress;
    const nextPhase = phaseFor(progress);
    const dive = getDiveState(progress);
    const morph = getOceanSpaceMorphState(progress);
    const root = storyRef.current;
    root?.style.setProperty("--story-progress", String(progress));
    root?.style.setProperty("--dive-progress", String(dive.overall));
    root?.style.setProperty("--waterline-y", String(dive.surfaceY));
    root?.style.setProperty("--waterline-opacity", String(dive.surfaceOpacity));
    root?.style.setProperty("--refraction-strength", String(dive.refraction));
    root?.style.setProperty("--program-exit-opacity", String(1 - morph.programsExit));
    root?.style.setProperty("--program-exit-y", `${Math.round(morph.programsExit * -72)}px`);
    root?.style.setProperty("--about-enter-opacity", String(morph.aboutEnter));
    root?.style.setProperty("--about-enter-y", `${Math.round((1 - morph.aboutEnter) * 56)}px`);
    root?.toggleAttribute("data-programs-exited", morph.programsExit >= 0.995);
    root?.setAttribute("data-phase", nextPhase);
    document.body.dataset.storyPhase = nextPhase;
    controllerRef.current?.update(progress);
    if (phaseRef.current !== nextPhase) { phaseRef.current = nextPhase; setPhase(nextPhase); }
  }, []);

  useEffect(() => {
    if (!motionPreference.ready) return;
    let disposed = false;
    let resizeFrame = 0;
    const canvas = canvasRef.current;
    const story = storyRef.current;
    if (!canvas || !story) return;
    const acceptanceParams = new URLSearchParams(window.location.search);
    const forceCanvasFallback = acceptanceParams.get("canvas") === "fallback";
    const controller = new SceneController(() => setCanvasFailed(true));
    controllerRef.current = controller;
    if (forceCanvasFallback) {
      queueMicrotask(() => { if (!disposed) { setCanvasFailed(true); setReady(true); } });
    } else {
      void (async () => {
        try {
          controller.setQuality(detectQuality(reducedMotionRef.current));
          await controller.init(canvas);
          if (disposed) return controller.destroy();
          controller.setReducedMotion(reducedMotionRef.current);
          setReady(true);
        } catch { if (!disposed) { setCanvasFailed(true); setReady(true); } }
      })();
    }
    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({ trigger: story, start: "top top", end: "bottom bottom", scrub: true, onUpdate: (self) => updateProgress(self.progress) });
    const onResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => { controller.resize(window.innerWidth, window.innerHeight, window.devicePixelRatio); ScrollTrigger.refresh(); });
    };
    window.addEventListener("resize", onResize);
    return () => {
      disposed = true;
      cancelAnimationFrame(resizeFrame);
      trigger.kill();
      window.removeEventListener("resize", onResize);
      controller.destroy();
      delete document.body.dataset.storyPhase;
    };
  }, [motionPreference.ready, updateProgress]);

  useLayoutEffect(() => {
    if (!motionPreference.ready) return;
    reducedMotionRef.current = reducedMotion;
    const controller = controllerRef.current;
    controller?.setQuality(detectQuality(reducedMotion));
    controller?.setReducedMotion(reducedMotion);
  }, [motionPreference.ready, reducedMotion]);

  useEffect(() => () => window.cancelAnimationFrame(motionRestoreFrameRef.current), []);

  const jumpTo = (progress: number) => {
    const story = storyRef.current;
    if (!story) return;
    window.scrollTo({ top: story.offsetTop + (story.offsetHeight - window.innerHeight) * progress, behavior: reducedMotionRef.current ? "auto" : "smooth" });
  };
  const toggleMotion = () => {
    const preservedProgress = progressRef.current;
    motionPreference.toggle();
    window.cancelAnimationFrame(motionRestoreFrameRef.current);
    motionRestoreFrameRef.current = window.requestAnimationFrame(() => {
      motionRestoreFrameRef.current = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        motionRestoreFrameRef.current = window.requestAnimationFrame(() => {
          if (!storyRef.current) return;
          const top = Math.max(0, document.documentElement.scrollHeight - window.innerHeight) * preservedProgress;
          window.scrollTo({ top, behavior: "auto" });
          ScrollTrigger.update();
          updateProgress(preservedProgress);
        });
      });
    });
  };
  const pointerMove = (event: ReactPointerEvent<HTMLDivElement>) => controllerRef.current?.setPointer(event.clientX / window.innerWidth, event.clientY / window.innerHeight);
  const loadingVisible = !ready && !skipped;

  return (
    <div ref={storyRef} className={`immersive-home ${canvasFailed ? "immersive-home--fallback" : ""} ${reducedMotion ? "immersive-home--reduced-motion" : "immersive-home--full-motion"}`} data-phase={phase} data-motion-mode={motionPreference.mode} data-motion-source={motionPreference.source} data-system-motion={motionPreference.systemPrefersReduced ? "reduce" : "no-preference"} style={{ "--story-height": `${STORY_CONFIG.scrollHeightVh}vh`, "--full-story-height": `${STORY_CONFIG.scrollHeightVh}vh` } as CSSProperties} onPointerMove={pointerMove}>
      <div className={`world-loader ${loadingVisible ? "" : "world-loader--done"}`} aria-hidden={!loadingVisible}>
        <div className="loader-mark" aria-hidden="true"><span /><span /><span /></div><p>正在生成世界……</p><strong>LOADING WORLD 02</strong>
        <div className="loader-track" role="progressbar" aria-label="世界加载进度" aria-valuemin={0} aria-valuemax={100} aria-valuenow={ready ? 100 : 0}><span style={{ width: ready ? "100%" : "16%" }} /></div>
        <button type="button" onClick={() => setSkipped(true)}>跳过动画</button>
      </div>
      <canvas ref={canvasRef} className="story-canvas pixel-art" aria-hidden="true" />
      <MeteorOverlay active={phase === "space" && !canvasFailed} reducedMotion={reducedMotion} />
      <div className="canvas-fallback" aria-hidden="true" />
      <div className="waterline-dom-effect" aria-hidden="true"><span /><i /></div>

      <nav className="story-progress" aria-label="旅程阶段">
        <span className="story-progress__rail" aria-hidden="true"><i /></span>
        {([ ["land", "陆地", 0], ["sea", "深海", 0.38], ["space", "星空", 0.8] ] as const).map(([id, label, progress]) => (
          <button key={id} className={phase === id ? "is-active" : ""} type="button" onClick={() => jumpTo(progress)} aria-current={phase === id ? "step" : undefined}><span aria-hidden="true" />{label}<small>{id === "land" ? "01" : id === "sea" ? "02" : "03"}</small></button>
        ))}
      </nav>
      <MotionModeControl mode={motionPreference.mode} source={motionPreference.source} systemPrefersReduced={motionPreference.systemPrefersReduced} onToggle={toggleMotion} />

      <main id="main-content" className="story-content">
        <section className="story-stage story-stage--hero" aria-labelledby="home-title">
          <div className="hero-copy story-panel pixel-window">
            <span className="pixel-window__corner pixel-window__corner--a" aria-hidden="true" /><span className="pixel-window__corner pixel-window__corner--b" aria-hidden="true" />
            <p className="eyebrow">WORLD 01 · NEW GAME+</p><h1 id="home-title">你好，我是 <span>{SITE_CONFIG.author}</span></h1><p>{SITE_CONFIG.role}</p>
            <div className="hero-actions"><a className="pixel-button pixel-button--primary" href={sitePath("/articles/")}>看看文章</a><a className="pixel-button" href={sitePath("/programs/")}>做点啥呢</a></div>
            <button className="scroll-cue" type="button" onClick={() => jumpTo(0.13)}><span aria-hidden="true">↓</span> 向下滚动</button>
          </div>
          <div className="scene-label" aria-hidden="true"><span>01</span> OVERWORLD · WIND EAST</div>
        </section>

        <section className="story-stage story-stage--articles" aria-labelledby="featured-articles-title">
          <div className="stage-copy"><p className="eyebrow">MILE 03 · ROAD SIGNS</p><h2 id="featured-articles-title">沿途捡到的想法</h2><p>有些问题走着走着就有了答案，有些会变成下一段路。</p></div>
          <div className="road-signs">
            {articles.map((article, index) => (
              <article key={article.slug} className={`road-sign road-sign--${["arrow", "board", "gate"][index % 3]}`} style={{ "--sign-index": index } as CSSProperties}>
                <span className="road-sign__number">MILE 0{index + 1}</span><h3><a href={sitePath(`/articles/${article.slug}/`)}>{article.title}</a></h3><p>{article.description}</p><div>{article.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div><i className="road-sign__post" aria-hidden="true" />
              </article>
            ))}
          </div>
          <a className="stage-link" href={sitePath("/articles/")}>查看全部文章 <span aria-hidden="true">→</span></a>
        </section>

        <section className="story-stage story-stage--programs" aria-labelledby="featured-programs-title">
          <div className="stage-copy stage-copy--light"><p className="eyebrow">DEPTH 3800 · PROGRAM ARCHIVE</p><h2 id="featured-programs-title">沉在海里的程序档案</h2><p>我本人编写的工具、网页应用、交互实验，以及仍在生长的程序原型。</p></div>
          <div className="portholes">
            {programs.map((program, index) => (
              <article key={program.slug} className={`porthole porthole--${["terminal", "probe", "capsule"][index % 3]}`} style={{ "--porthole-index": index } as CSSProperties}>
                <div className="porthole__hardware" aria-hidden="true"><b /><b /><b /><b /></div><div className="porthole__glass" aria-hidden="true"><span /><i /></div>
                <div className="porthole__copy"><div className="porthole__meta"><span>{PROGRAM_STATUS_LABELS[program.status]} · {DEMO_TYPE_LABELS[program.demoType]}</span><span>FILE 0{index + 1}</span></div><h3><a href={sitePath(`/programs/${program.slug}/`)}>{program.title}</a></h3><p>{program.summary}</p><p className="porthole__limitation"><strong>当前限制：</strong>{program.limitations[0]}</p><ul>{program.stack.map((item) => <li key={item}>{item}</li>)}</ul><div className="porthole__actions"><a className="arrow-link" href={sitePath(`/programs/${program.slug}/`)}>查看程序 →</a>{program.demoUrl ? <a className="arrow-link" href={program.demoUrl.startsWith("/") ? sitePath(program.demoUrl) : program.demoUrl}>立即体验 ↗</a> : <span>详情中查看演示说明</span>}</div></div>
              </article>
            ))}
          </div>
          <a className="stage-link stage-link--light" href={sitePath("/programs/")}>打开全部程序 <span aria-hidden="true">→</span></a>
        </section>

        <section className="story-stage story-stage--space" aria-labelledby="space-about-title">
          <div className="signal-station">
            <span className="signal-station__antenna" aria-hidden="true" /><span className="signal-station__satellite" aria-hidden="true" />
            <div className="constellation-card story-panel"><p className="eyebrow">SIGNAL 03 · PLAYER ONLINE</p><h2 id="space-about-title">海的另一面，是还没命名的星空。</h2><p>我关注软件开发、交互与可视化，也喜欢记录一件东西从想法到能用之间发生了什么。</p><div className="skill-orbit" aria-label="关注方向"><span>TypeScript</span><span>Web</span><span>Canvas</span><span>Tools</span></div><div className="hero-actions"><a className="pixel-button pixel-button--primary" href={sitePath("/about/")}>关于我</a><a className="pixel-button" href={`mailto:${SITE_CONFIG.email}`}>发个信号</a></div></div>
          </div>
          <div className="constellation-links" aria-label="星座内容入口">
            {articles.slice(0, 2).map((article, index) => <a key={article.slug} className={`constellation-star constellation-star--${index + 1}`} href={sitePath(`/articles/${article.slug}/`)}><i aria-hidden="true" /><span>{article.title}</span></a>)}
            {programs.slice(0, 2).map((program, index) => <a key={program.slug} className={`constellation-star constellation-star--${index + 3}`} href={sitePath(`/programs/${program.slug}/`)}><i aria-hidden="true" /><span>{program.title}</span></a>)}
          </div>
          <div className="journey-end"><button type="button" onClick={() => jumpTo(0)}>↺ 重新开始旅程</button><p>© {new Date().getFullYear()} {SITE_CONFIG.name} · WORLD CONTINUES</p></div>
        </section>
      </main>
      <noscript><div className="noscript-note">动画需要 JavaScript，但文章、程序和导航仍然可以正常访问。</div></noscript>
    </div>
  );
}
