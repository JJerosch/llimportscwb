import { ArrowRight, CalendarDays, MapPin, PackageCheck, ShieldCheck, Smartphone, Star } from 'lucide-react'
import { formatPrice, splitWords, waLink } from '../../../shared/lib/format.js'
import { site, featuredProduct } from '../lib/content.js'
import RevealText from './RevealText.jsx'
import WordRotator from './WordRotator.jsx'
import MediaPlaceholder from './MediaPlaceholder.jsx'
import WhatsAppIcon from './WhatsAppIcon.jsx'

export default function Hero({ content }) {
  const before = splitWords(content.titleBefore).length
  const after = splitWords(content.titleAfter).length
  const rating = site.googleRating.toLocaleString('pt-BR', { minimumFractionDigits: 1 })

  return (
    <section id="topo" className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__spotlight" />
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />
        <div className="hero__grid" />
        <div className="hero__noise" />
        <div className="hero__fade" />
      </div>

      <div className="container hero__content">
        <span className="eyebrow">
          <span className="live-dot" aria-hidden="true" />
          {content.badge}
        </span>

        <h1 id="hero-title" className="hero__title">
          <span className="hero__line">
            <RevealText text={content.titleBefore} />{' '}
            <span className="reveal-word" style={{ '--i': before }}>
              <WordRotator words={content.rotatingWords} />
            </span>
          </span>
          <span className="hero__line">
            <RevealText text={content.titleAfter} start={before + 1} />
          </span>
          <span className="hero__line muted">
            <RevealText text={content.titleMuted} start={before + 1 + after} />
          </span>
        </h1>

        <p className="hero__subtitle">{content.subtitle}</p>

        <div className="hero__actions">
          <a
            id="hero-cta-primary"
            href={waLink(site.whatsapp, content.primaryCta.message)}
            target="_blank"
            rel="noopener"
            className="btn btn--primary"
          >
            <WhatsAppIcon />
            {content.primaryCta.label}
            <ArrowRight className="btn__arrow" />
          </a>
          <a
            id="hero-cta-secondary"
            href={waLink(site.whatsapp, content.secondaryCta.message)}
            target="_blank"
            rel="noopener"
            className="btn btn--ghost"
          >
            <CalendarDays />
            {content.secondaryCta.label}
          </a>
        </div>

        <ul className="hero__meta">
          <li>
            <MapPin />
            {site.address.district} · {site.address.city}/{site.address.state}
          </li>
          <li>
            <span className="stars" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} />
              ))}
            </span>
            {rating} no Google
          </li>
          <li>
            <ShieldCheck />
            Nota fiscal e garantia
          </li>
        </ul>

        <div className="hero__stage-wrap">
          <div className="hero__stage">
            <div className="hero__stage-inner">
              <MediaPlaceholder />

              <div className="stage-chip stage-chip--right">
                <span className="stage-chip__icon">
                  <Smartphone />
                </span>
                <span>
                  <span className="stage-chip__label">{featuredProduct.name}</span>
                  <span className="stage-chip__value">
                    {featuredProduct.price ? `a partir de ${formatPrice(featuredProduct.price)}` : 'Consulte condições'}
                  </span>
                </span>
              </div>

              <div className="stage-chip stage-chip--left">
                <span className="stage-chip__icon">
                  <PackageCheck />
                </span>
                <span>
                  <span className="stage-chip__label">Showroom</span>
                  <span className="stage-chip__value">{content.stageChip}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
