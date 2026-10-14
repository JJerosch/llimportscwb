import { Fragment } from 'react'
import { splitWords } from '../../../shared/lib/format.js'

/**
 * Renderiza o texto palavra a palavra com atraso escalonado (--i).
 * `start` permite continuar a contagem entre trechos do mesmo título.
 */
export default function RevealText({ text, start = 0 }) {
  const words = splitWords(text)
  return words.map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <span className="reveal-word" style={{ '--i': start + i }}>
        {word}
      </span>
      {i < words.length - 1 ? ' ' : null}
    </Fragment>
  ))
}
