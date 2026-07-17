import Link from "next/link";
import { SITE_CONFIG } from "../config/site.config";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <p className="eyebrow">END OF CURRENT MAP</p>
        <p>世界仍在生成中。下一次来，也许会多一片岛。</p>
      </div>
      <div className="footer-links">
        <Link href="/articles">文章</Link>
        <Link href="/projects">项目</Link>
        <a href={`mailto:${SITE_CONFIG.email}`}>邮件</a>
      </div>
      <p className="footer-meta">© {new Date().getFullYear()} {SITE_CONFIG.name} · ORIGINAL PIXEL WORLD</p>
    </footer>
  );
}
