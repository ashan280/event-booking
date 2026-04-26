import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/Event-Booking-Seat-Reservation/",
  plugins: [tailwindcss(), react()],
  server: {
    port: 5173
  }
});
