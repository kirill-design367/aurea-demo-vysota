"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/*
  Появление на скролле. По умолчанию — мягкий подъём + проявление. Если задан
  stagger, анимируются прямые дети по очереди. Уважает prefers-reduced-motion
  (тогда просто показываем без движения).
*/
export default function Reveal({
  children,
  as: Tag = "div",
  className,
  y = 34,
  delay = 0,
  stagger,
  start = "top 84%",
  id,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  y?: number;
  delay?: number;
  stagger?: number;
  start?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }
      const targets = stagger ? Array.from(el.children) : el;
      gsap.set(el, { autoAlpha: 1 });
      gsap.from(targets, {
        yPercent: 0,
        y,
        autoAlpha: 0,
        duration: 1.1,
        delay,
        ease: "power3.out",
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className} id={id} style={{ visibility: "hidden" }}>
      {children}
    </Tag>
  );
}
