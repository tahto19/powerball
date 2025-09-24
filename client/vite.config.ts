import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // Ensure this is imported correctly
import mkcert from "vite-plugin-mkcert";
// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV == "production" ? "/cms/" : "/",
  plugins: [react()],
  // plugins: [react(), mkcert()],
  server: {
    port: 3000, // Replace 3000 with your desired port
    strictPort: true, // Exit if the port is already used
    // https: true,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
