import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          //@azure/storage-blob: ['@azure/storage-blob']
        }
      }
    }
  }, 
  server: {
    proxy: {
      // Add your proxy configurations here
      '/api': {
        target: 'http://127.0.0.1:7071'
      },
    },
  },
})
