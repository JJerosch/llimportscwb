import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5174,
    // Permite importar ../shared (tokens, dados e lib comuns)
    fs: { allow: ['..'] },
  },
})
