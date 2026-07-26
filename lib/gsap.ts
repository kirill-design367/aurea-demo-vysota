"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
  Единый источник GSAP для проекта ВЫСОТА. Регистрируем ScrollTrigger один раз
  (идемпотентно) и на клиенте. Все сцены тянут gsap/ScrollTrigger отсюда, чтобы
  плагин точно был подключён к тому же инстансу.
*/
let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  // Не «догоняем» после лага — иначе scrub рвётся на тяжёлых кадрах.
  gsap.ticker.lagSmoothing(0);
  registered = true;
}

registerGsap();

export { gsap, ScrollTrigger };
