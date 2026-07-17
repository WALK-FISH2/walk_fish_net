const baseUrl = import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "");

export function sitePath(path = "/") {
  if (/^(https?:|mailto:|#)/.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalized}` || "/";
}

export const SITE_CONFIG = {
  name: "像素漫游者",
  shortName: "PIXEL//WALK",
  title: "像素漫游者 · 软件开发与奇怪想法",
  description: "一个关于软件开发、个人项目和奇怪想法的像素叙事网站。沿着陆地、深海与星空，看看文字如何变成作品。",
  author: "[姓名]",
  role: "软件开发者，也喜欢把一些奇怪的想法做成东西。",
  email: "hello@example.com",
  github: "https://github.com/",
  nav: [
    { href: "/", label: "首页" },
    { href: "/articles", label: "文章" },
    { href: "/projects", label: "做点啥呢" },
    { href: "/about", label: "关于我" },
  ],
} as const;
