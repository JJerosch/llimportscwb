import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useRef, useState, type PointerEvent } from 'react'
import { cn } from '../lib/cn'
import type { ProductKind } from '../lib/content'
import { whatsappLink } from '../lib/content'
import { Button } from './Button'
import { ProductArt } from './ProductArt'

type Props = {
  title: string
  chips: string[]
  kind: ProductKind
  /** Foto do produto. Sem ela (ou se falhar ao carregar), mostra a ilustração placeholder. */
  image?: string | null
  /** Nome completo usado na mensagem do WhatsApp. */
  fullName?: string
  /** Versão reduzida para a roda do hero: preenche o espaço do pai, sem inclinação e sem a linha de parcelamento. */
  compact?: boolean
  className?: string
}

function Chip({ children, compact }: { children: string; compact?: boolean }) {
  return (
    <span
      className={cn(
        'rounded-full bg-surface-2 font-ui text-muted',
        compact ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
      )}
    >
      {children}
    </span>
  )
}

/** Card de produto: inclina levemente em direção ao cursor e ganha sombra no hover. */
export function ProductCard({ title, chips, kind, image, fullName, compact = false, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [broken, setBroken] = useState(false)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-5, 5]), { stiffness: 200, damping: 20 })

  const onMove = (e: PointerEvent) => {
    if (compact || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => {
    px.set(0)
    py.set(0)
  }

  const showPhoto = image && !broken

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={compact ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      whileHover={compact ? undefined : { y: -4 }}
      className={cn(
        'flex flex-col bg-surface transition-shadow',
        compact ? 'h-full rounded-[22px] p-2.5' : 'rounded-[28px] p-3.5 hover:shadow-[var(--shadow-card)]',
        className,
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-ph dark:bg-white',
          compact ? 'min-h-0 flex-1 rounded-[14px]' : 'h-[260px] rounded-[20px] md:h-[300px]',
        )}
      >
        {showPhoto ? (
          <img
            src={image}
            alt={title}
            loading={compact ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setBroken(true)}
            // multiply no tema claro some com o fundo branco das fotos e deixa o cinza do placeholder aparecer.
            className={cn('size-full object-contain mix-blend-multiply', compact ? 'p-2' : 'p-5')}
          />
        ) : (
          <ProductArt kind={kind} className="size-full py-6" />
        )}
      </div>
      <div className={compact ? 'px-1 pt-2.5' : 'px-1.5 pt-5'}>
        <h3 className={cn('leading-tight font-medium tracking-tight', compact ? 'truncate text-[15px]' : 'text-[22px]')}>
          {title}
        </h3>
        <div className={cn('flex flex-wrap gap-1.5', compact ? 'mt-1.5 max-h-[22px] overflow-hidden' : 'mt-3 min-h-[28px] gap-2')}>
          {chips.map((c) => (
            <Chip key={c} compact={compact}>
              {c}
            </Chip>
          ))}
        </div>
      </div>
      <div className={compact ? 'pt-2.5' : 'mt-auto pt-5'}>
        <Button
          href={whatsappLink(`Olá! Quero consultar o valor do ${fullName ?? title}.`)}
          target="_blank"
          rel="noreferrer"
          variant="outline"
          className={cn('w-full', compact && 'h-10 px-4 text-[13px]')}
        >
          Consultar valor
        </Button>
        {!compact && <p className="mt-3 text-center font-ui text-[13px] text-muted">Até 18x no cartão</p>}
      </div>
    </motion.div>
  )
}
