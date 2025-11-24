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
        target: 'http://localhost:4343',
        changeOrigin: true,
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
      // Ensure proper handling of entry points
    }
  }
})
