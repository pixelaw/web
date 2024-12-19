import Main from "@/Main.tsx"
import React from "react"
import ReactDOM from "react-dom/client"
import "@/index.css"
import { StarknetProvider } from "@/components/starknet-provider"
import { mainnet } from "@starknet-react/chains"
import { StarknetConfig, publicProvider } from "@starknet-react/core"

import { PixelawProvider } from "@/providers/PixelawProvider.tsx"
import { BrowserRouter } from "react-router-dom"

// import cartridgeConnector from "@/dojo/CartridgeController"
const rootElement = document.getElementById("root")

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <StarknetConfig chains={[mainnet]} provider={publicProvider()} connectors={[]}>
                <PixelawProvider>
                    <BrowserRouter>
                        <Main />
                    </BrowserRouter>
                </PixelawProvider>
            </StarknetConfig>
        </React.StrictMode>,
    )
} else {
    console.error("Failed to find the root element")
}
