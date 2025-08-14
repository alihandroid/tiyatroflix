import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import type { Plugin, ResolvedConfig } from 'vite'

const validateEnvironmentVariables = (): Plugin => {
  let config: ResolvedConfig
  return {
    name: 'validate-environment-variables',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    async buildStart() {
      const originalEnv = process.env
      try {
        process.env = { ...process.env, ...loadEnv(config.mode, process.cwd()) }
        await import('./src/env')
      } finally {
        process.env = originalEnv
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
    validateEnvironmentVariables(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
