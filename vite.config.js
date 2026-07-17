import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuracion de Vite para el proyecto VetCitas
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
