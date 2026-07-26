"use client";

import { useEffect, useRef, useState } from "react";

/*
  Кадр под фото. Если src есть и грузится — показываем фото (с плавным
  проявлением). Если файла ещё нет (или ошибка) — аккуратный плейсхолдер с
  точной спекой (W×H и что в кадре). Так лендинг целостен и до, и после
  подстановки реальных снимков клиента: достаточно положить файл по пути src.
*/
export default function Placeholder({
  w,
  h,
  label,
  src,
  pos = "50% 50%",
  corner,
}: {
  w: number;
  h: number;
  label: string;
  src?: string;
  pos?: string;
  corner?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  // Абсолютные /work/... не получают basePath автоматически (это не next/image),
  // поэтому под GitHub Pages (подпапка) префиксуем вручную.
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const resolvedSrc = src ? base + src : undefined;
  const showImg = !!resolvedSrc && !failed;

  // Если фото уже в кэше и загрузилось до навешивания onLoad (частый случай при
  // гидратации SSR), событие load не сработает — проверяем complete вручную.
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete) {
      if (img.naturalWidth > 0) setLoaded(true);
      else setFailed(true);
    }
  }, [resolvedSrc]);

  return (
    <div className="ph">
      {showImg && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={resolvedSrc}
          alt={label}
          loading="eager"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className="ph-img"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: pos,
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      )}
      <span className="ph-corner">{corner ?? `${w}×${h}`}</span>
      {(!src || failed || !loaded) && (
        <div className="ph-meta">
          <b>IMG</b> {w}×{h} · {label}
        </div>
      )}
    </div>
  );
}
