import { defineConfig } from 'vite';
import react from '@vitejs/react-vite';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200, // Safe buffer limit
    rollupOptions: {
      output: {
        // 🌟 Automatically split node_modules into distinct dependency chunks
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('google') || id.includes('gemini')) {
              return 'vendor-ai';
            }
            return 'vendor-core'; // React, lucide, etc.
          }
        },
      },
    },
  },
});