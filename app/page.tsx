import SmoothScroll from "@/components/SmoothScroll";
import Scene from "@/components/Scene";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Levels from "@/components/sections/Levels";
import Architecture from "@/components/sections/Architecture";
import Infrastructure from "@/components/sections/Infrastructure";
import Final from "@/components/sections/Final";
import { SITE, NAV } from "@/lib/content";

export default function Page() {
  return (
    <SmoothScroll>
      <Scene />
      <Nav />

      <main>
        <Hero />
        <Manifesto />
        <Levels />
        <Architecture />
        <Infrastructure />
        <Final />
      </main>

      <footer className="footer">
        <span className="footer-brand">{NAV.brand}</span>
        <span>{SITE.tagline}</span>
        <span>Демо для портфолио · AUREA Studio · {new Date().getFullYear()}</span>
      </footer>

      <div className="grain" aria-hidden="true" />
    </SmoothScroll>
  );
}
