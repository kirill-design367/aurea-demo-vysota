import { Cormorant, Manrope, JetBrains_Mono } from "next/font/google";

/*
  Типографика ВЫСОТА (кириллица проверена, self-host через next/font):
  — Cormorant: тонкая высококонтрастная антиква = «разрежённый воздух», высота, люкс. Дисплей.
  — Manrope: чистый геометрический гротеск. Текст/UI.
  — JetBrains Mono: моноширинный «прибор» для отметок высоты и меток. Данные.
*/
export const display = Cormorant({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

export const body = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});
