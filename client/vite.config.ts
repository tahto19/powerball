import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // Ensure this is imported correctly

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV == "production" ? "/cms/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssr: {
    noExternal: ["html5-qrcode"],
  },
  build: {
    rollupOptions: {
      output: {
        globals: {
          "html5-qrcode": "Html5QrcodeScanner", // or just 'html5Qrcode'
        },
      },
    },
  },
});
