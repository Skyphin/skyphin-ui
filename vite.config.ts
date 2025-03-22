import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import manifest from "./manifest.json";

export default defineConfig({
  plugins: [react(), crx({ manifest }), tailwindcss()],
  legacy: {
    skipWebSocketTokenCheck: true, // https://github.com/crxjs/chrome-extension-tools/issues/971
  },
});
