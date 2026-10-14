import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Permite importar ../shared (estilos, dados e utilitários comuns às versões React e Vue)
    fs: { allow: ['..'] },
  },
})
