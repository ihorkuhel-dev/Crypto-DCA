import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => ({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      routesDirectory: './src/app/routes',
      generatedRouteTree: './src/app/route-tree.gen.ts',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    mode === 'analyze' &&
      visualizer({
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
        open: true,
      }),
  ].filter(Boolean),
  build: {
    sourcemap: 'hidden',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'vendor-react';
            }
            if (id.includes('lightweight-charts')) {
              return 'vendor-charts';
            }
            if (id.includes('dexie') || id.includes('@tanstack/react-query')) {
              return 'vendor-data';
            }
          }
          return undefined;
        },
      },
    },
  },
  optimizeDeps: {
    include: ['dexie', 'lightweight-charts'],
  },
}));
