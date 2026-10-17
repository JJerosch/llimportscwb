import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { Logo } from '../Logo'
import { ThemeToggle } from '../ThemeToggle'
import { Button } from '../Button'
import { MobileMenu } from './mobile-menu'

export type NavLink = { label: string; href: string }

type Props = {
  links: NavLink[]
  cta: { label: string; href: string }
  className?: string
}

/**
 * Navbar em pílula que "respira" com a velocidade do scroll (±12px) e esconde o
 * rótulo do logo no mobile. Inspirada no floating-navbar do unlumen (Pro), recriada sem Next.
 */
export function FloatingNavbar({ links, cta, className }: Props) {
  const { pathname } = useLocation()
  const [spy, setSpy] = useState<string | null>(null)

  // Na landing, o item ativo é o da seção que está na tela (scroll spy); no catálogo, o da rota.
  useEffect(() => {
    if (pathname !== '/') return
    const byId = new Map(links.filter((l) => l.href.startsWith('/#')).map((l) => [l.href.slice(2), l.label]))
    byId.set('topo', '')
    const visible = new Set<string>()
    const pick = () => {
      // entre as seções cruzando a linha de leitura, vale a mais abaixo (a que acabou de entrar)
      const ids = [...byId.keys()].filter((id) => visible.has(id))
      const last = ids[ids.length - 1]
      setSpy(last ? byId.get(last) || null : null)
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id)
          else visible.delete(e.target.id)
        }
        pick()
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    byId.forEach((_, id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [pathname, links])

  const active = links.find((l) => l.href === pathname)?.label ?? (pathname === '/' ? spy : null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const nudge = useSpring(useTransform(velocity, [-2500, 0, 2500], [-12, 0, 12], { clamp: true }), {
    stiffness: 260,
    damping: 28,
  })
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24))

  const highlighted = hovered ?? active

  return (
    <>
      <motion.header
        style={{ y: nudge }}
        className={cn('fixed inset-x-0 top-5 z-50 px-4 sm:px-6', className)}
      >
        <nav
          aria-label="Principal"
          className={cn(
            'mx-auto flex h-[68px] max-w-[1200px] items-center justify-between rounded-full border border-line bg-bg/90 pr-[10px] pl-6 backdrop-blur-md transition-shadow',
            scrolled ? 'shadow-[var(--shadow-float)]' : 'shadow-[0_4px_20px_rgb(0_0_0/0.04)]',
          )}
        >
          <Link to="/" aria-label="LL Imports, início">
            <Logo className="hidden md:inline-flex" />
            <Logo symbolOnly className="md:hidden" />
          </Link>

          <ul className="hidden items-center gap-1 xl:flex" onMouseLeave={() => setHovered(null)}>
            {links.map((link) => (
              <li key={link.label} className="relative">
                <Link
                  to={link.href}
                  onMouseEnter={() => setHovered(link.label)}
                  onFocus={() => setHovered(link.label)}
                  onBlur={() => setHovered(null)}
                  className="relative block rounded-full px-4 py-2.5 font-ui text-[15px] font-medium text-muted transition-colors hover:text-fg"
                >
                  {highlighted === link.label && (
                    <motion.span
                      layoutId="nav-highlight"
                      className="absolute inset-0 rounded-full bg-surface-2"
                      transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                    />
                  )}
                  <span className={cn('relative', active === link.label && 'text-fg')}>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button href={cta.href} target="_blank" rel="noreferrer" className="hidden h-[50px] sm:inline-flex">
              {cta.label}
            </Button>
            <button
              type="button"
              aria-label="Abrir menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="grid size-[50px] place-items-center rounded-full bg-surface-2 text-fg xl:hidden"
            >
              <Menu size={22} strokeWidth={1.75} />
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        links={links}
        active={active}
        cta={cta}
      />
    </>
  )
}
