import { Onest, JetBrains_Mono } from "next/font/google";

/*
  Типографика ВЫСОТА v4 — под новый видео-hero в духе Neue Haas Grotesk.
  Neue Haas без кириллицы, поэтому берём близкий по духу гротеск с полной
  кириллицей (Ё, заглавные проверены):

  — Onest: чистый плотный нео-гротеск, отлично держит отрицательный трекинг в
    заголовках и читаемый в мелком кегле. Латиница + кириллица. Заголовки и текст.
  — JetBrains Mono: приборный моноширинный — отметки высоты.

  Платный апгрейд под Neue Haas (если захотите загрузить): TT Norms Pro или
  Suisse Int'l — оба с кириллицей, точнее по характеру.
*/
export const display = Onest({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const body = Onest({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});
