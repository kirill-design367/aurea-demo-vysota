"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { SITE } from "@/lib/content";
import AtmosphereParticles from "./AtmosphereParticles";

/* Силуэты гряд (viewBox 1440×600), от дальней к ближней. */
const RIDGES: { cls: string; fill: string; d: string }[] = [
  {
    cls: "ridge-far",
    fill: "rgba(96,120,142,0.5)",
    d: "M0,340 L160,318 L300,346 L460,300 L620,338 L780,292 L940,330 L1100,296 L1260,332 L1440,306 L1440,600 L0,600Z",
  },
  {
    cls: "ridge-mid",
    fill: "rgba(52,72,94,0.72)",
    d: "M0,318 L120,286 L260,320 L380,246 L520,300 L660,214 L800,286 L940,232 L1080,296 L1240,236 L1380,290 L1440,268 L1440,600 L0,600Z",
  },
  {
    cls: "ridge-near",
    fill: "rgba(22,32,44,0.92)",
    d: "M0,300 L110,244 L240,296 L360,196 L470,268 L600,110 L720,258 L840,182 L980,272 L1120,168 L1260,268 L1380,196 L1440,252 L1440,600 L0,600Z",
  },
  {
    cls: "ridge-fore",
    fill: "#060a10",
    d: "M0,470 L180,436 L360,470 L540,428 L760,470 L980,436 L1200,472 L1440,442 L1440,600 L0,600Z",
  },
];

const TOD = ["Рассвет", "Утро", "Золотой час", "Закат"];

/* Отметки прибора высоты. */
const STEP = 40;
const ticks: { alt: number; frac: number; major: boolean }[] = [];
for (let a = SITE.altTop; a >= SITE.altBottom; a -= STEP) {
  ticks.push({
    alt: a,
    frac: (SITE.altTop - a) / (SITE.altTop - SITE.altBottom),
    major: (SITE.altTop - a) % 120 === 0,
  });
}

// Один кэшированный форматтер — не создаём Intl на каждом кадре скролла.
const NF = typeof Intl !== "undefined" ? new Intl.NumberFormat("ru-RU") : null;
const fmt = (n: number) => (NF ? NF.format(n) : String(n)).replace(/ /g, " ");

