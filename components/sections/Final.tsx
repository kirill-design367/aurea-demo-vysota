import { FINAL } from "@/lib/content";
import Reveal from "../ui/Reveal";

/*
  Финал — приглашение приехать. Форма демонстрационная: ничего не отправляет
  (это витрина для портфолио). Кнопка — type=button, без обработчика.
*/
export default function Final() {
  return (
    <section className="final container section" id="final">
      <div className="final-grid">
        <Reveal className="final-copy" y={28}>
          <p className="eyebrow eyebrow-dot">{FINAL.kicker}</p>
          <h2>{FINAL.title}</h2>
          <p className="final-body lead">{FINAL.body}</p>

          <div className="contacts">
            {FINAL.contacts.map((c) => (
              <dl key={c.k}>
                <dt>{c.k}</dt>
                <dd>{c.v}</dd>
              </dl>
            ))}
          </div>
        </Reveal>

        <Reveal className="final-form" y={28} delay={0.1}>
          <form className="form" aria-label="Запись на просмотр (демо, не отправляется)">
            <div className="field">
              <label htmlFor="name">{FINAL.form.nameLabel}</label>
              <input id="name" name="name" type="text" placeholder={FINAL.form.namePlaceholder} autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="phone">{FINAL.form.phoneLabel}</label>
              <input id="phone" name="phone" type="tel" placeholder={FINAL.form.phonePlaceholder} autoComplete="tel" />
            </div>
            <button type="button" className="cta-line">
              <span className="cta-line-text">{FINAL.form.submit}</span>
              <span className="cta-line-arrow" aria-hidden="true">↗</span>
              <span className="cta-line-rule" aria-hidden="true" />
            </button>
            <p className="form-note">{FINAL.form.note}</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
