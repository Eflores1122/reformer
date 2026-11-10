import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const base = '/reformer/';
export default defineConfig({
  base,
  build: {rollupOptions:{output:{manualChunks:{react:['react','react-dom'],validation:['zod'],storage:['dexie']}}}},
  plugins: [react(), VitePWA({
    registerType: 'prompt',
    includeAssets: ['icon.svg', 'icon-192.png', 'icon-512.png'],
    manifest: {
      id: base, name: 'REFORMER. Tu práctica', short_name: 'REFORMER',
      description: 'Crea y sigue tu práctica de Pilates Reformer. Tus datos permanecen en tu dispositivo.',
      lang: 'es', start_url: base, scope: base, display: 'standalone',
      background_color: '#f7f8fa', theme_color: '#254b51',
      icons: [
        {src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any'},
        {src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any'},
        {src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any'}
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,woff2,webmanifest}'],
      navigateFallback: `${base}index.html`,
      navigateFallbackAllowlist: [/^\/reformer\//],
      cleanupOutdatedCaches: true
    }
  })],
  test: { include: ['src/**/*.test.ts'], setupFiles: ['src/test-setup.ts'] }
});
