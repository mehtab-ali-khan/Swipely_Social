import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["fa7e-223-123-43-69.ngrok-free.app"], // Add the host here
    allowedHosts: ["c5ae-223-123-38-32.ngrok-free.app"], // Add the host here
    allowedHosts: ["7a38-223-123-38-33.ngrok-free.app"], // Add the host here
    allowedHosts: ["1f527462ff10.ngrok-free.app"], // Add the host here
  },
});
