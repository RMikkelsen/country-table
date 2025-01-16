import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgrPlugin()],
  resolve: {
    alias: {
      '@': '/src',  // Ensure path alias works
    },

  },
  css: {
    preprocessorOptions: {
      scss: {
        // Ensure Vite can handle CSS if using SCSS or global styles
        additionalData: '@elastic/eui/dist/eui_theme_light.css',
        assetsInclude: ['**/*.svg'],

      },
    },
  },

})

