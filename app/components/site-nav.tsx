"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SITE_CONFIG } from "../config/site.config";

export function SiteNav({ floating = false }: { floating?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>("a, button"),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className={`site-nav ${floating ? "site-nav--floating" : ""}`}>
      <Link className="site-brand" href="/" aria-label={`${SITE_CONFIG.name}首页`}>
        <span className="brand-sprite" aria-hidden="true" />
        <span>
          <strong>{SITE_CONFIG.shortName}</strong>
          <small>WORLD 01</small>
        </span>
      </Link>

      <nav className="desktop-nav" aria-label="主导航">
        {SITE_CONFIG.nav.map((item) => {
          const current =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} aria-current={current ? "page" : undefined}>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        ref={menuButtonRef}
        className="menu-button pixel-button"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">{open ? "×" : "≡"}</span>
        <span className="sr-only">{open ? "关闭菜单" : "打开菜单"}</span>
      </button>

      {open && (
        <div ref={panelRef} id="mobile-navigation" className="mobile-nav" role="dialog" aria-modal="true" aria-label="移动端导航">
          <div className="mobile-nav__stars" aria-hidden="true" />
          <p className="eyebrow">SELECT AREA</p>
          <nav aria-label="移动端主导航">
            {SITE_CONFIG.nav.map((item, index) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                <span>0{index + 1}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <button className="text-button" type="button" onClick={() => setOpen(false)}>
            关闭 / ESC
          </button>
        </div>
      )}
    </header>
  );
}
