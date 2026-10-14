/** Faixa infinita de selos de confiança. O conteúdo é duplicado para o loop contínuo. */
export default function Marquee({ items }) {
  const group = (hidden) => (
    <div className="marquee__group" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <span key={item} className="marquee__item">
          {item}
          <span className="marquee__sep" />
        </span>
      ))}
    </div>
  )

  return (
    <section className="marquee" aria-label="Diferenciais da LL Imports">
      <div className="marquee__track">
        {group(false)}
        {group(true)}
      </div>
    </section>
  )
}
