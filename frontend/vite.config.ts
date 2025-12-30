import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import * as fs from 'node:fs'
import * as path from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    // Vercel SPA 라우팅을 위한 _routes.json 생성 플러그인
    {
      name: 'vercel-spa-routes',
      closeBundle() {
        const routesPath = path.resolve(__dirname, 'dist/_routes.json')
        const routes = {
          version: 3,
          routes: [
            { handle: "filesystem" },
            { src: "/.*", dest: "/index.html" }
          ]
        }
        fs.writeFileSync(routesPath, JSON.stringify(routes, null, 2))
        console.log('✅ _routes.json 생성 완료')
      }
    }
  ],
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
