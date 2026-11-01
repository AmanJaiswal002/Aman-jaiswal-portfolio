
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://aman-jaiswal-portfolio-server.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
