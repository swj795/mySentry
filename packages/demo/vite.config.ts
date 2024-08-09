import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    preserveSymlinks: true
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/getErrorList': {
        target: 'http://localhost:3000',
        changeOrigin: false, //  target是域名的话，需要这个参数，
        secure: false
      },
      '/addError': {
        target: 'http://localhost:3000',
        changeOrigin: false, //  target是域名的话，需要这个参数，
        secure: false
      },
      '/getSourceMap': {
        target: 'http://localhost:3000',
        changeOrigin: false, //  target是域名的话，需要这个参数，
        secure: false
      }
    }
  },
  build: {
    sourcemap: 'hidden'
  }
})
