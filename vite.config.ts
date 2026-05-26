import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [tailwindcss(), react()],
    server: {
      proxy: {
        '/api': {
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          target: env.VITE_API_URL,
        },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test-setup.ts'],
    },
  }
})
