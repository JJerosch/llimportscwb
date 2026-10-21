import { motion } from 'motion/react'
import { CalendarDays, Lock, MapPin, MessageCircle, Plus, Minus, Star } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import { whyItems } from '../../lib/content'

const icons = { message: MessageCircle, lock: Lock, star: Star, calendar: CalendarDays, pin: MapPin }

// Mesma curva para o card alargar e o texto subir/descer, para tudo andar junto.
const ease = { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const
const OPEN_GROW = 2.65
const GAP = 16
const PADDING = 56

/**
 * Largura útil dos cards aberto e fechado. O texto já recebe a largura final no início da transição,
 * assim a quebra de linha acontece num render (que o motion consegue animar) e não no meio do caminho.
 */
function useTextWidths(count: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [widths, setWidths] = useState({ open: 0, closed: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const unit = (entry.contentRect.width - GAP * (count - 1)) / (OPEN_GROW + count - 1)
      setWidths({ open: Math.max(0, unit * OPEN_GROW - PADDING), closed: Math.max(0, unit - PADDING) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [count])
  return [ref, widths] as const
}

/** Título palavra por palavra: quando uma palavra muda de linha (ou de tamanho), ela desliza até o novo lugar. */
function FloatingTitle({ text, isOpen, width }: { text: string; isOpen: boolean; width: number }) {
  return (
    <h3
      style={width ? { width } : undefined}
      className={cn('font-medium tracking-tight', isOpen ? 'text-[28px] leading-[1.2]' : 'text-[19px] leading-[1.35]')}
    >
      {text.split(' ').map((word, i) => (
        <span key={i}>
          {i > 0 && ' '}
          <motion.span layout transition={ease} className="inline-block origin-bottom-left">
            {word}
          </motion.span>
        </span>
      ))}
    </h3>
  )
}

export function PorQueLL() {
  const [open, setOpen] = useState(0)
  const [rowRef, widths] = useTextWidths(whyItems.length)

  return (
    <section id="por-que" className="py-[72px] md:py-[96px]">
      <div className="container-ll">
        <div className="mb-10 flex flex-col justify-between gap-5 md:mb-14 md:flex-row md:items-start">
          <h2 className="h-display max-w-[760px] text-[38px] md:text-[56px]">
            Sua experiência Apple, elevada a um novo nível
          </h2>
          <p className="max-w-[360px] text-base leading-relaxed text-muted md:pt-3">
            Quatro anos atendendo Curitiba, com mais de 2.000 clientes e nota 4,9 no Google.
          </p>
        </div>

        {/* Desktop: cards lado a lado; o card sob o mouse se expande. */}
        <div ref={rowRef} className="hidden h-[380px] gap-4 md:flex">
          {whyItems.map((item, i) => {
            const Icon = icons[item.icon]
            const isOpen = open === i
            return (
              <motion.div
                key={item.title}
                onHoverStart={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                tabIndex={0}
                animate={{ flexGrow: isOpen ? OPEN_GROW : 1 }}
                transition={ease}
                className={cn(
                  'flex min-w-0 basis-0 flex-col justify-between overflow-hidden rounded-[32px] p-7 transition-colors duration-500 outline-none',
                  isOpen ? 'bg-inv-bg text-inv-fg' : 'bg-surface text-fg',
                )}
              >
                <Icon size={24} strokeWidth={1.75} fill={item.icon === 'star' ? 'currentColor' : 'none'} />
                {/* Fechado: só o título, encostado embaixo. Aberto: a descrição cresce e empurra o título para cima. */}
                <div>
                  <FloatingTitle text={item.title} isOpen={isOpen} width={isOpen ? widths.open : widths.closed} />
                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0 }}
                    transition={ease}
                    className="overflow-hidden"
                  >
                    <motion.p
                      initial={false}
                      animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 12 }}
                      transition={isOpen ? { ...ease, delay: 0.12 } : { duration: 0.2 }}
                      style={widths.open ? { width: widths.open } : undefined}
                      className="pt-3 text-base leading-relaxed text-inv-muted"
                    >
                      {item.text}
                    </motion.p>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Mobile: o primeiro item destacado, os demais viram acordeão. */}
        <div className="flex flex-col gap-3 md:hidden">
          {whyItems.map((item, i) => {
            const Icon = icons[item.icon]
            const isOpen = open === i
            return (
              <button
                key={item.title}
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className={cn(
                  'rounded-[28px] p-5 text-left transition-colors',
                  isOpen ? 'bg-inv-bg text-inv-fg' : 'bg-surface text-fg',
                )}
              >
                <span className="flex items-center gap-4">
                  <Icon size={22} strokeWidth={1.75} fill={item.icon === 'star' ? 'currentColor' : 'none'} />
                  <span className="flex-1 text-lg font-medium tracking-tight">{item.title}</span>
                  {isOpen ? <Minus size={20} strokeWidth={1.75} /> : <Plus size={20} strokeWidth={1.75} />}
                </span>
                {isOpen && <span className="mt-3 block pl-[38px] text-[15px] leading-relaxed text-inv-muted">{item.text}</span>}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
