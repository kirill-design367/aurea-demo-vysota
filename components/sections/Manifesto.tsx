"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { MANIFESTO } from "@/lib/content";

/*
  Манифест. Строки въезжают из-под маски по скроллу (line-mask reveal). Последняя
  строка — акцентная (тёплый цвет), кода мысли: «Вид — нельзя».
*/
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.from(el.querySelectorAll(".ln > span"), {
        yPercent: 115,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 72%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section className="manifesto container section section-pad" id="manifest" ref={root}>
      <div className="container-narrow" style={{ paddingInline: 0 }}>
        <p className="eyebrow eyebrow-dot" style={{ marginBottom: "clamp(28px,5vh,56px)" }}>
          {MANIFESTO.kicker}
        </p>
        <h2 className="manifesto-lines">
          {MANIFESTO.lines.map((line, i) => (
            <span className="ln" key={i}>
              <span>{i === MANIFESTO.lines.length - 1 ? <em>{line}</em> : line}</span>
            </span>
          ))}
        </h2>
        <p className="manifesto-body lead">{MANIFESTO.body}</p>
      </div>
    </section>
  );
}
