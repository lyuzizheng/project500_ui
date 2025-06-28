import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'custom-image-cache-control',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
            res.setHeader('Cache-Control', 'max-age=3600');
          }
          next();
        });
      },
    },
  ],
})
