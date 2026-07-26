"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { SITE } from "@/lib/content";
import AtmosphereParticles from "./AtmosphereParticles";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/* Слои фотопараллакса (прозрачные PNG, кладутся в public/layers/). */
const LAYERS: { key: string; src: string; cls: string; y: number }[] = [
  { key: "peaks", src: "/layers/layer-1-peaks.png", cls: "pl-peaks", y: -9 },
  { key: "ridge", src: "/layers/layer-2-ridge.png", cls: "pl-ridge", y: -20 },
  { key: "fog", src: "/layers/layer-4-fog.png", cls: "pl-fog", y: -30 },
  { key: "forest", src: "/layers/layer-3-forest.png", cls: "pl-forest", y: -44 },
];

const TOD = ["Рассвет", "Утро", "Золотой час", "Закат"];

/* Разделы = отметки на шкале высотомера (навигация встроена в концепт). */
const MARKS: { id: string; label: string; cta?: boolean }[] = [
  { id: "top", label: "Вершина" },
  { id: "manifest", label: "Манифест" },
  { id: "urovni", label: "Уровни" },
  { id: "arhitektura", label: "Архитектура" },
  { id: "infra", label: "Посёлок" },
  { id: "final", label: "Записаться", cta: true },
];

/* Минорные штрихи шкалы — только фактура, без чисел. */
const STEP = 40;
const ticks: number[] = [];
for (let a = SITE.altTop; a >= SITE.altBottom; a -= STEP) {
  ticks.push((SITE.altTop - a) / (SITE.altTop - SITE.altBottom));
}

const NF = typeof Intl !== "undefined" ? new Intl.NumberFormat("ru-RU") : null;
const fmt = (n: number) => (NF ? NF.format(n) : String(n)).replace(/ /g, " ");
const altAt = (frac: number) => Math.round(SITE.altTop + (SITE.altBottom - SITE.altTop) * frac);

function Layer({ src, cls }: { src: string; cls: string }) {
  const [ok, setOk] = useState(true);
  return (
    <div className={`player ${cls}`}>
      {ok && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={BASE + src} alt="" draggable={false} onError={() => setOk(false)} />
      )}
    </div>
  );
}

