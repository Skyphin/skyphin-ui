import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import manifest from "./manifest.json";
import graphqlLoader from "vite-plugin-graphql-loader";

export default defineConfig({
  plugins: [react(), graphqlLoader(), crx({ manifest }), tailwindcss()],
  legacy: {
    skipWebSocketTokenCheck: true, // https://github.com/crxjs/chrome-extension-tools/issues/971
  },
});
