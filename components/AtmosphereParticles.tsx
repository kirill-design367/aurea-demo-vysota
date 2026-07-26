"use client";

import { useEffect, useRef } from "react";

/*
  Атмосферные частицы — тонкая пыль/снежинки, медленно дрейфующие в кадре.
  Даёт ощущение объёма и воздуха почти без стоимости (≤ N частиц, transform на
  канвасе). Отключается при prefers-reduced-motion и глушится на мобильных.
*/
export default function AtmosphereParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const COUNT = mobile ? 34 : 70;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0, h = 0;
    type P = { x: number; y: number; r: number; vx: number; vy: number; a: number };
    let parts: P[] = [];

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const seed = () => {
      parts = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: rnd(0.4, 1.8) * dpr,
        vx: rnd(-0.12, 0.12) * dpr,
        vy: rnd(0.05, 0.3) * dpr,
        a: rnd(0.06, 0.4),
      }));
    };

    const resize = () => {
      w = canvas.clientWidth * dpr;
      h = canvas.clientHeight * dpr;
      canvas.width = w;
      canvas.height = h;
      seed();
    };
    resize();

    let raf = 0;
    let running = true;
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > h + 4) { p.y = -4; p.x = Math.random() * w; }
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,232,240,${p.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    // Пауза, когда вкладка не видна — экономим кадры.
    const vis = () => {
      running = document.visibilityState === "visible";
      if (running) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
    };
    document.addEventListener("visibilitychange", vis);

    let rt = 0;
    const onResize = () => { clearTimeout(rt); rt = window.setTimeout(resize, 200); };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("resize", onResize);
      clearTimeout(rt);
    };
  }, []);

  return <canvas ref={ref} className="atmos" aria-hidden="true" />;
}
