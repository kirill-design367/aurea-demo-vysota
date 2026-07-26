import { Prata, Golos_Text, JetBrains_Mono } from "next/font/google";

/*
  Типографика ВЫСОТА v2 — премиум под видовую недвижимость, кириллица проверена
  (включая Ё и заглавные), self-host через next/font.

  — Prata: высококонтрастная антиква в духе Didone. Тонкие волосяные штрихи +
    крупные засечки = «дорого и уверенно», фэшн-люкс. Дисплей/заголовки.
    Родная кириллица (ParaType), Ё есть. Один вес — работаем масштабом и
    трекингом, без синтетического курсива.
  — Golos Text: чистый гуманистический гротеск (ParaType), безупречная
    кириллица, спокойный и отлично читаемый. Текст/UI.
  — JetBrains Mono: моноширинный «приборный» — отметки высоты и метки.
*/
export const display = Prata({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

export const body = Golos_Text({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});
