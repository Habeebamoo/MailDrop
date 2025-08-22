import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  optimizeDeps: {
    include: ["papaparse"]
  },
  build: {
    rollupOptions: {
      external: ["papaparse"]
    },
    commonjsOptions: {
      include: [/papaparse/, /node_modules/]
    }
  }
})
