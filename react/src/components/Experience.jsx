import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react'

export default function Experience({ content }) {
  const getIcon = (type) => {
    switch (type) {
      case 'shield':
        return <ShieldCheck />
      case 'lock':
        return <Lock />
      default:
        return <CheckCircle2 />
    }
  }

  return (
    <section id="experiencia" className="section" aria-labelledby="experience-title">
      <div className="container">
        <div className="section-head">
          <span className="section-head__tag">{content.tag}</span>
          <h2 id="experience-title" className="section-head__title">
            {content.title}
          </h2>
          <p className="section-head__subtitle">{content.subtitle}</p>
        </div>

        <div className="trust-metrics">
          {content.metrics.map((m) => (
            <div key={m.label} className="metric-card">
              <div className="metric-card__num">{m.num}</div>
              <div className="metric-card__label">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="pillars-grid">
          {content.pillars.map((p) => (
            <div key={p.title} className="pillar-card">
              <div className="pillar-card__icon">{getIcon(p.icon)}</div>
              <h3 className="pillar-card__title">{p.title}</h3>
              <p className="pillar-card__desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
