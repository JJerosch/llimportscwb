import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { ProductCard } from '../ProductCard'
import { launches } from '../../lib/content'
import { getProduct } from '../../lib/catalog'

const GAP = 16

function Arrow({ dir, disabled, onClick }: { dir: 'prev' | 'next'; disabled: boolean; onClick: () => void }) {
  const Icon = dir === 'prev' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Produtos anteriores' : 'Próximos produtos'}
      className="grid size-11 place-items-center rounded-full border border-line bg-bg text-fg shadow-[var(--shadow-float)] transition hover:bg-surface disabled:pointer-events-none disabled:opacity-35"
    >
      <Icon size={20} />
    </button>
  )
}

export function Lancamentos() {
  const track = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  const [edges, setEdges] = useState({ start: true, end: false })

  const update = () => {
    const el = track.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    if (card) setPage(Math.round(el.scrollLeft / (card.offsetWidth + GAP)))
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
  }

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Cada clique anda um card; o scroll-smooth do trilho faz a transição suave.
  const step = (dir: 1 | -1) => {
    const el = track.current
    const card = el?.firstElementChild as HTMLElement | null
    if (!el || !card) return
    el.scrollBy({ left: dir * (card.offsetWidth + GAP), behavior: 'smooth' })
  }

  return (
    <section id="lancamentos" className="pt-10 pb-[72px] md:pt-12 md:pb-[96px]">
      <div className="container-ll">
        <div className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <h2 className="h-display text-[40px] md:text-[64px]">Produtos disponíveis</h2>
          <div className="max-w-[420px]">
            <p className="text-base leading-relaxed text-muted">
              Os lançamentos chegam aqui primeiro. Como os valores mudam toda semana, o preço do dia é passado no
              atendimento.
            </p>
            <div className="mt-4 flex items-center justify-between gap-4">
              <Link to="/catalogo" className="font-ui text-sm font-medium underline underline-offset-4">
                Explore o catálogo completo
              </Link>
              <div className="flex gap-2">
                <Arrow dir="prev" disabled={edges.start} onClick={() => step(-1)} />
                <Arrow dir="next" disabled={edges.end} onClick={() => step(1)} />
              </div>
            </div>
          </div>
        </div>

        {/* Carrossel com snap: ~1 card no mobile, 2 no tablet, 4 no desktop. O py dá espaço para a sombra do hover. */}
        <div
          ref={track}
          onScroll={update}
          className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 py-3 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {launches.map((l) => (
            <ProductCard
              key={l.productId}
              title={l.name}
              fullName={getProduct(l.productId)?.name}
              chips={l.chips}
              kind={l.kind}
              image={getProduct(l.productId)?.image}
              className="w-[84%] shrink-0 snap-start md:w-[calc((100%-16px)/2)] lg:w-[calc((100%-48px)/4)]"
            />
          ))}
        </div>
        <div className="mt-5 flex justify-center gap-1.5 md:hidden" aria-hidden>
          {launches.map((l, i) => (
            <span
              key={l.productId}
              className={cn('h-1.5 rounded-full transition-all', i === page ? 'w-6 bg-fg' : 'w-1.5 bg-surface-2')}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
