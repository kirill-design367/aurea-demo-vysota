"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ARCHITECTURE } from "@/lib/content";
import Placeholder from "../ui/Placeholder";
import Reveal from "../ui/Reveal";

const LAYOUT = ["tall", "tall", "wide span2", "wide span2"];

function Shot({
  shot,
  cls,
  index,
}: {
  shot: { w: number; h: number; label: string; src?: string; pos?: string };
  cls: string;
  index: number;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.set(el, { autoAlpha: 1 });
      if (reduce) return;

      gsap.from(el, {
        y: 46,
        autoAlpha: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      gsap.fromTo(
        el.querySelector(".ph"),
        { scale: 1.14, yPercent: -6 },
        {
          scale: 1,
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
      // Проявление маской: кадр раскрывается снизу вверх при входе в вид.
      gsap.from(el.querySelector(".ph"), {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.3,
        ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 84%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <div className={`arch-shot ${cls}`} ref={root} style={{ visibility: "hidden" }}>
      <Placeholder
        w={shot.w}
        h={shot.h}
        label={shot.label}
        src={shot.src}
        pos={shot.pos}
        corner={`0${index + 1}`}
      />
    </div>
  );
}

export default function Architecture() {
  return (
    <section className="container section section-pad" id="arhitektura">
      <Reveal className="arch-head" y={24}>
        <p className="eyebrow eyebrow-dot">{ARCHITECTURE.kicker}</p>
        <h2>{ARCHITECTURE.title}</h2>
        <p className="lead">{ARCHITECTURE.body}</p>
      </Reveal>

      <div className="arch-grid">
        {ARCHITECTURE.shots.map((shot, i) => (
          <Shot key={i} shot={shot} cls={LAYOUT[i] ?? "wide"} index={i} />
        ))}
      </div>
    </section>
  );
}
