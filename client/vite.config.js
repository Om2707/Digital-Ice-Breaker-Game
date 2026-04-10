import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    strictPort: false,
    // HMR configuration for network access
    hmr: {
      host: process.env.VITE_HMR_HOST || 'localhost',
      port: 5173,
      protocol: 'http',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
    // Increase timeouts for network requests
    middlewareMode: false,
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
