/** @type {import('next').NextConfig} */

/*
  ВЫСОТА — демо-лендинг для портфолио. Отдельный проект.
  По умолчанию — обычная Node-сборка (npm run build / start).
  Статический экспорт для превью/Pages включается флагом NEXT_OUTPUT=export
  (тогда images.unoptimized). BasePath — для размещения в подпапке.
*/
const isExport = process.env.NEXT_OUTPUT === "export";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  ...(isExport ? { output: "export" } : {}),
  trailingSlash: true,
  images: isExport ? { unoptimized: true } : { formats: ["image/avif", "image/webp"] },
  ...(isExport && basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
