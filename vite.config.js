import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base:'SnakeGame',
  server:{
    host:true
  },
  build:{
    outDir:'docs',
  }
})
