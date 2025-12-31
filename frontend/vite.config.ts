import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    assetsInlineLimit: 0
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    cors: true,
    hmr: {
      protocol: 'wss',
      host: '5173-i6r6jliglgzdb351giv75-2b54fc91.sandbox.novita.ai',
      clientPort: 443
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
