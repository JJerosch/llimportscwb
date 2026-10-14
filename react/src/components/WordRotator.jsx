import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Palavra rotativa com transição blur + slide (estilo motionsites).
 * A largura do container acompanha a palavra ativa, evitando espaços vazios.
 */
export default function WordRotator({ words, interval = 2600 }) {
  const [state, setState] = useState({ index: 0, prev: null })
  const [width, setWidth] = useState()
  const refs = useRef([])

  useEffect(() => {
    if (words.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      setState((s) => ({ prev: s.index, index: (s.index + 1) % words.length }))
    }, interval)
    return () => clearInterval(id)
  }, [words.length, interval])

  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[state.index]
      if (el) setWidth(el.offsetWidth)
    }
    measure()
    document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [state.index])

  return (
    <span className="rotator" style={{ width }} aria-live="polite">
      {words.map((word, i) => {
        const cls = ['rotator__word', i === state.index && 'is-active', i === state.prev && 'is-leaving']
          .filter(Boolean)
          .join(' ')
        return (
          <span key={word} ref={(el) => (refs.current[i] = el)} className={cls} aria-hidden={i !== state.index}>
            {word}
          </span>
        )
      })}
    </span>
  )
}
