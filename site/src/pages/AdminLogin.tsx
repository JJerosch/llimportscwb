import { Eye, EyeOff, Lock } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { ThemeToggle } from '../components/ThemeToggle'

const field =
  'h-[56px] w-full rounded-2xl border border-field bg-transparent px-5 font-ui text-base text-fg outline-none transition placeholder:text-subtle focus:border-fg'

export default function AdminLogin() {
  const [show, setShow] = useState(false)
  const [notice, setNotice] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Primeira entrega só visual: o login real (Supabase Auth) entra na etapa seguinte.
    setNotice(true)
  }

  return (
    <div className="grid min-h-svh p-3 lg:grid-cols-[minmax(0,0.88fr)_1fr] lg:gap-0 lg:p-4">
      <aside className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[28px] bg-inv-bg p-6 text-inv-fg lg:min-h-0 lg:rounded-[32px] lg:p-[46px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-[35%] h-[420px] w-[520px] rounded-full blur-[70px]"
          style={{ background: 'radial-gradient(closest-side, var(--club-glow), transparent)' }}
        />
        <Logo className="relative text-inv-fg" />
        <div className="relative mt-16 lg:mt-0">
          <h2 className="h-display text-[34px] lg:text-[48px]">Painel da LL Imports</h2>
          <p className="mt-4 max-w-[430px] text-base leading-relaxed text-inv-muted lg:text-lg">
            Todos os contatos que chegam pelo site em um só lugar: nome, e-mail, telefone e o produto de interesse.
          </p>
        </div>
      </aside>

      <main className="relative flex flex-col px-3 pt-6 pb-10 lg:px-0">
        <ThemeToggle className="self-end lg:absolute lg:top-6 lg:right-8" />
        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-10">
          <span className="grid size-12 place-items-center rounded-2xl bg-surface-2">
            <Lock size={22} strokeWidth={1.75} />
          </span>
          <h1 className="h-display mt-8 text-[34px] lg:text-[40px]">Entrar no painel</h1>
          <p className="mt-2 text-base text-muted">Acesso restrito à equipe da LL Imports.</p>

          <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="mb-2 block font-ui text-sm font-medium">
                E-mail
              </label>
              <input id="email" type="email" autoComplete="username" placeholder="Seu e-mail de acesso" className={field} />
            </div>
            <div>
              <label htmlFor="senha" className="mb-2 block font-ui text-sm font-medium">
                Senha
              </label>
              <div className="relative">
                <input
                  id="senha"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`${field} pr-14`}
                />
                <button
                  type="button"
                  aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
                  onClick={() => setShow((s) => !s)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-muted hover:text-fg"
                >
                  {show ? <EyeOff size={20} strokeWidth={1.75} /> : <Eye size={20} strokeWidth={1.75} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between font-ui text-sm">
              <label className="flex cursor-pointer items-center gap-2.5">
                <input type="checkbox" className="size-5 rounded-md border-field accent-[var(--btn-bg)]" />
                Manter conectado
              </label>
              <a href="#" className="font-medium underline underline-offset-4">
                Esqueci minha senha
              </a>
            </div>
            <button
              type="submit"
              className="mt-1 h-[56px] rounded-full bg-btn-bg font-ui text-base font-medium text-btn-fg transition hover:opacity-85 active:scale-[0.99]"
            >
              Entrar
            </button>
            {notice && (
              <p role="status" className="text-center font-ui text-sm text-muted">
                O acesso ao painel será habilitado na próxima etapa.
              </p>
            )}
          </form>
          <Link to="/" className="mt-6 text-center font-ui text-sm text-muted transition hover:text-fg">
            Voltar para o site
          </Link>
        </div>
      </main>
    </div>
  )
}
