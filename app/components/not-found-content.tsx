import Link from "next/link";
import { PageShell } from "./page-shell";

export function NotFoundContent() {
  return (
    <PageShell theme="space">
      <section className="not-found">
        <div className="broken-planet" aria-hidden="true"><span /></div>
        <p className="eyebrow">LOST COORDINATES</p>
        <h1>4<span>0</span>4</h1>
        <p>这块地图还没有生成。你可以返回起点，或者从内容档案继续探索。</p>
        <div className="detail-actions">
          <Link className="pixel-button pixel-button--primary" href="/">返回首页</Link>
          <Link className="pixel-button" href="/articles">翻翻文章</Link>
        </div>
      </section>
    </PageShell>
  );
}
