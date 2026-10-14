import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Optimized build & dev configuration for high-performance multi-core Intel i7-14700HX & RTX 5060
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1200,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor-core';
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    warmup: {
      clientFiles: [
        './src/App.jsx',
        './src/pages/DashboardPage.jsx',
        './src/pages/AccountsPage.jsx',
        './src/pages/ScanPage.jsx',
        './src/pages/BreachPage.jsx',
      ],
    },
  },
});
