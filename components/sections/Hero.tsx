"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import BoomerangVideoBg from "@/components/BoomerangVideoBg";
import { HERO, NAV } from "@/lib/content";

/*
  Hero — видео-кадр во весь экран (бумеранг-фон, техника из референса).
  Поверх видео: компактная стеклянная навигация, крупный центральный заголовок
  с ключевым словом вторым (холодным) цветом, деликатный подзаголовок, снизу —
  слева блок-CTA, справа отметка высоты. Пока файла видео нет — сзади холодный
  CSS-туман (.hero-mist), так что кадр целостен и без ролика.
*/
const HERO_VIDEO = (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/video/hero.mp4";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      gsap.set(el, { autoAlpha: 1 });

      const play = () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(".hero-nav", { y: -20, autoAlpha: 0, duration: 1 }, 0)
          .from(
            ".hero-v-title .line",
            { yPercent: 115, autoAlpha: 0, duration: 1.15, stagger: 0.12 },
            0.15
          )
          .from(".hero-v-sub", { y: 20, autoAlpha: 0, duration: 0.9 }, "-=0.6")
          .from(
            [".hero-v-cta", ".hero-v-alt"],
            { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.1 },
            "-=0.55"
          );
      };

      const t = window.setTimeout(play, 180);
      return () => window.clearTimeout(t);
    },
    { scope: root }
  );

  return (
    <section className="hero-v" id="top" ref={root} style={{ visibility: "hidden" }}>
      <div className="hero-v-bg" aria-hidden="true">
        <div className="hero-mist" />
        <BoomerangVideoBg src={HERO_VIDEO} className="hero-v-video" />
        <div className="hero-v-scrim" />
      </div>

      <header className="hero-nav">
        <a href="#top" className="hero-logo">
          {NAV.brand}
        </a>
        <nav className="hero-pill">
          {NAV.links.map((l) => (
            <a key={l.href} href={l.href} className="hero-pill-link">
              {l.label}
            </a>
          ))}
          <a href="#final" className="hero-pill-cta">
            {NAV.cta}
          </a>
        </nav>
      </header>

      <div className="hero-v-copy">
        <div className="hero-v-title-wrap">
          <h1 className="hero-v-title" aria-label="Здесь покупают не дом, а горизонт">
            <span className="line" aria-hidden="true">
              Здесь покупают
            </span>
            <span className="line" aria-hidden="true">
              не дом, а <span className="hero-v-key">горизонт</span>
            </span>
          </h1>
        </div>
        <p className="hero-v-sub">{HERO.lead}</p>
      </div>

      <div className="hero-v-cta">
        <p className="hero-v-cta-label">
          <span className="hero-v-cta-dot" aria-hidden="true" />
          {HERO.kicker}
        </p>
        <p className="hero-v-cta-text">{HERO.ctaText}</p>
        <div className="hero-v-cta-row">
          <a href="#final" className="btn-fill">
            Записаться на просмотр
          </a>
          <a href="#manifest" className="btn-text">
            Как устроен посёлок
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      <p className="hero-v-alt">{HERO.altLine}</p>
    </section>
  );
}
