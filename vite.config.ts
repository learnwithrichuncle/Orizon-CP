import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite";

const apiPort = process.env.PORT ?? "4310";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      routesDirectory: "./src/frontend/routes",
      generatedRouteTree: "./src/frontend/routeTree.gen.ts"
    }),
    tailwindcss(),
    react()
  ],
  build: {
    outDir: "dist/frontend",
    emptyOutDir: true
  },
  server: {
    port: 5173,
    proxy: {
      "/api": `http://localhost:${apiPort}`
    }
  }
});
