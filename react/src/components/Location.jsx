import { MapPin, Clock, ShieldAlert, ArrowRight } from 'lucide-react'
import { waLink } from '../../../shared/lib/format.js'
import { site } from '../lib/content.js'
import WhatsAppIcon from './WhatsAppIcon.jsx'

export default function Location() {
  const agendamentoLink = waLink(
    site.whatsapp,
    'Olá! Gostaria de agendar um horário para conhecer o showroom da LL Imports no Cabral.'
  )

  return (
    <section id="contato" className="section" aria-labelledby="location-title">
      <div className="container">
        <div className="location-card">
          <div className="location-info">
            <span className="section-head__tag">Showroom Privativo</span>
            <h3 id="location-title">Venha Tomar um Café e Conhecer seu Próximo Apple</h3>
            <p style={{ color: 'var(--text-2)', fontSize: 'var(--fs-sm)', lineHeight: 1.6 }}>
              Localizado em uma das regiões mais nobres de Curitiba, oferecemos estacionamento e atendimento discreto com consultor dedicado.
            </p>

            <div className="location-details">
              <div className="location-item">
                <MapPin />
                <div>
                  <strong>{site.address.street}</strong>
                  <br />
                  <span>{site.address.complement} · {site.address.district}, {site.address.city}/{site.address.state}</span>
                </div>
              </div>

              <div className="location-item">
                <Clock />
                <div>
                  <strong>Horário de Funcionamento</strong>
                  <br />
                  <span>{site.hours}</span>
                </div>
              </div>

              <div className="location-item">
                <ShieldAlert />
                <div>
                  <strong>Atendimento Exclusivo</strong>
                  <br />
                  <span>Apenas com agendamento prévio para garantir sua segurança e conforto.</span>
                </div>
              </div>
            </div>

            <a href={agendamentoLink} target="_blank" rel="noopener" className="btn btn--primary">
              <WhatsAppIcon />
              Agendar Horário no Showroom
              <ArrowRight className="btn__arrow" />
            </a>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                borderRadius: 'var(--r-lg)',
                padding: '2rem',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'inline-block',
                width: '100%'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📍</div>
              <h4 style={{ fontWeight: 600, color: 'var(--text-0)', marginBottom: '0.25rem' }}>Torre C · Cabral</h4>
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-2)', marginBottom: '1.5rem' }}>
                Fácil acesso e segurança 24h
              </p>
              <a
                href="https://maps.google.com/?q=Rua+Anita+Garibaldi+850+Cabral+Curitiba"
                target="_blank"
                rel="noopener"
                className="btn btn--ghost btn--sm"
                style={{ width: '100%' }}
              >
                Abrir no Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
