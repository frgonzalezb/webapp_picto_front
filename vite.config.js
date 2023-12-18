import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'

const sslKeyPath = './key.pem'
const sslCertPath = './cert.pem'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    port: 8081,
    headers: {
      'x-content-type-options': 'nosniff',
    },
    https: {
      key: sslKeyPath,
      cert: sslCertPath,
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
