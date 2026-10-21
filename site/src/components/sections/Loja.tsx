import { MapPin, MessageCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '../Button'
import { PhotoCarousel } from '../ui/photo-carousel'
import { INSTAGRAM_URL, MAP_EMBED_URL, MAP_URL, whatsappLink } from '../../lib/content'

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Link inline com fundo suave e ícone, no estilo "mention" do Notion. */
function Mention({ href, icon, children }: { href: string; icon: ReactNode; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="mx-0.5 inline-flex items-center gap-1.5 rounded-lg bg-surface px-2 py-0.5 align-baseline font-medium text-fg underline underline-offset-4 transition hover:bg-surface-2"
    >
      {icon}
      {children}
    </a>
  )
}

export function Loja() {
  return (
    <section id="loja" className="py-[72px] md:py-[96px]">
      <div className="container-ll grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="h-display text-[38px] md:text-[56px]">Uma experiência de compra criada para você</h2>
          <p className="mt-6 text-base leading-relaxed text-muted">
            Na LL Imports, entendemos que seu tempo é valioso e sua segurança é inegociável. Por isso, criamos um
            modelo de atendimento exclusivo e pessoal. Agende sua visita e tenha um consultor dedicado a entender suas
            necessidades, apresentar os melhores produtos e garantir a compra perfeita, com total discrição e
            confiança.
          </p>
          <p className="mt-6 text-lg leading-[2.1] text-muted">
            Estamos na{' '}
            <Mention href={MAP_URL} icon={<MapPin size={15} strokeWidth={1.75} />}>
              Rua Anita Garibaldi, 850
            </Mention>{' '}
            sala 401, Torre C, no Cabral. Marque seu horário pelo{' '}
            <Mention href={whatsappLink('Olá! Quero agendar uma visita.')} icon={<MessageCircle size={15} strokeWidth={1.75} />}>
              WhatsApp
            </Mention>{' '}
            ou pelo{' '}
            <Mention href={INSTAGRAM_URL} icon={<InstagramIcon />}>
              @llimportscwb
            </Mention>
            .
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={whatsappLink('Olá! Quero agendar uma visita.')} target="_blank" rel="noreferrer">
              Agendar um horário exclusivo
            </Button>
            <Button href={MAP_URL} target="_blank" rel="noreferrer" variant="outline">
              Abrir no mapa
            </Button>
          </div>
        </div>

        {/* Coluna da direita: fotos ocupam ~60% da altura e o mapa ~40%. */}
        <div className="grid h-[460px] grid-rows-[3fr_2fr] gap-4 md:h-[520px]">
          <PhotoCarousel
            photos={[
              { src: '/media/escritorio-1.jpg', alt: 'Interior da LL Imports em Curitiba' },
              { src: '/media/escritorio-2.jpg', alt: 'Espaço de atendimento da LL Imports' },
            ]}
            className="h-full"
          />
          <iframe
            src={MAP_EMBED_URL}
            title="Localização da LL Imports no mapa"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full rounded-[32px] border-0"
          />
        </div>
      </div>
    </section>
  )
}
