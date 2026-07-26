import { NAV } from "@/lib/content";

/*
  Верхнего меню больше нет — навигация ушла в шкалу высотомера (см. Scene).
  Остаётся только минимальный вордмарк в углу как присутствие бренда.
*/
export default function Nav() {
  return (
    <a href="#top" className="brand">
      {NAV.brand}
    </a>
  );
}
