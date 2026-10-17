import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '../lib/cn'

type Props = {
  words: string[]
  /** Tempo entre trocas, em ms. */
  interval?: number
  className?: string
}

/**
 * Palavra rotativa com transição de blur + deslize (portada do app React antigo).
 * A largura do contêiner acompanha a palavra ativa, para a frase não ficar com vão.
 * É decorativa (aria-hidden): quem precisa da frase completa usa o texto para leitores de tela do pai.
 */
export function WordRotator({ words, interval = 2600, className }: Props) {
  const [state, setState] = useState<{ index: number; prev: number | null }>({ index: 0, prev: null })
  const [width, setWidth] = useState<number>()
  const refs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (words.length < 2) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
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
    // a largura muda quando a fonte web termina de carregar
    document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [state.index])

  return (
    <span className={cn('rotator', className)} style={{ width }} aria-hidden>
      {words.map((word, i) => (
        <span
          key={word}
          ref={(el) => {
            refs.current[i] = el
          }}
          className={cn('rotator__word', i === state.index && 'is-active', i === state.prev && 'is-leaving')}
        >
          {word}
        </span>
      ))}
    </span>
  )
}
