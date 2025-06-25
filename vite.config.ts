import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar env file basado en 'mode'
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: '/MiGustoLovers/',
    envDir: './', // Directorio donde buscar el archivo .env
    define: {
      // Hacer las variables de entorno disponibles globalmente
      'process.env.VITE_EMAILJS_SERVICE_ID': JSON.stringify(env.VITE_EMAILJS_SERVICE_ID),
      'process.env.VITE_EMAILJS_TEMPLATE_ID': JSON.stringify(env.VITE_EMAILJS_TEMPLATE_ID),
      'process.env.VITE_EMAILJS_PUBLIC_KEY': JSON.stringify(env.VITE_EMAILJS_PUBLIC_KEY),
      'process.env.VITE_SHEETDB_URL': JSON.stringify(env.VITE_SHEETDB_URL)
    }
  };
});
