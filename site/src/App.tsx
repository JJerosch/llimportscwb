import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/SiteLayout'

const Landing = lazy(() => import('./pages/Landing'))
const Catalogo = lazy(() => import('./pages/Catalogo'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/catalogo" element={<Catalogo />} />
          </Route>
          <Route path="/admin" element={<AdminLogin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
