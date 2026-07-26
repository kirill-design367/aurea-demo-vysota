"use client";

import { useState } from "react";

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
  // Абсолютные /work/... не получают basePath автоматически (это не next/image),
  // поэтому под GitHub Pages (подпапка) префиксуем вручную.
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const resolvedSrc = src ? base + src : undefined;
  const showImg = !!resolvedSrc && !failed;

  return (
    <div className="ph">
      {showImg && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvedSrc}
          alt={label}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: pos,
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1)",
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
