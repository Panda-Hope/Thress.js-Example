import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  root: process.cwd(),
  base: process.env.NODE_ENV === 'production' ? '/nft/' : './',
  plugins: [vue()]
})
