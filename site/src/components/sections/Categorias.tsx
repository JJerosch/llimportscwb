import { useEffect, useState } from 'react'
import { HoverExpand } from '../ui/hover-expand'
import { Button } from '../Button'
import { ProductArt } from '../ProductArt'
import { categories, whatsappLink, type FeaturedSpecs, type ProductKind } from '../../lib/content'
import { cn } from '../../lib/cn'
import { getProduct } from '../../lib/catalog'

/** Quadrado de cor: moldura com sombra que acompanha o tema e o tom do aparelho dentro. */
function Swatch({ name, hex, active, onSelect }: { name: string; hex: string; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      title={name}
      aria-label={name}
      aria-pressed={active}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onSelect}
      className={cn(
        'rounded-[9px] border bg-bg p-[3px] shadow-[var(--shadow-float)] transition-colors',
        active ? 'border-fg' : 'border-line',
      )}
    >
      <span className="block size-6 rounded-[6px] ring-1 ring-black/10 ring-inset md:size-7" style={{ background: hex }} />
    </button>
  )
}

/** Conteúdo da linha aberta: ficha do produto em destaque à esquerda e a foto à direita. */
function Showcase({
  kind,
  productId,
  label,
  specs,
}: {
  kind: ProductKind
  productId: number
  label: string
  specs: FeaturedSpecs
}) {
  const product = getProduct(productId)
  const [broken, setBroken] = useState(false)
  const [color, setColor] = useState(0)
  const showPhoto = product?.image && !broken

  return (
    <div className="flex h-full items-stretch justify-between gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1 md:px-4 md:py-3">
        <div>
          <p className="font-ui text-xs font-medium tracking-wide text-muted uppercase">Em destaque</p>
          <h4 className="mt-2 text-[22px] leading-tight font-medium tracking-tight md:text-[34px]">
            {product?.title ?? label}
          </h4>
        </div>

        <div className="flex flex-col gap-4 md:gap-5">
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <div>
              <p className="font-ui text-xs text-muted">
                Cor: <span className="font-medium text-fg">{specs.colors[color]?.name}</span>
              </p>
              <div className="mt-2 flex gap-2">
                {specs.colors.map((c, i) => (
                  <Swatch key={c.name} name={c.name} hex={c.hex} active={i === color} onSelect={() => setColor(i)} />
                ))}
              </div>
            </div>
            <div>
              <p className="font-ui text-xs text-muted">{specs.options.label}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {specs.options.values.map((v) => (
                  <span
                    key={v}
                    className="rounded-full border border-line bg-bg/70 px-3 py-1.5 font-ui text-xs font-medium"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <dl className="hidden grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-4 md:grid lg:max-w-[560px]">
            {specs.details.map((d) => (
              <div key={d.label}>
                <dt className="font-ui text-xs text-muted">{d.label}</dt>
                <dd className="mt-0.5 text-[15px] leading-snug">{d.value}</dd>
              </div>
            ))}
          </dl>
          {/* No mobile só cabem as duas primeiras especificações. */}
          <p className="font-ui text-xs leading-relaxed text-muted md:hidden">
            {specs.details
              .slice(0, 2)
              .map((d) => d.value)
              .join(' · ')}
          </p>

          <Button
            href={whatsappLink(`Olá! Quero consultar o valor do ${product?.name ?? label}.`)}
            target="_blank"
            rel="noreferrer"
            variant="outline"
            className="h-10 self-start px-5 text-[13px] md:h-[50px] md:px-6 md:text-[15px]"
          >
            Consultar valor
          </Button>
        </div>
      </div>
      <div className="relative aspect-square w-[34%] shrink-0 self-start overflow-hidden rounded-[22px] bg-ph md:h-full md:w-auto md:self-stretch dark:bg-white">
        {showPhoto ? (
          <img
            src={product.image!}
            alt={product.title}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            className="size-full object-contain p-3 mix-blend-multiply md:p-5"
          />
        ) : (
          <ProductArt kind={kind} className="size-full py-6" />
        )}
      </div>
    </div>
  )
}

export function Categorias() {
  // No mobile a área de mídia fica mais baixa para a lista caber na tela.
  const [mediaHeight, setMediaHeight] = useState(440)
  useEffect(() => {
    const mq = matchMedia('(max-width: 767px)')
    const update = () => setMediaHeight(mq.matches ? 340 : 440)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return (
    <section id="categorias" className="pt-[88px] pb-10 md:pt-[120px] md:pb-12">
      <div className="container-ll">
        <div className="mb-10 flex flex-col justify-between gap-5 md:mb-14 md:flex-row md:items-start">
          <h2 className="h-display text-[40px] md:text-[64px]">O que você procura?</h2>
          <p className="max-w-[420px] text-base leading-relaxed text-muted md:pt-3">
            Trabalhamos com toda a linha Apple. Se o modelo que você quer não estiver aqui, a gente encontra.
          </p>
        </div>
        <HoverExpand
          mediaHeight={mediaHeight}
          items={categories.map((c) => ({
            key: c.kind,
            label: c.label,
            description: c.description,
            action: (
              <a
                href={whatsappLink(`Olá! Quero ver os modelos de ${c.label} disponíveis.`)}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Ver modelos
              </a>
            ),
            media: <Showcase kind={c.kind} productId={c.productId} label={c.label} specs={c.specs} />,
          }))}
        />
      </div>
    </section>
  )
}
