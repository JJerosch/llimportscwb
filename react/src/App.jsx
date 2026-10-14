import { useState } from 'react'
import { getSection } from '../../shared/lib/format.js'
import { sections as initialSections, products as initialProducts } from './lib/content.js'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Catalog from './components/Catalog.jsx'
import Flagship from './components/Flagship.jsx'
import Experience from './components/Experience.jsx'
import Reviews from './components/Reviews.jsx'
import FAQ from './components/FAQ.jsx'
import Location from './components/Location.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppFab from './components/WhatsAppFab.jsx'
import AdminDrawer from './components/AdminDrawer.jsx'

export default function App() {
  const [sections, setSections] = useState(initialSections)
  const [products, setProducts] = useState(initialProducts)

  const hero = getSection(sections, 'hero')
  const marquee = getSection(sections, 'marquee')
  const flagship = getSection(sections, 'flagship')
  const experience = getSection(sections, 'experience')
  const reviews = getSection(sections, 'reviews')
  const faq = getSection(sections, 'faq')

  const handleAddProduct = (newProd) => {
    setProducts((prev) => [newProd, ...prev])
  }

  const handleUpdatePrice = (id, newPrice) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: newPrice } : p))
    )
  }

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const handleToggleSection = (key) => {
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, visible: !s.visible } : s))
    )
  }

  return (
    <>
      <Header />
      <main>
        {hero && <Hero content={hero.content} />}
        {marquee && <Marquee items={marquee.content.items} />}
        <Catalog />
        {flagship && <Flagship content={flagship.content} />}
        {experience && <Experience content={experience.content} />}
        {reviews && <Reviews content={reviews.content} />}
        {faq && <FAQ content={faq.content} />}
        <Location />
      </main>
      <Footer />
      <WhatsAppFab />
      <AdminDrawer
        products={products}
        onAddProduct={handleAddProduct}
        onUpdatePrice={handleUpdatePrice}
        onDeleteProduct={handleDeleteProduct}
        sections={sections}
        onToggleSection={handleToggleSection}
      />
    </>
  )
}
