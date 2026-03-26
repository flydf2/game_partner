import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:7088',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        timeout: 10000
      }
    },
    watch: {
      usePolling: true,
      interval: 100
    },
    hmr: {
      overlay: true
    }
  }
})
