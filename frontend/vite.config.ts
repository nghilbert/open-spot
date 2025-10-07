// vite.config.ts
import { defineConfig } from 'vite';

const port = parseInt(process.env.PORT || "5001", 10);

export default defineConfig({
    build: {
        outDir: "../dist/public",
        emptyOutDir: true,
    },
    server: {
        proxy: {
            "/api": {
                target: `http://localhost:${port}`,
                changeOrigin: true
            }
        }
    },
    resolve: {
        alias: {
            '@openspot/shared': '../shared/src'
        }
    }
});