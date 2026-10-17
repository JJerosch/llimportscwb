import { cn } from '../lib/cn'
import { LOGO_FULL_VIEWBOX, LOGO_LETTER_PATHS, LOGO_SYMBOL_PATHS } from './logo-paths'

const SYMBOL_VIEWBOX = '141.2 45.24 26 25.6'

/** Logo oficial (vetor extraído do Figma). Usa currentColor, então segue o tema. */
export function Logo({ symbolOnly = false, className }: { symbolOnly?: boolean; className?: string }) {
  return (
    <svg
      role="img"
      aria-label="LL Imports"
      viewBox={symbolOnly ? SYMBOL_VIEWBOX : LOGO_FULL_VIEWBOX}
      fill="currentColor"
      className={cn('block h-[26px] w-auto text-fg', symbolOnly && 'h-7', className)}
    >
      {LOGO_SYMBOL_PATHS.map((d, i) => (
        <path key={`s${i}`} d={d} />
      ))}
      {!symbolOnly && LOGO_LETTER_PATHS.map((d, i) => <path key={`l${i}`} d={d} />)}
    </svg>
  )
}
