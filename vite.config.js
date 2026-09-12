import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    port: 3000,
    open: false,
    watch: {
      ignored: ['**/public/fotos/**', '**/fotos vila sapo/**']
    }
  }
});
