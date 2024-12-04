import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import graphqlLoader from "vite-plugin-graphql-loader";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import {fileURLToPath, URL} from 'url';
import {viteEnvs} from 'vite-envs'


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
            "@": fileURLToPath(new URL('./src', import.meta.url)),
            "@@": fileURLToPath(new URL('./config', import.meta.url)),
        },
    },
    build: {
        sourcemap: true,
        rollupOptions: {
            input: './src/main.tsx', // Adjust this line if your entry file is different
            external: ['src/scripts/**']
        }
    }
});
