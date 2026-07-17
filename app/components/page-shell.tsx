import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";

export function PageShell({ children, theme = "space" }: { children: ReactNode; theme?: "land" | "sea" | "space" }) {
  return (
    <div className={`page-shell page-shell--${theme}`}>
      <SiteNav />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  );
}
