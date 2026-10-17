import gsap from 'gsap'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type OrbitalItem = { key: string; label: string; subtitle: string; content: ReactNode }

type Props = {
  items: OrbitalItem[]
  /** Intervalo entre cada giro, em segundos. */
  interval?: number
  className?: string
}

const SLOTS = 24

/**
 * Roda de cards: os itens ficam num arco largo e a roda gira um passo por vez (GSAP).
 * Cards longe do centro desfocam e somem; a legenda segue o card da frente.
 * Versão inicial: a animação ainda será refinada.
 */
export function OrbitalImageWheel({ items, interval = 3.2, className }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const cards = useRef<(HTMLDivElement | null)[]>([])
  const [front, setFront] = useState(0)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const state = { offset: 0 }
    let width = el.clientWidth
    let lastFront = 0

    const layout = () => {
      const compact = width < 768
      const cardW = Math.min(Math.max(width * 0.16, 150), 235)
      const cardH = cardW * 1.5
      const radius = width * (compact ? 1.1 : 0.85)
      const step = compact ? 20 : 15

      cards.current.forEach((card, slot) => {
        if (!card) return
        let angle = (slot - state.offset) * step
        // mantém o ângulo em (-180, 180] para o fade funcionar nos dois lados
        angle = ((((angle + 180) % (SLOTS * step)) + SLOTS * step) % (SLOTS * step)) - 180
        const rad = (angle * Math.PI) / 180
        const dist = Math.abs(angle) / step
        gsap.set(card, {
          width: cardW,
          height: cardH,
          x: Math.sin(rad) * radius - cardW / 2,
          y: radius - Math.cos(rad) * radius,
          rotation: angle,
          opacity: dist > 2.6 ? 0 : 1 - Math.max(0, dist - 1.6) * 0.5,
          filter: `blur(${Math.min(dist * dist * 1.4, 12)}px)`,
          zIndex: 10 - Math.round(dist),
        })
      })
      const nearest = ((Math.round(state.offset) % SLOTS) + SLOTS) % SLOTS
      if (nearest !== lastFront) {
        lastFront = nearest
        setFront(nearest)
      }
    }

    const ro = new ResizeObserver(() => {
      width = el.clientWidth
      layout()
    })
    ro.observe(el)
    layout()

    let tween: gsap.core.Tween | undefined
    let timer: gsap.core.Tween | undefined
    const tick = () => {
      tween = gsap.to(state, {
        offset: Math.round(state.offset) + 1,
        duration: 1.1,
        ease: 'power3.inOut',
        onUpdate: layout,
      })
      timer = gsap.delayedCall(interval, tick)
    }
    if (!reduce) timer = gsap.delayedCall(interval, tick)

    return () => {
      ro.disconnect()
      tween?.kill()
      timer?.kill()
    }
  }, [interval])

  const current = items[front % items.length]

  return (
    <div className={cn('relative', className)}>
      <div
        ref={root}
        className="relative mx-auto h-[300px] w-full overflow-hidden sm:h-[420px] lg:h-[520px]"
        // os cards laterais se dissolvem na base em vez de serem cortados em linha reta
        style={{
          maskImage: 'linear-gradient(to bottom, #000 72%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 72%, transparent 100%)',
        }}
      >
        <div className="absolute top-0 left-1/2 h-0 w-0">
          {Array.from({ length: SLOTS }, (_, slot) => (
            <div
              key={slot}
              ref={(node) => {
                cards.current[slot] = node
              }}
              className="absolute top-0 left-0 origin-center will-change-transform"
            >
              {items[slot % items.length].content}
            </div>
          ))}
        </div>
      </div>
      <div className="-mt-px flex flex-col items-center gap-2 pb-2 text-center" aria-live="polite">
        <span className="rounded-full bg-btn-bg px-5 py-2.5 font-ui text-sm font-medium text-btn-fg">
          {current.label}
        </span>
        <span className="font-ui text-[13px] text-muted">{current.subtitle}</span>
      </div>
    </div>
  )
}
