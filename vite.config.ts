import path from "path"
import react from "@vitejs/plugin-react"
import {defineConfig} from "vite"
import wasm from 'vite-plugin-wasm'
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
    build: {
        sourcemap: true
    },
    plugins: [
        react(),
        wasm(),
        topLevelAwait(),
    ],
    optimizeDeps: {},
    server: {},
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },

})
