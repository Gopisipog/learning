import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/brightdata': {
        target: 'https://api.brightdata.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/brightdata/, ''),
        secure: true,
      },
      '/api/openai': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openai/, ''),
        secure: true,
      },
    },
  },
})

