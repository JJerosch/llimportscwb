import { MotionAccordion } from '../ui/motion-faqs-accordion'
import { faqs } from '../../lib/content'

export function FAQ() {
  return (
    <section id="faq" className="py-[72px] md:py-[96px]">
      <div className="container-ll">
        <h2 className="h-display mb-10 text-center text-[38px] md:mb-14 md:text-[56px]">Perguntas frequentes</h2>
        <MotionAccordion className="mx-auto max-w-[760px]" items={faqs} />
      </div>
    </section>
  )
}
