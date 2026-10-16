import { useState } from 'react'
import { formatPrice, waLink, formatAestheticGrade, formatBattery } from '../../../shared/lib/format.js'
import { site, categories, products as defaultProducts } from '../lib/content.js'
import MediaPlaceholder from './MediaPlaceholder.jsx'
import WhatsAppIcon from './WhatsAppIcon.jsx'

export default function Catalog({ products: propProducts }) {
  const [selectedCat, setSelectedCat] = useState('all')
  const [selectedCond, setSelectedCond] = useState('all')
  const [selectedTags, setSelectedTags] = useState({})

  const allActiveProducts = (propProducts || defaultProducts).filter((p) => p.active !== false)

  const filtered = allActiveProducts.filter((p) => {
    if (selectedCat !== 'all' && p.category !== selectedCat) return false
    if (selectedCond !== 'all' && p.condition !== selectedCond) return false
    return true
  })

  return (
    <section id="catalogo" className="section" aria-labelledby="catalog-title">
      <div className="container">
        <div className="section-head">
          <span className="section-head__tag">Catálogo Inteligente</span>
          <h2 id="catalog-title" className="section-head__title">
            Modelos & Qualidades Disponíveis
          </h2>
          <p className="section-head__subtitle">
            Consulte os modelos disponíveis no showroom com tags claras de qualidade do aparelho e saúde de bateria.
          </p>
        </div>

        <div className="catalog-filters">
          <div className="filter-pills" role="tablist" aria-label="Categorias de produtos">
            <button
              type="button"
              className={`filter-btn ${selectedCat === 'all' ? 'is-active' : ''}`}
              onClick={() => setSelectedCat('all')}
            >
              Todos os Modelos
            </button>
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                className={`filter-btn ${selectedCat === c.key ? 'is-active' : ''}`}
                onClick={() => setSelectedCat(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="filter-pills" role="tablist" aria-label="Condição do produto">
            <button
              type="button"
              className={`filter-btn ${selectedCond === 'all' ? 'is-active' : ''}`}
              onClick={() => setSelectedCond('all')}
            >
              Qualquer Condição
            </button>
            <button
              type="button"
              className={`filter-btn ${selectedCond === 'novo' ? 'is-active' : ''}`}
              onClick={() => setSelectedCond('novo')}
            >
              Apenas Novos Lacrados
            </button>
            <button
              type="button"
              className={`filter-btn ${selectedCond === 'seminovo' ? 'is-active' : ''}`}
              onClick={() => setSelectedCond('seminovo')}
            >
              Seminovos Selecionados
            </button>
          </div>
        </div>

        <div className="catalog-grid">
          {filtered.map((prod) => {
            const rawTags = prod.tags || prod.units || []
            const availableTags = rawTags.filter((t) => t.is_available !== false && t.status !== 'vendido')
            const selectedTagId = selectedTags[prod.id]
            const activeTag = availableTags.find((t) => t.id === selectedTagId) || availableTags[0] || null

            // Grau do aparelho e Bateria da tag
            const devQualitySlug = activeTag?.device_quality_slug || activeTag?.aesthetic_grade
            const devQualityName = activeTag?.device_quality_name || formatAestheticGrade(devQualitySlug)
            const isNovo = devQualitySlug === 'novo_lacrado' || prod.condition === 'novo'
            
            const battLabel = activeTag?.battery_quality_name || formatBattery(activeTag?.battery_health, activeTag?.battery_cycles)
            const currentPrice = activeTag ? activeTag.price : prod.price
            const currentWarranty = activeTag?.warranty || prod.warranty

            // Link do WhatsApp com a qualidade escolhida
            let msg = ''
            if (activeTag) {
              const qualityText = devQualityName ? ` (${devQualityName})` : ''
              const batteryText = battLabel ? ` com ${battLabel}` : ''
              const priceText = currentPrice ? ` por ${formatPrice(currentPrice)}` : ''
              msg = `Olá! Vi no catálogo da LL Imports o ${prod.name}${qualityText}, ${activeTag.storage} na cor ${activeTag.color}${batteryText}${priceText}. Gostaria de confirmar disponibilidade no showroom!`
            } else {
              msg = `Olá! Gostaria de consultar a cotação e cores disponíveis para o ${prod.name} (${prod.condition === 'novo' ? 'Lacrado' : 'Seminovo'}).`
            }

            const link = waLink(site.whatsapp, msg)

            return (
              <article key={prod.id} className="product-card">
                <div className="product-card__top">
                  <span
                    className={`product-badge ${
                      isNovo ? 'product-badge--novo' : 'product-badge--seminovo'
                    }`}
                  >
                    {isNovo ? 'Novo Lacrado' : (devQualityName || 'Seminovo')}
                  </span>
                  <span className="product-warranty">{currentWarranty}</span>
                </div>

                <div className="product-card__media">
                  {prod.image_url ? (
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="product-card__img"
                      loading="lazy"
                    />
                  ) : (
                    <MediaPlaceholder label={`Mockup · ${prod.name}`} device={prod.category === 'iphone'} />
                  )}
                </div>

                <div className="product-card__body">
                  <h3 className="product-card__name">{prod.name}</h3>

                  {/* Badges de Qualidade do Aparelho & Qualidade da Bateria */}
                  <div className="product-card__meta-bar">
                    {devQualitySlug && (
                      <span className={`grade-badge grade-badge--${devQualitySlug}`}>
                        ✨ {devQualityName}
                      </span>
                    )}
                    {battLabel && (
                      <span
                        className={`battery-badge ${
                          (activeTag?.battery_health || 100) >= 90
                            ? 'battery-badge--good'
                            : 'battery-badge--medium'
                        }`}
                      >
                        🔋 {battLabel}
                      </span>
                    )}
                  </div>

                  {/* Tags gerais ou da opção selecionada */}
                  <div className="product-card__tags">
                    {activeTag ? (
                      <>
                        <span className="tag-spec">{activeTag.storage}</span>
                        <span className="tag-spec">{activeTag.color}</span>
                      </>
                    ) : (
                      <>
                        {prod.storage?.map((st) => (
                          <span key={st} className="tag-spec">{st}</span>
                        ))}
                        {prod.colors?.slice(0, 3).map((col) => (
                          <span key={col} className="tag-spec">{col}</span>
                        ))}
                      </>
                    )}
                  </div>

                  {/* Seletor de Qualidades/Tags disponíveis */}
                  {availableTags.length > 1 && (
                    <div className="product-card__units-box">
                      <div className="product-card__units-header">
                        <span>Qualidades Disponíveis ({availableTags.length})</span>
                        <span>Selecione a opção</span>
                      </div>
                      <div className="unit-chips">
                        {availableTags.map((t) => {
                          const isSelected = t.id === (activeTag?.id)
                          const tDev = t.device_quality_name || formatAestheticGrade(t.device_quality_slug || t.aesthetic_grade)
                          const tBatt = t.battery_quality_name || formatBattery(t.battery_health, t.battery_cycles)
                          return (
                            <button
                              key={t.id}
                              type="button"
                              className={`unit-chip ${isSelected ? 'is-active' : ''}`}
                              onClick={() =>
                                setSelectedTags((prev) => ({ ...prev, [prod.id]: t.id }))
                              }
                            >
                              <div className="unit-chip__main">
                                <span className="unit-chip__name">
                                  {t.storage} · {t.color}
                                </span>
                                <span className="unit-chip__sub">
                                  {tDev} {tBatt ? ` · 🔋 ${tBatt}` : ''}
                                </span>
                              </div>
                              <span className="unit-chip__price">
                                {formatPrice(t.price)}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <div className="product-card__footer">
                    <div>
                      <span className="product-card__price-label">
                        {currentPrice ? 'À vista no Pix' : 'Cotação Diária'}
                      </span>
                      <span className="product-card__price">
                        {formatPrice(currentPrice)}
                      </span>
                    </div>

                    <a
                      href={link}
                      target="_blank"
                      rel="noopener"
                      className="btn btn--primary btn--sm"
                      aria-label={`Consultar ${prod.name} no WhatsApp`}
                    >
                      <WhatsAppIcon />
                      Consultar
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
