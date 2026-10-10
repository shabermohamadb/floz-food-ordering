import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import expressApp from './server.js';

function expressPlugin() {
  return {
    name: 'express-plugin',
    configureServer(server) {
      server.middlewares.use(expressApp);
    }
  };
}

export default defineConfig({
  plugins: [react(), expressPlugin()],
  server: {
    port: 5173,
    host: '0.0.0.0'
  }
});
