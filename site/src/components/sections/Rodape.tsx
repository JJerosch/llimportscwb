import { Link } from 'react-router-dom'
import { Logo } from '../Logo'
import { ThemeToggle } from '../ThemeToggle'
import { INSTAGRAM_URL, MAP_URL, whatsappLink } from '../../lib/content'

const linkClass = 'text-muted transition hover:text-fg'

export function Rodape() {
  return (
    <footer className="mt-10 bg-surface pt-14 md:pt-[72px]">
      <div className="container-ll">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1.1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-[330px] text-base leading-relaxed text-muted">
              iPhone, Mac, iPad e Apple Watch em Curitiba. Originais, lacrados e com nota fiscal.
            </p>
          </div>
          <nav aria-label="Loja">
            <h3 className="font-ui text-sm font-medium">Loja</h3>
            <ul className="mt-4 flex flex-col gap-3 text-base">
              {['iPhone', 'Mac', 'iPad', 'Apple Watch', 'Acessórios'].map((l) => (
                <li key={l}>
                  <a href="#categorias" className={linkClass}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Atendimento">
            <h3 className="font-ui text-sm font-medium">Atendimento</h3>
            <ul className="mt-4 flex flex-col gap-3 text-base">
              <li>
                <a href="#loja" className={linkClass}>
                  Agendar visita
                </a>
              </li>
              <li>
                <a href={whatsappLink('Olá!')} target="_blank" rel="noreferrer" className={linkClass}>
                  WhatsApp (41) 3227-5066
                </a>
              </li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className={linkClass}>
                  Instagram @llimportscwb
                </a>
              </li>
              <li>
                <a href="#clube" className={linkClass}>
                  Lista de pré-venda
                </a>
              </li>
            </ul>
          </nav>
          <div>
            <h3 className="font-ui text-sm font-medium">Endereço</h3>
            <address className="mt-4 flex flex-col gap-3 text-base text-muted not-italic">
              <a href={MAP_URL} target="_blank" rel="noreferrer" className="transition hover:text-fg">
                Rua Anita Garibaldi, 850
              </a>
              <span>Sala 401, Torre C, Cabral</span>
              <span>Curitiba, PR</span>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-5 border-t border-line py-6 md:mt-[60px] md:flex-row md:items-center">
          <p className="font-ui text-[13px] text-muted">
            © 2026 LLimportsCWB | Av. Anita Garibaldi 850 Sl 401 Curitiba/PR - CNPJ: 51.128.849/0001-86
          </p>
          <div className="flex items-center gap-5">
            <Link to="/admin" className="font-ui text-[13px] font-medium underline underline-offset-4">
              Área administrativa
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}
