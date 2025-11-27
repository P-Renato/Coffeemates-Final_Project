import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' 

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  
  ],
  // Ensure only one copy of React/ReactDOM/React Router is bundled to avoid
  // invalid hook call errors when dependencies resolve their own copies.
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
})
