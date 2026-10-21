import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '../../lib/cn'

type Photo = { src: string; alt: string }

const INTERVAL = 5000
const ease = [0.22, 1, 0.36, 1] as const

/** Carrossel simples: troca sozinho a cada 5s, com setas, bolinhas e foto com leve filtro escuro. */
export function PhotoCarousel({ photos, className }: { photos: Photo[]; className?: string }) {
  const [index, setIndex] = useState(0)
  const count = photos.length

  const go = (next: number) => setIndex(((next % count) + count) % count)

  // Qualquer troca (automática ou manual) reinicia a contagem.
  useEffect(() => {
    if (count < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL)
    return () => clearInterval(id)
  }, [index, count])

  const arrow =
    'grid size-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60'

  return (
    <div className={cn('group relative overflow-hidden rounded-[32px] bg-ph', className)}>
      <AnimatePresence initial={false}>
        <motion.img
          key={index}
          src={photos[index].src}
          alt={photos[index].alt}
          draggable={false}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease }}
          className="absolute inset-0 size-full object-cover"
        />
      </AnimatePresence>

      {/* Filtro escuro leve para o texto e os controles ficarem legíveis. */}
      <div className="pointer-events-none absolute inset-0 bg-black/25" />

      {count > 1 && (
        <>
          <button type="button" aria-label="Foto anterior" onClick={() => go(index - 1)} className={cn(arrow, 'absolute left-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100')}>
            <ChevronLeft size={20} strokeWidth={1.75} />
          </button>
          <button type="button" aria-label="Próxima foto" onClick={() => go(index + 1)} className={cn(arrow, 'absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100')}>
            <ChevronRight size={20} strokeWidth={1.75} />
          </button>

          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
            {photos.map((p, i) => (
              <button
                key={p.src}
                type="button"
                aria-label={`Ir para a foto ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={cn(
                  'h-2 rounded-full bg-white transition-all duration-500',
                  i === index ? 'w-6 opacity-100' : 'w-2 opacity-50 hover:opacity-80',
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
