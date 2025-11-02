// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

const backendPort = parseInt(process.env.PORT || "5001", 10);

// https://astro.build/config
export default defineConfig({
    integrations: [react()],
    site: 'http://localhost:5001',
    server:{
        port: 3000
    },
    outDir: '../dist/frontend',

    vite: {
        server: {
            proxy: {
                '/api': {
                    target: `http://localhost:${backendPort}`,
                    changeOrigin: true,
                },
            },
        },
        resolve: {
            alias: {
                '@openspot/shared': '../shared/src',
            },
        },
        optimizeDeps: {
            include: ['chartjs-adapter-date-fns'],
        },
    },

    adapter: node({
        mode: 'standalone',
    }),
});