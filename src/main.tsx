import Main from "@/Main.tsx"
import React from "react"
import ReactDOM from "react-dom/client"
import "@/index.css"
import { StarknetProvider } from "@/components/starknet-provider"
import { PixelawProvider } from "@/providers/PixelawProvider.tsx"
import { BrowserRouter } from "react-router-dom"

const rootElement = document.getElementById("root")

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <StarknetProvider>
                <PixelawProvider>
                    <BrowserRouter>
                        <Main />
                    </BrowserRouter>
                </PixelawProvider>
            </StarknetProvider>
        </React.StrictMode>,
    )
} else {
    console.error("Failed to find the root element")
}
