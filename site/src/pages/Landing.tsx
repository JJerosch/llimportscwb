import { Hero } from '../components/sections/Hero'
import { Categorias } from '../components/sections/Categorias'
import { Lancamentos } from '../components/sections/Lancamentos'
import { PorQueLL } from '../components/sections/PorQueLL'
import { Avaliacoes } from '../components/sections/Avaliacoes'
import { Clube } from '../components/sections/Clube'
import { Loja } from '../components/sections/Loja'
import { FAQ } from '../components/sections/FAQ'

export default function Landing() {
  return (
    <main>
      <Hero />
      <Categorias />
      <Lancamentos />
      <PorQueLL />
      <Avaliacoes />
      <Clube />
      <Loja />
      <FAQ />
    </main>
  )
}
