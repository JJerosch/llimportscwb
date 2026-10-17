import { Star } from 'lucide-react'
import { Button } from '../Button'
import { ProductCard } from '../ProductCard'
import { WordRotator } from '../WordRotator'
import { OrbitalImageWheel } from '../ui/orbital-image-wheel'
import { HeroBackground } from './HeroBackground'
import { heroWords, whatsappLink } from '../../lib/content'
import { catalogCategories, getCatalog } from '../../lib/catalog'

// Produtos em destaque na roda (ids do catálogo), na ordem em que aparecem.
const FEATURED_IDS = [3372, 2728, 2682, 2716, 325, 2739, 2723]

function featured() {
  const catalog = getCatalog()
  const kindOf = Object.fromEntries(catalogCategories.map((c) => [c.id, c.kind]))
  return FEATURED_IDS.map((id) => catalog.find((p) => p.id === id))
    .filter((p) => p !== undefined)
    .map((p) => ({
      key: String(p.id),
      label: p.name,
      subtitle: 'Pronta entrega no showroom',
      content: (
        <ProductCard compact title={p.title} fullName={p.name} chips={p.chips} kind={kindOf[p.category]} image={p.image} />
      ),
    }))
}

export function Hero() {
  return (
    <section id="topo" className="relative isolate overflow-hidden pt-[150px] md:pt-[190px]">
      <HeroBackground />
      <div className="container-ll text-center">
        <h1 className="h-display mx-auto max-w-[860px] text-[46px] sm:text-[72px] lg:text-[92px]">
          {/* Leitores de tela leem a frase fixa; a palavra animada é só visual. */}
          <span className="sr-only">O Apple dos seus sonhos com a exclusividade que você merece.</span>
          <span aria-hidden>
            O <WordRotator words={heroWords} /> dos seus sonhos com a exclusividade que você merece.
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-[600px] text-[17px] leading-relaxed text-muted md:text-xl">
          Viva a experiência LL Imports. Os últimos lançamentos Apple com atendimento personalizado, segurança e as
          melhores condições de Curitiba.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button href={whatsappLink('Olá! Quero falar com um especialista da LL Imports.')} target="_blank" rel="noreferrer">
            Falar com especialista
          </Button>
          <Button href="#loja" variant="outline">
            Agende seu horário
          </Button>
        </div>
        <p className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-ui text-[13px] text-muted">
          <span className="flex gap-0.5 text-fg" aria-hidden>
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
            ))}
          </span>
          Nota 4,9 no Google e mais de 2.000 clientes atendidos em 4 anos.
        </p>
      </div>

      <OrbitalImageWheel className="mt-12 md:mt-16" items={featured()} />
    </section>
  )
}
