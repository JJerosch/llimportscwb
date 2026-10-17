import { motion } from 'motion/react'
import { CalendarDays, Lock, MapPin, MessageCircle, Plus, Minus, Star } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/cn'
import { whyItems } from '../../lib/content'

const icons = { message: MessageCircle, lock: Lock, star: Star, calendar: CalendarDays, pin: MapPin }

export function PorQueLL() {
  const [open, setOpen] = useState(0)

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
        <div className="hidden h-[380px] gap-4 md:flex">
          {whyItems.map((item, i) => {
            const Icon = icons[item.icon]
            const isOpen = open === i
            return (
              <motion.div
                key={item.title}
                onHoverStart={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                tabIndex={0}
                animate={{ flexGrow: isOpen ? 2.65 : 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 30 }}
                className={cn(
                  'flex min-w-0 basis-0 flex-col justify-between overflow-hidden rounded-[32px] p-7 outline-none',
                  isOpen ? 'bg-inv-bg text-inv-fg' : 'bg-surface text-fg',
                )}
              >
                <Icon size={24} strokeWidth={1.75} fill={item.icon === 'star' ? 'currentColor' : 'none'} />
                <div>
                  <h3 className={cn('font-medium tracking-tight', isOpen ? 'text-[28px]' : 'text-[19px] leading-snug')}>
                    {item.title}
                  </h3>
                  <motion.p
                    initial={false}
                    animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
                    className="overflow-hidden text-base leading-relaxed text-inv-muted"
                  >
                    <span className="mt-3 block">{item.text}</span>
                  </motion.p>
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
