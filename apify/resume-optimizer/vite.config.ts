import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api/rapidapi': {
        target: 'https://resumeoptimizerpro.p.rapidapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rapidapi/, ''),
      },
    },
  },
});

