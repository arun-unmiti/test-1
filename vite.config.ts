// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// import path from 'node:path'   // optional if you use aliases

export default defineConfig({
  base: '/dairy_profitability/',          // ← trailing slash is important

  plugins: [
    react(),
    tailwindcss(),
  ],

  // Optional: if you use @ alias for src/
  resolve: {
    alias: {
      '@': '/src',
      // or: path.resolve(__dirname, './src'),
    },
  },
})