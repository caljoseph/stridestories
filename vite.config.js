import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    sourcemap: true,  // Enable source maps
  },
  plugins: [
    react(),          // Enables fast refresh, JSX, and other React features
    tsconfigPaths()   // Resolves paths from tsconfig.json, ensuring aliases work properly
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      '/ws': {
        target: 'ws://localhost:4000',
        ws: true,
      },
    },
  },
});