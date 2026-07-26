import { INFRA } from "@/lib/content";
import Reveal from "../ui/Reveal";

export default function Infrastructure() {
  return (
    <section className="container section section-pad" id="infra">
      <Reveal className="infra-head" y={22}>
        <div>
          <p className="eyebrow eyebrow-dot">{INFRA.kicker}</p>
          <h2 style={{ marginTop: "0.5em" }}>{INFRA.title}</h2>
        </div>
      </Reveal>

      <Reveal className="infra-grid" stagger={0.08} y={30}>
        {INFRA.items.map((it, i) => (
          <div className="infra-item" key={it.k}>
            <span className="infra-num">{String(i + 1).padStart(2, "0")}</span>
            <h3>{it.k}</h3>
            <p>{it.v}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
