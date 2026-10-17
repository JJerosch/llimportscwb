import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../Logo'
import { ThemeToggle } from '../ThemeToggle'
import { Button } from '../Button'
import type { NavLink } from './floating-navbar'

type Props = {
  open: boolean
  onClose: () => void
  links: NavLink[]
  active: string | null
  cta: { label: string; href: string }
}

/** Menu em tela cheia do mobile: trava o scroll, fecha com Esc e anima os itens em cascata. */
export function MobileMenu({ open, onClose, links, active, cta }: Props) {
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex flex-col bg-bg px-4 pt-5 pb-6 sm:px-6"
        >
          <div className="flex h-[68px] items-center justify-between rounded-full border border-line pr-[10px] pl-6 shadow-[var(--shadow-float)]">
            <Logo symbolOnly />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={onClose}
                className="grid size-[50px] place-items-center rounded-full bg-surface-2 text-fg"
              >
                <X size={22} strokeWidth={1.75} />
              </button>
            </div>
          </div>

          <ul className="mt-10 px-2">
            {links.map((link, i) => (
              <motion.li
                key={link.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05, type: 'spring', stiffness: 300, damping: 30 }}
                className="border-b border-line"
              >
                <Link
                  to={link.href}
                  onClick={onClose}
                  className="flex items-baseline justify-between py-5 text-[44px] leading-none font-medium tracking-tight text-fg"
                >
                  {link.label}
                  {active === link.label && (
                    <span className="font-sans text-base font-normal tracking-normal text-muted">Você está aqui</span>
                  )}
                </Link>
              </motion.li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col gap-3">
            <Button href={cta.href} target="_blank" rel="noreferrer" size="lg" className="h-[58px] w-full text-base">
              {cta.label}
            </Button>
            <Button href="#loja" onClick={onClose} variant="outline" size="lg" className="h-[58px] w-full text-base">
              Agendar visita
            </Button>
            <p className="text-center text-sm text-muted">Rua Anita Garibaldi, 850, Cabral, Curitiba</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
