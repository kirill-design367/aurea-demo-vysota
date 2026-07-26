"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { HOUSES, LEVELS, SITE, type House } from "@/lib/content";
import Placeholder from "../ui/Placeholder";
import Reveal from "../ui/Reveal";

const fmt = (n: number) => n.toLocaleString("ru-RU").replace(",", " ");

function HouseBlock({ house, from, flip }: { house: House; from: number; flip: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const alt = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      // Параллакс медиа относительно текста.
      gsap.fromTo(
        el.querySelector(".house-media"),
        { yPercent: 9 },
        {
          yPercent: -9,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
      // Лёгкий «наезд» внутри кадра.
      gsap.fromTo(
        el.querySelector(".ph"),
        { scale: 1.12 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "top 30%", scrub: true },
        }
      );

      // Отметка высоты «спускается» с предыдущего уровня к этому.
      const obj = { v: from };
      gsap.to(obj, {
        v: house.alt,
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 74%", once: true },
        onUpdate: () => {
          if (alt.current) alt.current.textContent = fmt(Math.round(obj.v));
        },
      });
    },
    { scope: root }
  );

  return (
    <article className={`house${flip ? " flip" : ""}`} ref={root}>
      <div className="house-media">
        <Placeholder
          w={house.img.w}
          h={house.img.h}
          label={house.img.label}
          src={house.img.src}
          pos={house.img.pos}
          corner={`${fmt(house.alt)} м`}
        />
      </div>
      <Reveal className="house-body" y={30}>
        <span className="house-index">Дом {house.index}</span>
        <div className="house-alt">
          <span ref={alt}>{fmt(from)}</span>
          <small>м</small>
        </div>
        <h3 className="house-name">«{house.name}»</h3>
        <div className="house-spec">
          <dl>
            <dt>Площадь</dt>
            <dd>{house.area}</dd>
          </dl>
          <dl>
            <dt>Вид</dt>
            <dd>{house.view}</dd>
          </dl>
          <dl>
            <dt>Ориентация</dt>
            <dd>{house.orient}</dd>
          </dl>
          <dl>
            <dt>Особенность</dt>
            <dd>{house.feature}</dd>
          </dl>
        </div>
      </Reveal>
    </article>
  );
}

export default function Levels() {
  return (
    <section className="container section section-pad" id="urovni">
      <Reveal className="levels-head" y={26}>
        <p className="eyebrow eyebrow-dot">{LEVELS.kicker}</p>
        <h2>{LEVELS.title}</h2>
        <p className="lead">{LEVELS.note}</p>
      </Reveal>

      <div>
        {HOUSES.map((house, i) => (
          <HouseBlock
            key={house.id}
            house={house}
            from={i === 0 ? SITE.altTop : HOUSES[i - 1].alt}
            flip={i % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}
