import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repositoryBase = '/Spadshchyna_landing/';
const base =
  process.env.VITE_BASE_PATH ??
  (process.env.NODE_ENV === 'production' ? repositoryBase : '/');
const assetPathScss = path
  .resolve(__dirname, 'src/styles/scss/asset-path')
  .replace(/\\/g, '/');

export default defineConfig({
  base,
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
        additionalData: (source, filename) => {
          if (
            filename.includes('node_modules') ||
            filename.endsWith('_asset-path.scss')
          ) {
            return source;
          }

          return `@use "${assetPathScss}" as * with ($asset-base: "${base}");\n${source}`;
        },
      },
    },
  },
});
