import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { ProductCard } from '../ProductCard'
import { launches } from '../../lib/content'
import { getProduct } from '../../lib/catalog'

export function Lancamentos() {
  const track = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)

  const onScroll = () => {
    const el = track.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    if (!card) return
    setPage(Math.round(el.scrollLeft / (card.offsetWidth + 16)))
  }

  return (
    <section id="lancamentos" className="py-[72px] md:py-[96px]">
      <div className="container-ll">
        <div className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:min-h-[300px] md:flex-row md:items-end">
          <h2 className="h-display text-[40px] md:text-[64px]">iPhone em Curitiba</h2>
          <div className="max-w-[420px]">
            <p className="text-base leading-relaxed text-muted">
              Os lançamentos chegam aqui primeiro. Como os valores mudam toda semana, o preço do dia é passado no
              atendimento.
            </p>
            <Link to="/catalogo" className="mt-4 inline-block font-ui text-sm font-medium underline underline-offset-4">
              Explore + modelos de iPhone
            </Link>
          </div>
        </div>

        {/* Mobile: carrossel com snap e paginação. Desktop: 4 colunas. */}
        <div
          ref={track}
          onScroll={onScroll}
          className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {launches.map((l) => (
            <ProductCard
              key={l.name}
              title={l.name}
              fullName={getProduct(l.productId)?.name}
              chips={l.chips}
              kind="iphone"
              image={getProduct(l.productId)?.image}
              className="w-[84%] shrink-0 snap-center md:w-auto"
            />
          ))}
        </div>
        <div className="mt-5 flex justify-center gap-1.5 md:hidden" aria-hidden>
          {launches.map((l, i) => (
            <span
              key={l.name}
              className={cn('h-1.5 rounded-full transition-all', i === page ? 'w-6 bg-fg' : 'w-1.5 bg-surface-2')}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
