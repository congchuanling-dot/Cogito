import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9090',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    dedupe: [
      'prosemirror-model',
      'prosemirror-state',
      'prosemirror-transform',
      'prosemirror-view',
      'prosemirror-commands',
      'prosemirror-keymap',
      'prosemirror-history',
      'prosemirror-schema-list',
      'prosemirror-tables',
      'prosemirror-dropcursor',
      'prosemirror-gapcursor',
      'prosemirror-changeset',
    ],
  },
})
