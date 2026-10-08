import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const config = defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    {
      name: "load-env",
      enforce: "pre",
      configResolved(config) {
        Object.assign(process.env, loadEnv(config.mode, config.root, ""));
      },
    },
  ],
  resolve: {
    tsconfigPaths: true,
  },
});

export default config;
