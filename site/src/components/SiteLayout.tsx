import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { FloatingNavbar } from './ui/floating-navbar'
import { Rodape } from './sections/Rodape'
import { navLinks, whatsappLink } from '../lib/content'

/** Navegação entre rotas: volta ao topo, ou rola até a âncora (#secao) quando a URL tem uma. */
function ScrollManager() {
  // `key` muda a cada navegação, inclusive ao clicar duas vezes no mesmo link de âncora.
  const { pathname, hash, key } = useLocation()
  useEffect(() => {
    if (hash) {
      // espera a página montar (rotas são lazy) antes de procurar o alvo
      const id = decodeURIComponent(hash.slice(1))
      const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView(), 60)
      return () => window.clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash, key])
  return null
}

/** Estrutura comum das páginas públicas: navbar flutuante, conteúdo e rodapé. */
export default function SiteLayout() {
  return (
    <>
      <ScrollManager />
      <FloatingNavbar
        links={navLinks}
        cta={{ label: 'Falar no WhatsApp', href: whatsappLink('Olá! Vim pelo site da LL Imports.') }}
      />
      <Outlet />
      <Rodape />
    </>
  )
}
