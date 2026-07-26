"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { SITE } from "@/lib/content";
import AtmosphereParticles from "./AtmosphereParticles";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/*
  Слои фотопараллакса (прозрачные PNG, кладутся в public/layers/).
  Порядок в DOM — от дальнего к ближнему; туман между хребтом и лесом.
  y — амплитуда вертикального параллакса (%) на всю дистанцию скролла:
  дальние пики почти неподвижны, передний склон летит.
*/
const LAYERS: { key: string; src: string; cls: string; y: number; drift?: number }[] = [
  { key: "peaks", src: "/layers/layer-1-peaks.png", cls: "pl-peaks", y: -9 },
  { key: "ridge", src: "/layers/layer-2-ridge.png", cls: "pl-ridge", y: -20 },
  { key: "fog", src: "/layers/layer-4-fog.png", cls: "pl-fog", y: -30, drift: 8 },
  { key: "forest", src: "/layers/layer-3-forest.png", cls: "pl-forest", y: -44 },
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

// Кэшированный форматтер — не создаём Intl на каждом кадре скролла.
const NF = typeof Intl !== "undefined" ? new Intl.NumberFormat("ru-RU") : null;
const fmt = (n: number) => (NF ? NF.format(n) : String(n)).replace(/ /g, " ");

/* Слой-фото с graceful-падением: пока файла нет — пусто (виден туман/дымка/небо),
   как только PNG появится в /layers — подхватится сам, кроп уже задан в CSS. */
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
  const altRef = useRef<HTMLSpanElement>(null);
  const todRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();

      // Прибор высоты — дёшево: текст только при изменении + transform каретки.
      let trackH = 0;
      const measure = () => {
        const track = caretRef.current?.parentElement;
        trackH = track ? track.clientHeight : 0;
      };
      measure();
      ScrollTrigger.addEventListener("refreshInit", measure);

      let lastTod = -1;
      let lastAlt = -1;
      const updateRail = (p: number) => {
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

      // Общая длительность = 1 (позиции = доля скролла).
      tl.to({}, { duration: 1 }, 0);

      // Небо: рассвет → день → золото → закат (кросс-фейд по opacity — свет-источник).
      tl.to(".sky-day", { opacity: 1, duration: 0.3 }, 0.05)
        .to(".sky-dawn", { opacity: 0, duration: 0.3 }, 0.05)
        .to(".sky-gold", { opacity: 1, duration: 0.28 }, 0.44)
        .to(".sky-day", { opacity: 0, duration: 0.28 }, 0.44)
        .to(".sky-dusk", { opacity: 1, duration: 0.3 }, 0.72)
        .to(".sky-gold", { opacity: 0, duration: 0.3 }, 0.72);

      // Свет НА фотослоях — цветокоррекция наложением (blend), той же дугой времени.
      tl.to(".grade-day", { opacity: 1, duration: 0.3 }, 0.05)
        .to(".grade-dawn", { opacity: 0, duration: 0.3 }, 0.05)
        .to(".grade-gold", { opacity: 1, duration: 0.28 }, 0.44)
        .to(".grade-day", { opacity: 0, duration: 0.28 }, 0.44)
        .to(".grade-dusk", { opacity: 1, duration: 0.3 }, 0.72)
        .to(".grade-gold", { opacity: 0, duration: 0.3 }, 0.72);

      // Солнце проявляется к золотому часу и садится.
      tl.to(".sun", { opacity: 0.95, duration: 0.35 }, 0.4)
        .to(".sun", { opacity: 0.4, duration: 0.25 }, 0.82)
        .to(".sun", { yPercent: 26, duration: 0.62 }, 0.4);

      // Фотослои — сквозной вертикальный параллакс, разная скорость = глубина.
      LAYERS.forEach((L) => tl.to("." + L.cls, { yPercent: L.y, duration: 1 }, 0));
      // Дымка-плейсхолдер (пока нет фото) тоже уходит по скроллу.
      tl.to(".haze-1", { yPercent: -18, duration: 1 }, 0).to(".haze-2", { yPercent: -40, duration: 1 }, 0);

      // Живой дрейф тумана/дымки (не привязан к скроллу) — только transform.
      const drift = [
        gsap.to(".pl-fog", { xPercent: 8, duration: 32, repeat: -1, yoyo: true, ease: "sine.inOut" }),
        gsap.to(".haze-1", { xPercent: 10, duration: 30, repeat: -1, yoyo: true, ease: "sine.inOut" }),
        gsap.to(".haze-2", { xPercent: -13, duration: 42, repeat: -1, yoyo: true, ease: "sine.inOut" }),
      ];

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", measure);
        drift.forEach((t) => t.kill());
      };
    },
    { scope: root }
  );

  return (
    <div ref={root} aria-hidden="true">
      {/* ── Фон-пейзаж ── */}
      <div className="scene">
        {/* Небо — свет-источник */}
        <div className="sky sky-dawn" />
        <div className="sky sky-day" />
        <div className="sky sky-gold" />
        <div className="sky sky-dusk" />
        <div className="sun" />

        {/* Дымка-подложка (атмосфера + плейсхолдер до загрузки фотослоёв) */}
        <div className="haze haze-1" />

        {/* Фотослои: пики → хребет → туман → лес */}
        <Layer src={LAYERS[0].src} cls={LAYERS[0].cls} />
        <Layer src={LAYERS[1].src} cls={LAYERS[1].cls} />
        <div className="haze haze-2" />
        <Layer src={LAYERS[2].src} cls={LAYERS[2].cls} />
        <Layer src={LAYERS[3].src} cls={LAYERS[3].cls} />

        {/* Цветокоррекция света на фотослоях (blend) */}
        <div className="grade grade-dawn" />
        <div className="grade grade-day" />
        <div className="grade grade-gold" />
        <div className="grade grade-dusk" />

        <div className="scene-floor" />
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
