import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      assets: path.resolve(__dirname, "./src/assets"),
      components: path.resolve(__dirname, "./src/components"),
      config: path.resolve(__dirname, "src/config"),
      core: path.resolve(__dirname, "./src/core"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      artifacts: path.resolve(__dirname, "./src/artifacts"),
    },
  },
  plugins: [react()],
});
