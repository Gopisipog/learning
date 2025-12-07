import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
	  server: {
	    proxy: {
	      '/api': {
	        target: 'http://localhost:4001',
	        changeOrigin: true,
	      },
	      '/axios-scraper': {
	        target: 'http://localhost:4002',
	        changeOrigin: true,
	      },
	    },
	  },
})
