"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { HERO } from "@/lib/content";

/*
  Hero. Кинетика заголовка «ВЫСОТА»: буквы въезжают снизу со сдвигом, kicker/
  lead/подсказка проявляются следом. Интро стартует по событию «vysota:enter»
  (в момент ухода прелоадера), либо сразу, если прелоадер уже открылся/выключен.
*/
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const letters = Array.from(HERO.title);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        gsap.set(el, { autoAlpha: 1 });
        gsap.set([".ch", ".hero-kicker", ".hero-lead", ".hero-scroll"], { autoAlpha: 1, y: 0, yPercent: 0 });
        return;
      }

      gsap.set(el, { autoAlpha: 1 });

      const play = () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(".ch", { yPercent: 118, autoAlpha: 0, duration: 1.15, stagger: 0.06 })
          .from(".hero-kicker", { y: 20, autoAlpha: 0, duration: 0.9 }, "-=0.7")
          .from(".hero-lead", { y: 24, autoAlpha: 0, duration: 1 }, "-=0.75")
          .from(".hero-scroll", { autoAlpha: 0, duration: 0.9 }, "-=0.7");
      };

      const flagged = (window as unknown as { __vysotaReady?: boolean }).__vysotaReady;
      if (flagged) {
        play();
      } else {
        window.addEventListener("vysota:enter", play, { once: true });
        // Подстраховка, если событие не пришло.
        const t = window.setTimeout(() => {
          window.removeEventListener("vysota:enter", play);
          play();
        }, 4200);
        return () => {
          window.removeEventListener("vysota:enter", play);
          window.clearTimeout(t);
        };
      }
    },
    { scope: root }
  );

  return (
    <section className="hero container section" id="top" ref={root} style={{ visibility: "hidden" }}>
      <div className="hero-kicker eyebrow eyebrow-dot">{HERO.kicker}</div>
      <h1 className="hero-title" aria-label={HERO.title}>
        {letters.map((ch, i) => (
          <span className="ch" key={i} aria-hidden="true">
            {ch}
          </span>
        ))}
      </h1>
      <div className="hero-foot">
        <p className="hero-lead lead">{HERO.lead}</p>
        <div className="hero-scroll">
          <span>{HERO.scrollHint}</span>
          <span className="hero-scroll-line" />
        </div>
      </div>
    </section>
  );
}
