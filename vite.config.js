import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: '.',
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, '.'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        volunteer: resolve(import.meta.dirname, 'volunteer.html'),
        pets: resolve(import.meta.dirname, 'pets.html'),
        consent: resolve(import.meta.dirname, 'consent.html'),
        feedback: resolve(import.meta.dirname, 'feedback.html'),
        admin: resolve(import.meta.dirname, 'admin.html'),
        sonar: resolve(import.meta.dirname, 'sonar.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
