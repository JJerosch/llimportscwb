import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import logo from '../../../shared/assets/brand/ll-logo-wide.png'
import { waLink } from '../../../shared/lib/format.js'
import { site, nav } from '../lib/content.js'
import WhatsAppIcon from './WhatsAppIcon.jsx'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const cta = waLink(site.whatsapp, 'Olá! Vim pelo site da LL Imports e gostaria de atendimento.')
  const classes = ['site-header', scrolled && 'is-scrolled', open && 'is-open'].filter(Boolean).join(' ')

  return (
    <header className={classes}>
      <div className="site-header__bar">
        <a href="#topo" className="brand" aria-label="LL Imports CWB: início">
          <img src={logo} alt="LL Imports" width="114" height="20" />
        </a>

        <nav className="nav" aria-label="Navegação principal">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="nav__link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <a id="header-whatsapp" href={cta} target="_blank" rel="noopener" className="btn btn--primary btn--sm">
            <WhatsAppIcon />
            WhatsApp
          </a>
          <button
            id="menu-toggle"
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        <nav id="mobile-nav" className="mobile-nav" aria-label="Navegação mobile">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="nav__link" onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href={cta} target="_blank" rel="noopener" className="btn btn--primary">
            <WhatsAppIcon />
            Falar no WhatsApp
          </a>
        </nav>
      </div>
    </header>
  )
}
