import App from "@/App.tsx"
import React from "react"
import ReactDOM from "react-dom/client"
import "@/index.css"
import { PixelawProvider } from "@/providers/PixelawProvider.tsx"
import { BrowserRouter } from "react-router-dom"

console.log(import.meta.env)

const rootElement = document.getElementById("root")
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <PixelawProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </PixelawProvider>
        </React.StrictMode>,
    )
} else {
    console.error("Failed to find the root element")
}
