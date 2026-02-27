import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // or host: '0.0.0.0'
    port: 5173, // or your desired port
  },
  define: {
    global: "window", // Polyfill the global object to window
  },
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: "192.168.0.75", // Allows access from other devices on the network
//     // Or specify an IP address: host: '192.168.1.100'
//     // Or for specific scenarios like VS Code Dev Containers: host: '127.0.0.1'
//     port: 5173, // Or your desired port
//   },
// });
