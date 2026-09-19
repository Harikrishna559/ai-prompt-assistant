import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import handler from './api/improve.ts';

function apiDevServerPlugin(): Plugin {
  return {
    name: 'api-dev-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && (req.url === '/api/improve' || req.url.startsWith('/api/improve?'))) {
          try {
            await handler(req, res);
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Dev Server Internal Error', message: err?.message }));
          }
        } else {
          next();
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load server-side environment variables from .env into process.env
  // NOTE: Non-VITE_ variables loaded here are accessible ONLY to the server/node process
  // and are NEVER bundled or exposed to the browser/client.
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }

  return {
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
    plugins: [react(), apiDevServerPlugin()],
  };
});

