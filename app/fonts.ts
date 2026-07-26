import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";

/*
  Типографика ВЫСОТА v5 — TT Norms Pro (лицензионный, загружен клиентом).
  Полная кириллица во всех начертаниях (Ё/ё проверены, 220 глифов). Чистый
  плотный нео-гротеск в духе Neue Haas — держит отрицательный трекинг в
  крупных заголовках и остаётся читаемым в мелком кегле. Заголовки и текст —
  одно семейство, разные веса. Отметки высоты — моноширинный JetBrains Mono.

  Self-hosted через next/font/local (woff2 в app/fonts/), без внешних запросов.
  src должен быть литералом — next/font анализирует его статически.
*/
export const display = localFont({
  src: [
    { path: "./fonts/TTNormsPro-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/TTNormsPro-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/TTNormsPro-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/TTNormsPro-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/TTNormsPro-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

export const body = localFont({
  src: [
    { path: "./fonts/TTNormsPro-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/TTNormsPro-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/TTNormsPro-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/TTNormsPro-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/TTNormsPro-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

export const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});
