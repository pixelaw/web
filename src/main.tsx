import App from "@/App.tsx"
import React from "react"
import ReactDOM from "react-dom/client"
import "@/index.css"
import {PixelawProvider} from "@/providers/PixelawProvider.tsx"
import {BrowserRouter} from "react-router-dom"
import {StarknetProvider} from "@/components/starknet-provider";

const rootElement = document.getElementById("root")

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
                <PixelawProvider>
                    <StarknetProvider>
                    <BrowserRouter>
                        <App/>
                    </BrowserRouter>
                    </StarknetProvider>
                </PixelawProvider>
        </React.StrictMode>,
    )
} else {
    console.error("Failed to find the root element")
}
