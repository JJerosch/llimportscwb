import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn'

const PHOTO = '/media/escritorio-1.jpg'
const VIDEO = '/media/hero-main.mp4'

/** Só toca o vídeo (21 MB) em telas largas, sem economia de dados e sem preferência por menos movimento. */
function canPlayVideo() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (!matchMedia('(min-width: 768px)').matches) return false
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return !conn?.saveData
}

const BLUR_STEPS = [1, 2, 4, 8, 16, 24]

/**
 * Desfoque progressivo na base do hero: camadas com blur crescente (1 a 24 px), cada uma visível só numa faixa,
 * então o vídeo vai ficando mais borrado até se fundir com a seção seguinte.
 */
function ProgressiveBlur() {
  const n = BLUR_STEPS.length
  return (
    <div className="absolute inset-x-0 bottom-0 h-[48%]">
      {BLUR_STEPS.map((blur, i) => {
        const band = 100 / (n + 1)
        const stops = [i * band, (i + 1) * band, (i + 2) * band, (i + 3) * band].map((v) => Math.min(v, 100))
        const mask =
          i === n - 1
            ? `linear-gradient(to bottom, transparent ${stops[0]}%, #000 ${stops[1]}%)`
            : `linear-gradient(to bottom, transparent ${stops[0]}%, #000 ${stops[1]}%, #000 ${stops[2]}%, transparent ${stops[3]}%)`
        return (
          <div
            key={blur}
            className="absolute inset-0"
            style={{ backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)`, maskImage: mask, WebkitMaskImage: mask }}
          />
        )
      })}
    </div>
  )
}

/**
 * Fundo do hero em camadas: foto do escritório (sempre presente), vídeo por cima quando puder tocar,
 * véu na cor do tema para o título continuar legível e degradê final que funde com a página.
 */
export function HeroBackground() {
  const [useVideo] = useState(canPlayVideo)
  const [videoReady, setVideoReady] = useState(false)
  const video = useRef<HTMLVideoElement>(null)

  // O vídeo pode já estar tocando quando o React anexa o listener, então confere o estado além de ouvir o evento.
  useEffect(() => {
    const el = video.current
    if (!el) return
    const ready = () => setVideoReady(true)
    if (el.readyState >= 3) ready()
    el.addEventListener('canplay', ready)
    el.addEventListener('playing', ready)
    return () => {
      el.removeEventListener('canplay', ready)
      el.removeEventListener('playing', ready)
    }
  }, [useVideo])

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <img src={PHOTO} alt="" className="size-full object-cover object-center" fetchPriority="high" />
      {useVideo && (
        <video
          ref={video}
          src={VIDEO}
          poster={PHOTO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={cn(
            'absolute inset-0 size-full object-cover transition-opacity duration-1000',
            videoReady ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
      <div className="absolute inset-0 bg-bg/85" />
      <ProgressiveBlur />
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-b from-transparent to-bg" />
    </div>
  )
}
