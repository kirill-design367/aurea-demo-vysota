"use client";

import { useRef } from "react";
import { useLenis } from "lenis/react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SITE } from "@/lib/content";

/*
  Прелоадер = восхождение на вершину. Счётчик набирает высоту 520 → 1240 м,
  полоса заполняется, затем занавес уходит вверх и открывает Hero. Событие
  «vysota:enter» запускает интро Hero ровно в момент открытия.
  При prefers-reduced-motion — мгновенно убираем занавес.
*/
const fmt = (n: number) => n.toLocaleString("ru-RU").replace(",", " ");

function signalEnter() {
  (window as unknown as { __vysotaReady?: boolean }).__vysotaReady = true;
  window.dispatchEvent(new Event("vysota:enter"));
}

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        gsap.set(el, { display: "none" });
        signalEnter();
        return;
      }

      lenis?.stop();
      const obj = { v: SITE.altBottom };
      const tl = gsap.timeline({
        onComplete: () => {
          lenis?.start();
          ScrollTrigger.refresh();
        },
      });

      gsap.set(bar.current, { scaleX: 0 });
      tl.to(
        obj,
        {
          v: SITE.altTop,
          duration: 2.1,
          ease: "power2.inOut",
          onUpdate: () => {
            if (num.current) num.current.textContent = fmt(Math.round(obj.v));
          },
        },
        0
      )
        .to(bar.current, { scaleX: 1, duration: 2.1, ease: "power2.inOut" }, 0)
        .to(".preloader-label", { autoAlpha: 0, duration: 0.5 }, "+=0.15")
        .to(".preloader-inner", { yPercent: -8, autoAlpha: 0, duration: 0.7, ease: "power2.in" }, "-=0.1")
        .add(signalEnter, "-=0.35")
        .to(el, { yPercent: -100, duration: 1.0, ease: "power4.inOut" }, "-=0.45")
        .set(el, { display: "none" });
    },
    { scope: root }
  );

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="preloader-inner">
        <div className="preloader-count">
          <span ref={num}>{fmt(SITE.altBottom)}</span>
          <small>м над уровнем моря</small>
        </div>
        <div className="preloader-label">Восхождение · ВЫСОТА</div>
        <div className="preloader-bar">
          <span ref={bar} />
        </div>
      </div>
    </div>
  );
}
