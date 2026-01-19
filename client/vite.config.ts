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
      output: {
        manualChunks(id) {
          // Split node_modules into separate chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('react-router-dom')) {
              return 'vendor-router';
            }
            if (id.includes('react-icons')) {
              return 'vendor-icons';
            }
            if (id.includes('leaflet')) {
              return 'vendor-maps';
            }
            return 'vendor-other';
          }
        }
      }
    },
    chunkSizeWarningLimit: 800, 
  }
})