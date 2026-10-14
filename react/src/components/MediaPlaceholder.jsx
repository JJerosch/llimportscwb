import { ImagePlus } from 'lucide-react'

/**
 * Espaço reservado para mídia. Será substituído pela imagem/vídeo
 * que o admin enviar (Fase 4).
 */
export default function MediaPlaceholder({ label = 'Espaço para imagem ou vídeo do produto', device = true }) {
  return (
    <div className="media-ph" role="img" aria-label={label}>
      {device && <div className="media-ph__device" />}
      <span className="media-ph__label">
        <ImagePlus />
        {label}
      </span>
    </div>
  )
}
