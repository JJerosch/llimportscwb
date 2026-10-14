import { waLink } from '../../../shared/lib/format.js'
import { site } from '../lib/content.js'
import WhatsAppIcon from './WhatsAppIcon.jsx'

export default function WhatsAppFab() {
  return (
    <a
      id="whatsapp-fab"
      href={waLink(site.whatsapp, 'Olá! Vim pelo site da LL Imports e gostaria de tirar algumas dúvidas.')}
      target="_blank"
      rel="noopener"
      className="wa-fab"
      aria-label="Falar no WhatsApp"
    >
      <WhatsAppIcon />
      <span className="wa-fab__text">Fale com a gente</span>
    </a>
  )
}
