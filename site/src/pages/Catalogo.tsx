import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { cn } from '../lib/cn'
import { catalogCategories, getCatalog, groupByCategory, type CatalogCategory } from '../lib/catalog'

const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function Catalogo() {
  const all = useMemo(() => getCatalog(), [])
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')

  const requested = params.get('categoria')
  const category = catalogCategories.some((c) => c.id === requested) ? (requested as CatalogCategory) : null

  const setCategory = (id: CatalogCategory | null) => {
    const next = new URLSearchParams(params)
    if (id) next.set('categoria', id)
    else next.delete('categoria')
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    return all.filter((p) => (!category || p.category === category) && (!q || normalize(`${p.name} ${p.chips.join(' ')}`).includes(q)))
  }, [all, category, query])

  const groups = groupByCategory(filtered)
  const kindOf = Object.fromEntries(catalogCategories.map((c) => [c.id, c.kind]))
  const countOf = (id: CatalogCategory) => all.filter((p) => p.category === id).length

  const tabs: { id: CatalogCategory | null; label: string; count: number }[] = [
    { id: null, label: 'Todos', count: all.length },
    ...catalogCategories.map((c) => ({ id: c.id, label: c.label, count: countOf(c.id) })),
  ]

  return (
    <main className="pt-[140px] pb-10 md:pt-[180px]">
      <div className="container-ll">
        <header className="mb-10 flex flex-col justify-between gap-5 md:mb-14 md:flex-row md:items-end">
          <h1 className="h-display text-[46px] md:text-[80px]">Catálogo</h1>
          <p className="max-w-[420px] text-base leading-relaxed text-muted">
            Toda a linha Apple em um só lugar. Como os valores mudam toda semana, o preço do dia é passado no
            atendimento.
          </p>
        </header>

        <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-center md:justify-between">
          <div role="group" aria-label="Filtrar por categoria" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
            {tabs.map((t) => {
              const active = t.id === category
              return (
                <button
                  key={t.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(t.id)}
                  className={cn(
                    'shrink-0 rounded-full px-4 py-2.5 font-ui text-sm font-medium whitespace-nowrap transition',
                    active ? 'bg-btn-bg text-btn-fg' : 'bg-surface text-muted hover:text-fg',
                  )}
                >
                  {t.label} <span className={cn('ml-1 text-xs', active ? 'opacity-70' : 'text-subtle')}>{t.count}</span>
                </button>
              )
            })}
          </div>

          <label className="relative block md:w-[300px]">
            <span className="sr-only">Buscar no catálogo</span>
            <Search size={18} strokeWidth={1.75} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar modelo, cor ou chip"
              className="h-[46px] w-full rounded-full border border-field bg-transparent pr-4 pl-11 font-ui text-sm text-fg outline-none transition placeholder:text-subtle focus:border-fg"
            />
          </label>
        </div>

        {groups.length === 0 ? (
          <div className="rounded-[28px] bg-surface px-6 py-16 text-center" role="status">
            <p className="text-2xl font-medium tracking-tight">Nenhum modelo encontrado</p>
            <p className="mt-2 text-muted">Tente outro termo ou fale com a gente: a gente encontra o que você procura.</p>
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setCategory(null)
              }}
              className="mt-6 font-ui text-sm font-medium underline underline-offset-4"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-20 md:gap-28">
            {groups.map((group) => (
              <section key={group.id} id={group.id} aria-labelledby={`cat-${group.id}`}>
                <div className="mb-8 flex items-baseline justify-between border-b border-line pb-5">
                  <h2 id={`cat-${group.id}`} className="h-display text-[34px] md:text-[48px]">
                    {group.label}
                  </h2>
                  <span className="font-ui text-sm text-muted">
                    {group.items.length} {group.items.length === 1 ? 'modelo' : 'modelos'}
                  </span>
                </div>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {group.items.map((p) => (
                    <li key={p.id} className="flex">
                      <ProductCard
                        title={p.title}
                        fullName={p.name}
                        chips={p.chips}
                        kind={kindOf[p.category]}
                        image={p.image}
                        className="w-full"
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
