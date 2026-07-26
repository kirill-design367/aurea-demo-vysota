import type { Metadata, Viewport } from "next";
import { display, body, mono } from "./fonts";
import { SITE } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description:
    "ВЫСОТА — клубный посёлок видовых домов на горном склоне. Здесь покупают не дом, а горизонт. Демо-лендинг AUREA Studio.",
  applicationName: SITE.name,
  authors: [{ name: "AUREA Studio" }],
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: "Здесь покупают не дом, а горизонт.",
    type: "website",
    locale: "ru_RU",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
