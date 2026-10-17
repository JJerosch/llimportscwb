import { Headphones } from 'lucide-react'
import type { ProductKind } from '../lib/content'
import { cn } from '../lib/cn'

const body = 'var(--ph-fig)'
const bump = 'var(--subtle)'
const lens = '#161616'

function Phone() {
  return (
    <svg viewBox="0 0 140 284" className="h-full w-auto" aria-hidden>
      <rect width="140" height="284" rx="34" fill={body} />
      <rect x="12" y="12" width="54" height="54" rx="16" fill={bump} />
      <circle cx="28" cy="29" r="9" fill={lens} />
      <circle cx="49" cy="40" r="9" fill={lens} />
      <circle cx="28" cy="51" r="9" fill={lens} />
      <circle cx="56" cy="19" r="3" fill="var(--ph)" />
    </svg>
  )
}

function Mac() {
  return (
    <svg viewBox="0 0 220 150" className="h-full w-auto" aria-hidden>
      <rect x="22" y="8" width="176" height="112" rx="10" fill="var(--ph)" stroke="var(--ph-dark)" strokeWidth="6" />
      <path d="M4 126h212l-8 14H12Z" fill={body} stroke="var(--ph-dark)" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  )
}

function IPad() {
  return (
    <svg viewBox="0 0 170 220" className="h-full w-auto" aria-hidden>
      <rect x="5" y="5" width="160" height="210" rx="22" fill="var(--ph)" stroke="var(--ph-dark)" strokeWidth="8" />
    </svg>
  )
}

function Watch() {
  return (
    <svg viewBox="0 0 120 220" className="h-full w-auto" aria-hidden>
      <rect x="28" y="0" width="64" height="56" rx="12" fill={body} />
      <rect x="28" y="164" width="64" height="56" rx="12" fill={body} />
      <rect x="10" y="48" width="100" height="124" rx="30" fill="var(--ph)" stroke="var(--ph-dark)" strokeWidth="8" />
    </svg>
  )
}

export function ProductArt({ kind, className }: { kind: ProductKind; className?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      {kind === 'iphone' && <Phone />}
      {kind === 'mac' && <Mac />}
      {kind === 'ipad' && <IPad />}
      {kind === 'watch' && <Watch />}
      {kind === 'acessorios' && <Headphones className="h-3/5 w-auto text-[color:var(--ph-fig)]" strokeWidth={1.2} />}
    </div>
  )
}
