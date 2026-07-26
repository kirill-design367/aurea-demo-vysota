"use client";

import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { HERO } from "@/lib/content";

/*
  Hero — главный вау-кадр. Слово ВЫСОТА собрано лесенкой по восходящей диагонали:
  каждая буква выше предыдущей, как ступени склона, рядом мелко — отметка высоты.
  Буквы восходят по одной снизу вверх (как подъём). Подзаголовок — деликатно,
  в стороне. Интро стартует по событию «vysota:enter» (уход прелоадера).
*/
const STEPS = [
  { ch: "В", alt: "1240" },
  { ch: "Ы", alt: "1180" },
  { ch: "С", alt: "1120" },
  { ch: "О", alt: "1060" },
  { ch: "Т", alt: "1000" },
  { ch: "А", alt: "940" },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      gsap.set(el, { autoAlpha: 1 });

      const play = () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(".step-inner", {
          yPercent: 130,
          autoAlpha: 0,
          duration: 1.15,
          stagger: 0.13,
        })
          .from(".step-alt", { autoAlpha: 0, duration: 0.6, stagger: 0.13 }, 0.25)
          .from(".hero-sub", { y: 22, autoAlpha: 0, duration: 1 }, "-=0.5")
          .from(".hero-cue", { autoAlpha: 0, duration: 0.9 }, "-=0.6")
          .from(".hero-rule", { scaleX: 0, duration: 1.1, ease: "power3.inOut" }, "-=0.9");
      };

      const flagged = (window as unknown as { __vysotaReady?: boolean }).__vysotaReady;
      if (flagged) {
        play();
      } else {
        window.addEventListener("vysota:enter", play, { once: true });
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
    <section className="hero" id="top" ref={root} style={{ visibility: "hidden" }}>
      <div className="hero-stair" aria-label={HERO.title}>
        {STEPS.map((s, i) => (
          <div className="step" style={{ "--i": i } as CSSProperties} key={i}>
            <span className="step-alt">
              {s.alt}
              <i>м</i>
            </span>
            <span className="step-inner">
              <span className="step-ch" aria-hidden="true">
                {s.ch}
              </span>
            </span>
          </div>
        ))}
        <span className="hero-rule" aria-hidden="true" />
      </div>

      <p className="hero-sub">{HERO.lead}</p>

      <div className="hero-cue">
        <span>{HERO.scrollHint}</span>
        <span className="hero-cue-line" />
      </div>
    </section>
  );
}
