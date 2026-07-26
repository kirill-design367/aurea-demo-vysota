# ВЫСОТА — демо-лендинг · AUREA Studio

Кинематографический параллакс-лендинг клубного посёлка видовых домов на горном
склоне. Демо для портфолио. Отдельный репозиторий (не связан с основным сайтом
студии).

**Живой превью:** https://kirill-design367.github.io/aurea-demo-vysota/

**Идея:** главный товар — вид, а не метры. Скролл работает как спуск по склону:
чем ниже листаешь, тем ниже отметка высоты (1240 → 520 м) и теплее свет
(рассвет → закат). Сквозной параллакс гор, плывущий туман, атмосферные частицы,
крупная типографика, реальные фото домов и интерьеров.

## Стек

Next.js 15 · React 19 · TypeScript · Tailwind 4 · GSAP + ScrollTrigger · Lenis.
Всё движение на `transform/opacity` (GPU). `prefers-reduced-motion` → статика.
Мобильный параллакс упрощён. Three.js не используется намеренно — туман/объём
достигаются SVG+CSS+GSAP при 60 fps.

## Запуск

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
```

## Деплой

GitHub Pages через Actions (`.github/workflows/deploy.yml`) — сборка статического
экспорта и публикация на каждый push в `main`. Pages включается автоматически
на первом прогоне (`configure-pages` c `enablement: true`).

## Структура

```
app/            layout, page, globals (дизайн-система), fonts, icon
components/      SmoothScroll · Scene (фон-параллакс + прибор высоты) · Preloader
                · AtmosphereParticles · Nav · sections/* · ui/*
lib/            gsap · content (весь текст, данные, пути к фото)
public/work/    фотографии домов, интерьеров и архитектуры
```

> Демо: кнопки и форма некликабельны — это витрина визуала и движения.