export default function Scene() {
  const root = useRef<HTMLDivElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);
  const todRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const mm = gsap.matchMedia();

      // Обновление прибора высоты — дёшево, только текст + transform каретки.
      let trackH = 0;
      const measure = () => {
        const track = caretRef.current?.parentElement;
        trackH = track ? track.clientHeight : 0;
      };
      let lastTod = -1;
      let lastAlt = -1;
      const updateRail = (p: number) => {
        const alt = Math.round(SITE.altTop + (SITE.altBottom - SITE.altTop) * p);
        // Форматируем и пишем в DOM только когда число реально изменилось.
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
      };

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { isMobile, reduce } = ctx.conditions as {
            isMobile: boolean;
            reduce: boolean;
          };

          measure();
          ScrollTrigger.addEventListener("refreshInit", measure);

          if (reduce) {
            // Статика: ясный день, без параллакса и смены света. Прибор высоты
            // всё же отслеживает нативный скролл (обновление числа — не «движение»).
            gsap.set(".sky-dawn", { opacity: 0 });
            gsap.set(".sky-day", { opacity: 1 });
            const onScroll = () => {
              const max = document.documentElement.scrollHeight - window.innerHeight;
              updateRail(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
            };
            onScroll();
            window.addEventListener("scroll", onScroll, { passive: true });
            return () => {
              window.removeEventListener("scroll", onScroll);
              ScrollTrigger.removeEventListener("refreshInit", measure);
            };
          }

          const k = isMobile ? 0.55 : 1; // множитель амплитуды параллакса

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top top",
              end: "bottom bottom",
              scrub: isMobile ? 0.5 : 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => updateRail(self.progress),
              onRefresh: (self) => updateRail(self.progress),
            },
          });

          // Держим общую длительность таймлайна = 1 (позиции = доля скролла).
          tl.to({}, { duration: 1 }, 0);

          // Небо: рассвет → день → золото → закат (кросс-фейд по opacity).
          tl.to(".sky-day", { opacity: 1, duration: 0.3 }, 0.05)
            .to(".sky-dawn", { opacity: 0, duration: 0.3 }, 0.05)
            .to(".sky-gold", { opacity: 1, duration: 0.28 }, 0.44)
            .to(".sky-day", { opacity: 0, duration: 0.28 }, 0.44)
            .to(".sky-dusk", { opacity: 1, duration: 0.3 }, 0.72)
            .to(".sky-gold", { opacity: 0, duration: 0.3 }, 0.72);

          // Солнце проявляется к золотому часу и опускается за горизонт.
          tl.to(".sun", { opacity: 0.9, duration: 0.35 }, 0.4)
            .to(".sun", { opacity: 0.35, duration: 0.25 }, 0.82)
            .to(".sun", { yPercent: 26, duration: 0.62 }, 0.4);

          // Гряды — сквозной параллакс (вся дистанция), разная глубина.
          tl.to(".ridge-far", { yPercent: -3 * k, duration: 1 }, 0)
            .to(".ridge-mid", { yPercent: -6 * k, duration: 1 }, 0)
            .to(".ridge-near", { yPercent: -11 * k, duration: 1 }, 0)
            .to(".ridge-fore", { yPercent: -18 * k, duration: 1 }, 0);

          // Туман — параллакс по вертикали.
          tl.to(".fog-1", { yPercent: -34 * k, duration: 1 }, 0)
            .to(".fog-2", { yPercent: -64 * k, duration: 1 }, 0);

          // Живой дрейф тумана (не привязан к скроллу) — воздух даже в покое.
          // ТОЛЬКО transform (translate готового размытого слоя) — без анимации
          // opacity, чтобы blended-слой не рекомпозитился на каждом кадре в покое.
          const drift: gsap.core.Tween[] = [];
          if (!isMobile) {
            drift.push(
              gsap.to(".fog-1", { xPercent: 10, duration: 28, repeat: -1, yoyo: true, ease: "sine.inOut" }),
              gsap.to(".fog-2", { xPercent: -14, duration: 36, repeat: -1, yoyo: true, ease: "sine.inOut" })
            );
          }

          return () => {
            ScrollTrigger.removeEventListener("refreshInit", measure);
            drift.forEach((t) => t.kill());
          };
        }
      );
    },
    { scope: root }
  );

  return (
    <div ref={root} aria-hidden="true">
      {/* ── Фон-пейзаж ── */}
      <div className="scene">
        <div className="sky sky-dawn" />
        <div className="sky sky-day" />
        <div className="sky sky-gold" />
        <div className="sky sky-dusk" />
        <div className="sun" />

        <div className="ridge ridge-far">
          <RidgeSvg d={RIDGES[0].d} fill={RIDGES[0].fill} />
        </div>
        <div className="fog fog-1" />
        <div className="ridge ridge-mid">
          <RidgeSvg d={RIDGES[1].d} fill={RIDGES[1].fill} />
        </div>
        <div className="ridge ridge-near">
          <RidgeSvg d={RIDGES[2].d} fill={RIDGES[2].fill} />
        </div>
        <div className="fog fog-2" />
        <div className="ridge ridge-fore">
          <RidgeSvg d={RIDGES[3].d} fill={RIDGES[3].fill} />
        </div>

        <div className="scene-vignette" />
        <AtmosphereParticles />
      </div>

      {/* ── Прибор высоты ── */}
      <div className="rail">
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
          {ticks.map((t) => (
            <div key={t.alt}>
              <div
                className={`rail-tick${t.major ? " major" : ""}`}
                style={{ top: `${t.frac * 100}%` }}
              />
              {t.major && (
                <div className="rail-tick-label" style={{ top: `${t.frac * 100}%` }}>
                  {fmt(t.alt)}
                </div>
              )}
            </div>
          ))}
          <div className="rail-caret" ref={caretRef} />
        </div>
      </div>
    </div>
  );
}

function RidgeSvg({ d, fill }: { d: string; fill: string }) {
  return (
    <svg viewBox="0 0 1440 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d={d} fill={fill} />
    </svg>
  );
}
