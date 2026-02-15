import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const frappeTarget = env.VITE_FRAPPE_URL || "https://dev.galaxylabs.online";

  console.log("✅ VITE CONFIG LOADED rshpm-portal-ui, target =", frappeTarget);

  return {
    plugins: [react(), basicSsl()],
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      https: {},

      proxy: {
        "/api": {
          target: frappeTarget,
          changeOrigin: true,
          secure: false,
          configure(proxy) {
            proxy.on("proxyReq", (_proxyReq, req) => {
              console.log("➡️ proxyReq", req.method, req.url);
            });

            proxy.on("proxyRes", (proxyRes) => {
              const setCookie = proxyRes.headers["set-cookie"];
              if (!setCookie) return;

              const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
              proxyRes.headers["set-cookie"] = cookies.map((cookie) =>
                cookie
                  // allow cookie to be stored when dev server is https with self-signed
                  .replace(/;\s*Domain=[^;]+/gi, "")
              );
            });

            proxy.on("error", (err) => {
              console.log("❌ proxy error:", err?.message || err);
            });
          },
        },

        "/printview": {
          target: frappeTarget,
          changeOrigin: true,
          secure: false,
        },

        "/files": {
          target: frappeTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
