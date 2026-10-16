import { useState } from 'react'
import { formatPrice, waLink, formatAestheticGrade, formatBattery } from '../../../shared/lib/format.js'
import { site, categories, products as defaultProducts } from '../lib/content.js'
import MediaPlaceholder from './MediaPlaceholder.jsx'
import WhatsAppIcon from './WhatsAppIcon.jsx'

export default function Catalog({ products: propProducts }) {
  const [selectedCat, setSelectedCat] = useState('all')
  const [selectedCond, setSelectedCond] = useState('all')
  const [selectedUnits, setSelectedUnits] = useState({})

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
            Modelos Selecionados & Pronta Entrega
          </h2>
          <p className="section-head__subtitle">
            Consulte a cotação oficial do dia ou escolha entre aparelhos lacrados e seminovos com laudo de bateria e grau estético detalhado.
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
            const availableUnits = (prod.units || []).filter((u) => u.status === 'disponivel')
            const selectedUnitId = selectedUnits[prod.id]
            const activeUnit = availableUnits.find((u) => u.id === selectedUnitId) || availableUnits[0] || null

            // Dados da unidade ativa ou do modelo base
            const currentCondition = activeUnit ? activeUnit.condition : prod.condition
            const currentPrice = activeUnit ? activeUnit.price : prod.price
            const currentWarranty = activeUnit?.warranty || prod.warranty
            const currentAesthetic = activeUnit?.aesthetic_grade
            const currentBattery = activeUnit ? formatBattery(activeUnit.battery_health, activeUnit.battery_cycles) : null

            // Mensagem precisa para o WhatsApp
            let msg = ''
            if (activeUnit) {
              const condLabel = activeUnit.condition === 'novo' ? 'Novo Lacrado' : `Seminovo (${formatAestheticGrade(activeUnit.aesthetic_grade)})`
              const battLabel = currentBattery ? ` com ${currentBattery}` : ''
              const priceLabel = currentPrice ? ` por ${formatPrice(currentPrice)}` : ''
              msg = `Olá! Vi no catálogo da LL Imports o ${prod.name} (${condLabel}), ${activeUnit.storage} na cor ${activeUnit.color}${battLabel}${priceLabel}. Gostaria de confirmar a retirada no showroom!`
            } else {
              msg = `Olá! Gostaria de consultar a cotação e cores disponíveis para o ${prod.name} (${prod.condition === 'novo' ? 'Lacrado' : 'Seminovo'}).`
            }

            const link = waLink(site.whatsapp, msg)

            return (
              <article key={prod.id} className="product-card">
                <div className="product-card__top">
                  <span
                    className={`product-badge ${
                      currentCondition === 'novo' ? 'product-badge--novo' : 'product-badge--seminovo'
                    }`}
                  >
                    {prod.badge || (currentCondition === 'novo' ? 'Lacrado' : 'Seminovo')}
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

                  {/* Badges de Bateria e Grau Estético */}
                  <div className="product-card__meta-bar">
                    {currentAesthetic && (
                      <span className={`grade-badge grade-badge--${currentAesthetic}`}>
                        ✨ {formatAestheticGrade(currentAesthetic)}
                      </span>
                    )}
                    {currentBattery && (
                      <span
                        className={`battery-badge ${
                          (activeUnit?.battery_health || 100) >= 90
                            ? 'battery-badge--good'
                            : 'battery-badge--medium'
                        }`}
                      >
                        🔋 {currentBattery}
                      </span>
                    )}
                  </div>

                  {/* Tags gerais do modelo */}
                  <div className="product-card__tags">
                    {activeUnit ? (
                      <>
                        <span className="tag-spec">{activeUnit.storage}</span>
                        <span className="tag-spec">{activeUnit.color}</span>
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

                  {/* Seletor interativo de unidades em estoque */}
                  {availableUnits.length > 1 && (
                    <div className="product-card__units-box">
                      <div className="product-card__units-header">
                        <span>Unidades Disponíveis ({availableUnits.length})</span>
                        <span>Selecione a opção</span>
                      </div>
                      <div className="unit-chips">
                        {availableUnits.map((u) => {
                          const isSelected = u.id === (activeUnit?.id)
                          return (
                            <button
                              key={u.id}
                              type="button"
                              className={`unit-chip ${isSelected ? 'is-active' : ''}`}
                              onClick={() =>
                                setSelectedUnits((prev) => ({ ...prev, [prod.id]: u.id }))
                              }
                            >
                              <div className="unit-chip__main">
                                <span className="unit-chip__name">
                                  {u.storage} · {u.color}
                                </span>
                                <span className="unit-chip__sub">
                                  {formatAestheticGrade(u.aesthetic_grade)}
                                  {u.battery_health ? ` · 🔋 ${u.battery_health}% (${u.battery_cycles || 0}c)` : ''}
                                </span>
                              </div>
                              <span className="unit-chip__price">
                                {formatPrice(u.price)}
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
