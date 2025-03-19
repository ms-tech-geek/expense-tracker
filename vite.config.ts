import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      input: [
        resolve(__dirname, 'index.html'),
        resolve(__dirname, 'public/sw.js')
      ]
    }
  }
});
