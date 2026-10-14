import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQ({ content }) {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? -1 : i)
  }

  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className="container">
        <div className="section-head">
          <span className="section-head__tag">{content.tag}</span>
          <h2 id="faq-title" className="section-head__title">
            {content.title}
          </h2>
        </div>

        <div className="faq-list">
          {content.items.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div key={item.q} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <ChevronDown />
                </button>
                {isOpen && <div className="faq-answer">{item.a}</div>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
