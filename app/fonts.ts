import { Yeseva_One, Literata, JetBrains_Mono } from "next/font/google";

/*
  Типографика ВЫСОТА v3 — характер вместо дефолта, кириллица проверена (Ё, заглавные).

  — Yeseva One: благородная антиква с высоким контрастом штриха. Дисплей/заголовки.
    Родная кириллица (Jovanny Lemonad). Не Cormorant, не «первая страница Google».
  — Literata: книжная серифная с индивидуальностью, отрисована для экрана и
    отлично читается в мелком кегле (описания, характеристики). Кириллица есть.
  — JetBrains Mono: приборный моноширинный для отметок высоты и меток.
*/
export const display = Yeseva_One({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

export const body = Literata({
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
