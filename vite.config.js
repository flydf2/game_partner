import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'

const publicDir = path.resolve(__dirname, 'public')

const publicPlugin = {
  name: 'public-proxy',
  configureServer(server) {
    server.middlewares.use('/public', (req, res) => {
      const urlPath = decodeURIComponent(req.url.split('?')[0])
      const filePath = path.join(publicDir, urlPath)
      const extname = path.extname(filePath)
      const contentTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
      }
      const contentType = contentTypes[extname] || 'application/octet-stream'

      fs.readFile(filePath, (err, content) => {
        if (err) {
          if (err.code === 'ENOENT') {
            res.writeHead(404)
            res.end('Not Found')
          } else {
            res.writeHead(500)
            res.end('Server Error')
          }
        } else {
          res.writeHead(200, { 'Content-Type': contentType })
          res.end(content)
        }
      })
    })
  }
}

export default defineConfig({
  plugins: [vue(), publicPlugin],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
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
