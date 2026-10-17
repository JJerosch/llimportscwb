import { useEffect, useState } from 'react'
import { HoverExpand } from '../ui/hover-expand'
import { Button } from '../Button'
import { ProductArt } from '../ProductArt'
import { categories, whatsappLink, type ProductKind } from '../../lib/content'
import { getProduct } from '../../lib/catalog'

/** Conteúdo da linha aberta: informações do produto em destaque à esquerda e a foto à direita. */
function Showcase({ kind, productId, label }: { kind: ProductKind; productId: number; label: string }) {
  const product = getProduct(productId)
  const [broken, setBroken] = useState(false)
  const showPhoto = product?.image && !broken

  return (
    <div className="flex h-full items-stretch justify-between gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1 md:px-4 md:py-3">
        <p className="font-ui text-xs font-medium tracking-wide text-muted uppercase">Em destaque</p>
        <div>
          <h4 className="text-[22px] leading-tight font-medium tracking-tight md:text-[34px]">
            {product?.title ?? label}
          </h4>
          {product && product.chips.length > 0 && (
            <div className="mt-3 hidden flex-wrap gap-2 md:flex">
              {product.chips.map((c) => (
                <span key={c} className="rounded-full bg-bg/70 px-3 py-1 font-ui text-xs text-muted">
                  {c}
                </span>
              ))}
            </div>
          )}
          <Button
            href={whatsappLink(`Olá! Quero consultar o valor do ${product?.name ?? label}.`)}
            target="_blank"
            rel="noreferrer"
            variant="outline"
            className="mt-4 h-10 px-5 text-[13px] md:mt-6 md:h-[50px] md:px-6 md:text-[15px]"
          >
            Consultar valor
          </Button>
        </div>
      </div>
      <div className="relative aspect-square h-full shrink-0 overflow-hidden rounded-[22px] bg-ph dark:bg-white">
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
  const [mediaHeight, setMediaHeight] = useState(380)
  useEffect(() => {
    const mq = matchMedia('(max-width: 767px)')
    const update = () => setMediaHeight(mq.matches ? 220 : 380)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return (
    <section id="categorias" className="py-[88px] md:py-[120px]">
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
            media: <Showcase kind={c.kind} productId={c.productId} label={c.label} />,
          }))}
        />
      </div>
    </section>
  )
}
