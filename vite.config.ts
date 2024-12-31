import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: "gzip",
      threshold: 10240,
    }),
  ],
  css: {
    postcss: "./postcss.config.ts",
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.info", "console.debug"],
      },
      mangle: {
        toplevel: true,
      },
      output: {
        comments: false,
      },
    },
  },
});
