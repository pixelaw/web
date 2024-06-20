import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import graphqlLoader from "vite-plugin-graphql-loader";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import {fileURLToPath, URL} from 'url';
import ImportMetaEnvPlugin from "@import-meta-env/unplugin";

export default defineConfig({
    plugins: [
        react(),
        graphqlLoader(),
        wasm(),
        topLevelAwait(),
        ImportMetaEnvPlugin.vite({
            example: ".env.example",
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    define: {
        'import.meta.env.WORLD_ADDRESS': JSON.stringify(process.env.WORLD_ADDRESS)
    }
});
