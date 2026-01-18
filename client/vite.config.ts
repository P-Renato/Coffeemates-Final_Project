import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Proxy API calls to your backend
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:4343',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      '/uploads': {
        target: process.env.VITE_API_URL || 'http://localhost:4343',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:4343',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        // Add this for 404 handling
        '404': '404.html'
      }
    }
  }
})