export default function Scene() {
  const root = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);
  const todRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const markRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const markFracs = useRef<number[]>([]);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.5 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  useGSAP(
    () => {
      registerGsap();

      let trackH = 0;
      let heroExit = 0.12; // доля скролла, после которой уходит hero и появляется прибор
      const measure = () => {
        const track = caretRef.current?.parentElement;
        trackH = track ? track.clientHeight : 0;
        // Позиции разделов на шкале = их доля скролла.
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const hero = document.getElementById("top");
        if (hero && max > 0) heroExit = Math.min(0.5, (hero.offsetHeight * 0.55) / max);
        MARKS.forEach((m, i) => {
          const sec = document.getElementById(m.id);
          const btn = markRefs.current[i];
          if (!btn) return;
          const frac = sec && max > 0 ? Math.min(1, Math.max(0, sec.offsetTop / max)) : (i === 0 ? 0 : 1);
          markFracs.current[i] = frac;
          btn.style.top = `${frac * 100}%`;
          const altEl = btn.querySelector(".mark-alt");
          if (altEl) altEl.textContent = fmt(altAt(frac));
        });
      };
      measure();
      ScrollTrigger.addEventListener("refreshInit", measure);

      let lastTod = -1;
      let lastAlt = -1;
      let activeMark = -2;
      const updateRail = (p: number) => {
        // Прибор появляется, когда уходит hero-кадр (светлый видеофон).
        railRef.current?.classList.toggle("is-on", p > heroExit);
        const alt = Math.round(SITE.altTop + (SITE.altBottom - SITE.altTop) * p);
        if (alt !== lastAlt) {
          if (altRef.current) altRef.current.textContent = fmt(alt);
          lastAlt = alt;
        }
        const ti = p < 0.22 ? 0 : p < 0.5 ? 1 : p < 0.78 ? 2 : 3;
        if (ti !== lastTod && todRef.current) {
          todRef.current.textContent = TOD[ti];
          lastTod = ti;
        }
        if (caretRef.current && trackH > 0) {
          caretRef.current.style.transform = `translateY(${p * trackH}px)`;
        }
        // Подсветка активного раздела (последняя пройденная отметка).
        let ai = 0;
        for (let i = 0; i < markFracs.current.length; i++) {
          if (p >= markFracs.current[i] - 0.015) ai = i;
        }
        if (ai !== activeMark) {
          markRefs.current.forEach((b, i) => b?.classList.toggle("active", i === ai));
          activeMark = ai;
        }
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => updateRail(self.progress),
          onRefresh: (self) => updateRail(self.progress),
        },
      });
      tl.to({}, { duration: 1 }, 0);

      // Небо: рассвет → день → золото → закат.
      tl.to(".sky-day", { opacity: 1, duration: 0.3 }, 0.05)
        .to(".sky-dawn", { opacity: 0, duration: 0.3 }, 0.05)
        .to(".sky-gold", { opacity: 1, duration: 0.28 }, 0.44)
        .to(".sky-day", { opacity: 0, duration: 0.28 }, 0.44)
        .to(".sky-dusk", { opacity: 1, duration: 0.3 }, 0.72)
        .to(".sky-gold", { opacity: 0, duration: 0.3 }, 0.72);
      // Свет на фотослоях — цветокоррекция наложением.
      tl.to(".grade-day", { opacity: 1, duration: 0.3 }, 0.05)
        .to(".grade-dawn", { opacity: 0, duration: 0.3 }, 0.05)
        .to(".grade-gold", { opacity: 1, duration: 0.28 }, 0.44)
        .to(".grade-day", { opacity: 0, duration: 0.28 }, 0.44)
        .to(".grade-dusk", { opacity: 1, duration: 0.3 }, 0.72)
        .to(".grade-gold", { opacity: 0, duration: 0.3 }, 0.72);
      // Солнце.
      tl.to(".sun", { opacity: 0.95, duration: 0.35 }, 0.4)
        .to(".sun", { opacity: 0.4, duration: 0.25 }, 0.82)
        .to(".sun", { yPercent: 26, duration: 0.62 }, 0.4);
      // Параллакс фотослоёв + дымки.
      LAYERS.forEach((L) => tl.to("." + L.cls, { yPercent: L.y, duration: 1 }, 0));
      tl.to(".haze-1", { yPercent: -18, duration: 1 }, 0).to(".haze-2", { yPercent: -40, duration: 1 }, 0);

      const drift = [
        gsap.to(".pl-fog", { xPercent: 8, duration: 32, repeat: -1, yoyo: true, ease: "sine.inOut" }),
        gsap.to(".haze-1", { xPercent: 10, duration: 30, repeat: -1, yoyo: true, ease: "sine.inOut" }),
        gsap.to(".haze-2", { xPercent: -13, duration: 42, repeat: -1, yoyo: true, ease: "sine.inOut" }),
      ];

      // После загрузки шрифтов/фото высота меняется — пересчитать позиции отметок.
      const t = window.setTimeout(measure, 900);
      return () => {
        ScrollTrigger.removeEventListener("refreshInit", measure);
        drift.forEach((tw) => tw.kill());
        window.clearTimeout(t);
      };
    },
    { scope: root }
  );

  return (
    <div ref={root}>
      {/* ── Фон-пейзаж ── */}
      <div className="scene" aria-hidden="true">
        <div className="sky sky-dawn" />
        <div className="sky sky-day" />
        <div className="sky sky-gold" />
        <div className="sky sky-dusk" />
        <div className="sun" />
        <div className="haze haze-1" />
        <Layer src={LAYERS[0].src} cls={LAYERS[0].cls} />
        <Layer src={LAYERS[1].src} cls={LAYERS[1].cls} />
        <div className="haze haze-2" />
        <Layer src={LAYERS[2].src} cls={LAYERS[2].cls} />
        <Layer src={LAYERS[3].src} cls={LAYERS[3].cls} />
        <div className="grade grade-dawn" />
        <div className="grade grade-day" />
        <div className="grade grade-gold" />
        <div className="grade grade-dusk" />
        <div className="scene-floor" />
        <div className="scene-vignette" />
        <AtmosphereParticles />
      </div>

      {/* ── Высотомер = навигация ── */}
      <nav className="rail" aria-label="Навигация по высоте" ref={railRef}>
        <div className="rail-readout">
          <div className="rail-alt">
            <span ref={altRef}>{fmt(SITE.altTop)}</span>
            <small>м</small>
          </div>
          <div className="rail-tod">
            <span ref={todRef}>{TOD[0]}</span>
          </div>
        </div>

        <div className="rail-track">
          {ticks.map((frac, i) => (
            <span key={i} className="rail-tick" style={{ top: `${frac * 100}%` }} />
          ))}

          <div className="rail-caret" ref={caretRef} />

          {MARKS.map((m, i) => (
            <button
              key={m.id}
              ref={(el) => {
                markRefs.current[i] = el;
              }}
              className={`rail-mark${m.cta ? " cta" : ""}`}
              onClick={() => goTo(m.id)}
              type="button"
            >
              <span className="mark-dot" />
              <span className="mark-body">
                <span className="mark-label">{m.label}</span>
                <span className="mark-alt">{fmt(SITE.altTop)}</span>
                <i>м</i>
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
