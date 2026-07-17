import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const origin = site?.toString().replace(/\/$/, "") ?? "";
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${origin}${base}/sitemap-index.xml\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};

export const prerender = true;
