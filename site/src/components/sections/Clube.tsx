import { ChevronDown, Gem, MessageCircle, Rocket, ShieldCheck } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { interests } from '../../lib/content'

const benefits = [
  { icon: Rocket, title: 'Lançamentos', text: 'Avisos antes de ir pro Instagram.' },
  { icon: Gem, title: 'Ofertas Únicas', text: 'Preços especiais para inscritos.' },
  { icon: MessageCircle, title: 'Atendimento', text: 'Consultoria VIP pelo WhatsApp.' },
  { icon: ShieldCheck, title: 'Zero Spam', text: 'Apenas o produto do seu interesse.' },
]

const field =
  'h-[52px] w-full rounded-2xl border border-field bg-transparent px-4 font-ui text-[15px] text-fg outline-none transition placeholder:text-subtle focus:border-fg'

function Field({ label, children, error }: { label: string; children: (id: string) => React.ReactNode; error?: string }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-ui text-[13px] font-medium">
        {label}
      </label>
      {children(id)}
      {error && <p className="mt-1.5 font-ui text-xs text-red-500">{error}</p>}
    </div>
  )
}

export function Clube() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const next: Record<string, string> = {}
    if (!String(data.get('nome')).trim()) next.nome = 'Diga como podemos te chamar.'
    if (!/^\S+@\S+\.\S+$/.test(String(data.get('email')))) next.email = 'Informe um e-mail válido.'
    if (String(data.get('whatsapp')).replace(/\D/g, '').length < 10) next.whatsapp = 'Informe seu WhatsApp com DDD.'
    setErrors(next)
    // Primeira entrega só visual: ainda não grava em lugar nenhum.
    if (Object.keys(next).length === 0) setSent(true)
  }

  return (
    <section id="clube" className="py-[56px] md:py-[72px]">
      <div className="container-ll">
        <div className="relative overflow-hidden rounded-[32px] bg-inv-bg px-6 py-10 text-inv-fg md:rounded-[40px] md:px-[72px] md:py-[72px]">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-[8%] h-[420px] w-[520px] rounded-full opacity-90 blur-[70px]"
            style={{ background: 'radial-gradient(closest-side, var(--club-glow), transparent)' }}
          />
          <div className="relative grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <h2 className="h-display text-[38px] md:text-[52px]">Entre para o Clube LLimportsCWB</h2>
              <p className="mt-6 max-w-[430px] text-base leading-relaxed text-inv-muted">
                Seja o primeiro a saber dos lançamentos e tenha acesso a condições especiais.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {benefits.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="rounded-[24px] border border-current/15 bg-current/[0.04] p-5">
                    <Icon size={22} strokeWidth={1.75} />
                    <h3 className="mt-4 font-ui text-[15px] font-medium">{title}</h3>
                    <p className="mt-1 font-ui text-[13px] leading-relaxed text-inv-muted">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] bg-bg p-6 text-fg md:p-8">
              {sent ? (
                <div className="py-10 text-center" role="status">
                  <h3 className="text-2xl font-medium tracking-tight">Você está no clube.</h3>
                  <p className="mt-2 text-muted">Em breve a gente chama você no WhatsApp.</p>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
                  <Field label="Nome" error={errors.nome}>
                    {(id) => <input id={id} name="nome" autoComplete="name" placeholder="Como podemos te chamar" className={field} />}
                  </Field>
                  <Field label="E-mail" error={errors.email}>
                    {(id) => (
                      <input id={id} name="email" type="email" autoComplete="email" placeholder="voce@email.com" className={field} />
                    )}
                  </Field>
                  <Field label="WhatsApp" error={errors.whatsapp}>
                    {(id) => (
                      <input id={id} name="whatsapp" type="tel" autoComplete="tel" placeholder="(41) 90000-0000" className={field} />
                    )}
                  </Field>
                  <Field label="Interesse">
                    {(id) => (
                      <div className="relative">
                        <select id={id} name="interesse" defaultValue="" className={`${field} appearance-none pr-10`}>
                          <option value="" disabled>
                            iPhone, Mac, iPad, Apple Watch ou acessório
                          </option>
                          {interests.map((i) => (
                            <option key={i} value={i} className="text-black">
                              {i}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={18} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2" />
                      </div>
                    )}
                  </Field>
                  <button
                    type="submit"
                    className="h-[52px] rounded-full bg-btn-bg font-ui text-[15px] font-medium text-btn-fg transition hover:opacity-85 active:scale-[0.99]"
                  >
                    Cadastre-se
                  </button>
                  <p className="font-ui text-xs leading-relaxed text-muted">
                    Usamos seus dados só para falar com você sobre o que escolheu. Sem spam.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
