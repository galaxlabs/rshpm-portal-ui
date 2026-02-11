import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const frappeTarget = env.VITE_FRAPPE_BASE_URL || 'https://dev.galaxylabs.online';
  const useHttps = mode === 'https';
  const apiKey = env.FRAPPE_API_KEY || env.VITE_FRAPPE_API_KEY;
  const apiSecret = env.FRAPPE_API_SECRET || env.VITE_FRAPPE_API_SECRET;
  const proxyHeaders =
    apiKey && apiSecret
      ? {
          Authorization: `token ${apiKey}:${apiSecret}`,
        }
      : undefined;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      https: useHttps,
      proxy: {
        '/api': {
          target: frappeTarget,
          changeOrigin: true,
          secure: false,
          headers: proxyHeaders,
          configure(proxy) {
            proxy.on('proxyRes', (proxyRes) => {
              const setCookie = proxyRes.headers['set-cookie'];
              if (!setCookie) return;

              const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
              proxyRes.headers['set-cookie'] = cookies.map((cookie) =>
                // In local HTTP dev, upstream Secure cookies are not stored by browser.
                useHttps ? cookie : cookie.replace(/;\s*Secure/gi, ''),
              );
            });
          },
        },
      },
    },
  };
});
