"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";

/*
  Инерционный smooth-scroll (Lenis), синхронизированный с GSAP ScrollTrigger:
  единый RAF-источник — gsap.ticker (Lenis c autoRaf:false). Это обязательно,
  чтобы scrub-параллакс и пиннинг не дрожали. При prefers-reduced-motion Lenis
  не сглаживает — нативный скролл, статика.
*/
function LenisGsapBridge() {
  const lenis = useLenis();

  useEffect(() => {
    registerGsap();
    if (!lenis) return;

    (window as unknown as { __lenis?: unknown }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const drive = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(drive);
    gsap.ticker.lagSmoothing(0);

    // Всегда стартуем сверху (с вершины склона).
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    // Пересчёт триггеров после свапа шрифтов (ширины меняются → старты уезжают).
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 800);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(drive);
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <ReactLenis
      root
      autoRaf={false}
      options={{
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: !reduce,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        syncTouch: false,
      }}
    >
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  );
}
