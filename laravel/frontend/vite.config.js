import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// http://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: 'localhost',
    port: 5173,
  },
})
