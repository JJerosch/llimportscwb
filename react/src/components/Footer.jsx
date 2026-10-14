import logo from '../../../shared/assets/brand/ll-logo-wide.png'
import { waLink } from '../../../shared/lib/format.js'
import { site, nav } from '../lib/content.js'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#topo" aria-label="LL Imports CWB: início">
              <img src={logo} alt="LL Imports" width="120" height="21" style={{ opacity: 0.9 }} />
            </a>
            <p>
              Especialistas em produtos Apple em Curitiba. Novos lacrados e seminovos premium com garantia e procedência garantida.
            </p>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <h4>Navegação</h4>
              <ul>
                {nav.map((item) => (
                  <li key={item.href}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Contato</h4>
              <ul>
                <li>
                  <a href={waLink(site.whatsapp)} target="_blank" rel="noopener">
                    WhatsApp: {site.whatsappDisplay}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </li>
                <li>
                  <a href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noopener">
                    Instagram: @{site.instagram}
                  </a>
                </li>
                <li>{site.address.street}, {site.address.complement}</li>
                <li>{site.address.district} · {site.address.city}/{site.address.state}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            Copyright © {new Date().getFullYear()} LL Imports CWB · CNPJ: {site.cnpj}
          </div>
          <div>
            Desenvolvido com excelência & design refinado.
          </div>
        </div>
      </div>
    </footer>
  )
}
