import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      proxy: {
        "/api":
          env?.VITE_API_BASE_URL ||
          "https://nlw-journey-node-yzzp.onrender.com" ||
          "http://localhost:3333",
      },
    },
    plugins: [react()],
  };
});
