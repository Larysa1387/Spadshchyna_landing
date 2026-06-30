import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repositoryBase = '/Spadshchyna_landing/';

export default defineConfig({
  base:
    process.env.VITE_BASE_PATH ??
    (process.env.NODE_ENV === 'production' ? repositoryBase : '/'),
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://spadshchyna-teamproject.duckdns.org',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
