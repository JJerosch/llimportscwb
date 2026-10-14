import { useState } from 'react'
import { MessageCircle, Check } from 'lucide-react'
import { formatPrice, waLink } from '../../../shared/lib/format.js'
import { site, categories, products } from '../lib/content.js'
import MediaPlaceholder from './MediaPlaceholder.jsx'
import WhatsAppIcon from './WhatsAppIcon.jsx'

export default function Catalog() {
  const [selectedCat, setSelectedCat] = useState('all')
  const [selectedCond, setSelectedCond] = useState('all')

  const filtered = products.filter((p) => {
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
            Consulte a cotação oficial do dia ou escolha entre aparelhos lacrados e seminovos revisados com garantia.
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
            const msg = `Olá! Gostaria de consultar a cotação e cores disponíveis para o ${prod.name} (${prod.condition === 'novo' ? 'Lacrado' : 'Seminovo'}).`
            const link = waLink(site.whatsapp, msg)

            return (
              <article key={prod.id} className="product-card">
                <div className="product-card__top">
                  <span className={`product-badge ${prod.condition === 'novo' ? 'product-badge--novo' : 'product-badge--seminovo'}`}>
                    {prod.badge || (prod.condition === 'novo' ? 'Lacrado' : 'Seminovo')}
                  </span>
                  <span className="product-warranty">{prod.warranty}</span>
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

                  <div className="product-card__tags">
                    {prod.storage?.map((st) => (
                      <span key={st} className="tag-spec">{st}</span>
                    ))}
                    {prod.colors?.slice(0, 3).map((col) => (
                      <span key={col} className="tag-spec">{col}</span>
                    ))}
                  </div>

                  <div className="product-card__footer">
                    <div>
                      <span className="product-card__price-label">
                        {prod.price ? 'À vista no Pix' : 'Cotação Diária'}
                      </span>
                      <span className="product-card__price">
                        {formatPrice(prod.price)}
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
