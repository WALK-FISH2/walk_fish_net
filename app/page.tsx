import type { Metadata } from "next";
import { ImmersiveHome } from "./components/immersive-home";
import { SITE_CONFIG } from "./config/site.config";
import { getArticles, getProjects } from "./lib/content";

export const metadata: Metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  const articles = getArticles().filter((item) => item.featured).slice(0, 3);
  const projects = getProjects().filter((item) => item.featured).slice(0, 3);
  return <ImmersiveHome articles={articles} projects={projects} />;
}
