import { motion } from 'motion/react'
import { Minus, Plus } from 'lucide-react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type MotionAccordionItem = { question: ReactNode; answer: ReactNode }

type Props = {
  items: MotionAccordionItem[]
  gap?: number
  defaultOpen?: number | null
  className?: string
}

function Panel({ id, open, children }: { id: string; open: boolean; children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  // ResizeObserver: a mola sempre mira a altura real do conteúdo, mesmo se o texto quebrar diferente.
  useEffect(() => {
    const el = inner.current
    if (!el) return
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight))
    ro.observe(el)
    setHeight(el.offsetHeight)
    return () => ro.disconnect()
  }, [])

  return (
    <motion.div
      id={id}
      role="region"
      initial={false}
      animate={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="overflow-hidden"
    >
      <div ref={inner} className="px-6 pb-6 text-[15px] leading-relaxed text-muted">
        {children}
      </div>
    </motion.div>
  )
}

/** Acordeão de FAQ: um item aberto por vez, altura animada por mola. */
export function MotionAccordion({ items, gap = 12, defaultOpen = 0, className }: Props) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  const baseId = useId()

  return (
    <div className={cn('flex flex-col', className)} style={{ gap }}>
      {items.map((item, i) => {
        const isOpen = open === i
        const panelId = `${baseId}-${i}`
        return (
          <div key={i} className="rounded-[28px] bg-surface">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-ui text-base font-medium text-fg"
            >
              {item.question}
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }} className="shrink-0">
                {isOpen ? <Minus size={20} strokeWidth={1.75} /> : <Plus size={20} strokeWidth={1.75} />}
              </motion.span>
            </button>
            <Panel id={panelId} open={isOpen}>
              {item.answer}
            </Panel>
          </div>
        )
      })}
    </div>
  )
}
