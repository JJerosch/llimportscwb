import { ArrowRight, Sparkles } from 'lucide-react'
import { waLink } from '../../../shared/lib/format.js'
import { site } from '../lib/content.js'
import MediaPlaceholder from './MediaPlaceholder.jsx'
import WhatsAppIcon from './WhatsAppIcon.jsx'

export default function Flagship({ content }) {
  const link = waLink(site.whatsapp, `Olá! Gostaria de consultar os valores e cores disponíveis para o ${content.title}`)

  return (
    <section id="destaque" className="section feature-flagship" aria-labelledby="flagship-title">
      <div className="container">
        <div className="flagship-grid">
          <div>
            <span className="section-head__tag">
              <Sparkles style={{ width: 14, height: 14, display: 'inline', marginRight: 4, verticalAlign: 'text-top' }} />
              {content.tag}
            </span>
            <h2 id="flagship-title" className="section-head__title" style={{ textAlign: 'left' }}>
              {content.title}
            </h2>
            <p className="section-head__subtitle" style={{ textAlign: 'left', marginLeft: 0 }}>
              {content.subtitle}
            </p>

            <div className="flagship-specs">
              {content.specs.map((spec) => (
                <div key={spec.val} className="spec-card">
                  <div className="spec-card__val">{spec.val}</div>
                  <div className="spec-card__label">{spec.label}</div>
                </div>
              ))}
            </div>

            <a href={link} target="_blank" rel="noopener" className="btn btn--primary">
              <WhatsAppIcon />
              {content.cta}
              <ArrowRight className="btn__arrow" />
            </a>
          </div>

          <div className="flagship-visual">
            <MediaPlaceholder label="Destaque Flagship · Titânio" device={true} />
          </div>
        </div>
      </div>
    </section>
  )
}
