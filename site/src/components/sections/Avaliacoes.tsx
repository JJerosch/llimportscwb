import { Star } from 'lucide-react'
import { Button } from '../Button'
import { VerticalMarquee } from '../ui/vertical-marquee'
import { GOOGLE_REVIEWS_URL, reviews } from '../../lib/content'

function ReviewCard({ text, author }: (typeof reviews)[number]) {
  return (
    <article className="rounded-[28px] border border-line bg-bg p-6">
      <div className="flex gap-1 text-fg" aria-label="5 estrelas">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
        ))}
      </div>
      <p className="mt-4 line-clamp-4 text-[15px] leading-relaxed">{text}</p>
      <footer className="mt-5 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full bg-surface-2 font-ui text-sm font-medium" aria-hidden>
          {author[0]}
        </span>
        <span className="leading-tight">
          <span className="block font-ui text-[13px] font-medium">{author}</span>
          <span className="block font-ui text-xs text-muted">Avaliação no Google</span>
        </span>
      </footer>
    </article>
  )
}

export function Avaliacoes() {
  return (
    <section id="avaliacoes" className="py-[72px] md:py-[96px]">
      <div className="container-ll grid items-center gap-12 md:grid-cols-[1fr_1.15fr] md:gap-8">
        <div className="max-w-[520px]">
          <p className="mb-4 font-ui text-sm font-medium text-muted">A confiança que se reflete em cada avaliação</p>
          <h2 className="h-display text-[40px] md:text-[64px]">Somos 4,9 / 5 no Google</h2>
          <p className="mt-6 text-base leading-relaxed text-muted">
            Nossa maior conquista não são os produtos que vendemos, mas os relacionamentos que construímos. A nota 4.9
            de 5 estrelas no Google é o resultado de um compromisso diário com a sua segurança, um atendimento
            genuinamente pessoal e a paixão por entregar uma experiência que encanta.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Button href={GOOGLE_REVIEWS_URL} target="_blank" rel="noreferrer" variant="outline">
              Avalie agora
            </Button>
          </div>
        </div>
        <VerticalMarquee
          items={reviews}
          columns={2}
          speed={36}
          gap={16}
          blurSize={110}
          className="h-[460px] md:h-[560px]"
          renderItem={(r) => <ReviewCard {...r} />}
        />
      </div>
    </section>
  )
}
