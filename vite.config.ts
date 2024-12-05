import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import graphqlLoader from "vite-plugin-graphql-loader";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import {viteEnvs} from 'vite-envs'
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        graphqlLoader(),
        wasm(),
        topLevelAwait(),
        viteEnvs({
            declarationFile: ".env.example"
        })

    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        sourcemap: true,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'), // Ensure index.html is included
            },
            external: ['src/scripts/**']
        }
    }
});
