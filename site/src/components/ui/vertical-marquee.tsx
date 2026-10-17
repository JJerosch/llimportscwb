import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Props<T> = {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  columns?: 1 | 2
  /** Duração do loop em segundos. */
  speed?: number
  gap?: number
  /** Altura da zona de fade nas pontas, em px. */
  blurSize?: number
  pauseOnHover?: boolean
  className?: string
}

function Column<T>({
  items,
  renderItem,
  speed,
  gap,
  reverse,
  pauseOnHover,
}: Pick<Props<T>, 'items' | 'renderItem' | 'gap'> & { speed: number; reverse: boolean; pauseOnHover: boolean }) {
  // A lista é duplicada: o translateY de -50% fecha o loop sem emenda.
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden">
      <div
        className={cn(
          'flex animate-[marquee-up_var(--speed)_linear_infinite] flex-col motion-reduce:animate-none',
          reverse && '[animation-direction:reverse]',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
        style={{ ['--speed' as string]: `${speed}s`, gap, paddingBottom: gap }}
      >
        {doubled.map((item, i) => (
          <div key={i} aria-hidden={i >= items.length}>
            {renderItem(item, i % items.length)}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Colunas de cards rolando em sentidos opostos, com fade nas pontas (versão genérica do vertical-marquee). */
export function VerticalMarquee<T>({
  items,
  renderItem,
  columns = 2,
  speed = 30,
  gap = 16,
  blurSize = 120,
  pauseOnHover = true,
  className,
}: Props<T>) {
  const half = Math.ceil(items.length / columns)
  const groups = columns === 1 ? [items] : [items.slice(0, half), items.slice(half)]

  return (
    <div
      className={cn('grid h-[560px] overflow-hidden', columns === 2 ? 'grid-cols-2' : 'grid-cols-1', className)}
      style={{
        gap,
        maskImage: `linear-gradient(to bottom, transparent, black ${blurSize}px, black calc(100% - ${blurSize}px), transparent)`,
        WebkitMaskImage: `linear-gradient(to bottom, transparent, black ${blurSize}px, black calc(100% - ${blurSize}px), transparent)`,
      }}
    >
      {groups.map((group, c) => (
        <Column
          key={c}
          items={group}
          renderItem={renderItem}
          gap={gap}
          speed={speed + c * 6}
          reverse={c % 2 === 1}
          pauseOnHover={pauseOnHover}
        />
      ))}
    </div>
  )
}
