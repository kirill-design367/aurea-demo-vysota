import { NAV } from "@/lib/content";

export default function Nav() {
  return (
    <header className="nav">
      <a href="#top" className="nav-brand">
        {NAV.brand}
      </a>
      <nav className="nav-links" aria-label="Разделы">
        {NAV.links.map((l) => (
          <a key={l.href} href={l.href} className="nav-link">
            {l.label}
          </a>
        ))}
      </nav>
      <a href="#final" className="nav-cta">
        {NAV.cta}
      </a>
    </header>
  );
}
