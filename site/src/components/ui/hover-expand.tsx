import { motion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type HoverExpandItem = {
  key: string
  label: string
  description?: string
  action?: ReactNode
  media: ReactNode
}

type Props = {
  items: HoverExpandItem[]
  /** Altura da área de mídia quando a linha está aberta. */
  mediaHeight?: number
  defaultOpen?: number
  className?: string
}

/**
 * Lista de linhas que se expandem ao passar o mouse (ou tocar), mostrando a mídia do item
 * com spring. Mesmo contrato do hover-expand do unlumen: uma linha aberta por vez.
 */
export function HoverExpand({ items, mediaHeight = 380, defaultOpen = 0, className }: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <ul className={cn('border-t border-line', className)}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <motion.li
            key={item.key}
            onHoverStart={() => setOpen(i)}
            onFocus={() => setOpen(i)}
            onClick={() => setOpen(i)}
            className="border-b border-line last:border-b-0"
          >
            <div className="grid cursor-pointer grid-cols-[1fr_auto] items-center gap-x-6 py-5 md:grid-cols-[1.6fr_2fr_auto] md:py-6">
              <h3 className="text-[34px] leading-none font-medium tracking-tight md:text-[44px]">{item.label}</h3>
              <p className="col-span-2 row-start-2 mt-2 text-[15px] leading-snug text-muted md:col-span-1 md:row-start-auto md:mt-0 md:text-base">
                {item.description}
              </p>
              <div className="font-ui text-sm font-medium">{item.action}</div>
            </div>
            <motion.div
              initial={false}
              animate={{ height: isOpen ? mediaHeight : 0, opacity: isOpen ? 1 : 0, marginBottom: isOpen ? 20 : 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 30 }}
              className="overflow-hidden rounded-[28px]"
              aria-hidden={!isOpen}
            >
              <div className="h-full bg-ph" style={{ height: mediaHeight }}>
                {item.media}
              </div>
            </motion.div>
          </motion.li>
        )
      })}
    </ul>
  )
}
