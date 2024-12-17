import { usePixelawProvider } from "@/providers/PixelawProvider.tsx"

import useSettingStore from "@/stores/SettingStore.ts"
import { type Connector, InjectedConnector, useAccount, useConnect, useDisconnect } from "@starknet-react/core"
import { useEffect, useState } from "react"
import { constants } from "starknet"
import { ArgentMobileConnector, isInArgentMobileAppBrowser } from "starknetkit/argentMobile"
import { WebWalletConnector } from "starknetkit/webwallet"

const useWalletConnection = () => {
    const { setCurrentWallet } = useSettingStore()
    const { connectAsync } = useConnect()
    const { disconnectAsync } = useDisconnect()
    const { connector: currentConnector, account: currentAccount, status } = useAccount()

    const [availableConnectors, setAvailableConnectors] = useState<Connector[]>([])

    const { dojoStuff } = usePixelawProvider()

    const { controllerConnector, burnerConnector } = dojoStuff || {}

    useEffect(() => {
        const connectors = isInArgentMobileAppBrowser()
            ? [
                  ArgentMobileConnector.init({
                      options: {
                          url: typeof window !== "undefined" ? window.location.href : "",
                          dappName: "PixeLAW",
                          chainId: constants.NetworkName.SN_SEPOLIA,
                      },
                  }),
              ]
            : [
                  new InjectedConnector({ options: { id: "argentX" } }),
                  new InjectedConnector({ options: { id: "braavos" } }),
                  ArgentMobileConnector.init({
                      options: {
                          url: typeof window !== "undefined" ? window.location.href : "",
                          dappName: "PixeLAW",
                          chainId: constants.NetworkName.SN_MAIN,
                      },
                  }),
                  new WebWalletConnector({ url: "https://web.argent.xyz" }),
              ]

        if (controllerConnector) {
            connectors.push(controllerConnector)
        }

        if (burnerConnector) {
            connectors.push(burnerConnector as unknown as Connector)
        }

        setAvailableConnectors(connectors)
    }, [controllerConnector, burnerConnector])

    const toggleConnector = async (connector: Connector | null) => {
        if (!connector) {
            await disconnectAsync()
            setCurrentWallet("")
        } else if (currentConnector && currentConnector.id === connector.id) {
            await disconnectAsync()
        } else {
            try {
                await connectAsync({ connector })
                setCurrentWallet(connector.id)
            } catch (error) {
                console.error("Connection failed:", error)
            }
        }
    }

    useEffect(() => {
        if (currentConnector) {
            setCurrentWallet(currentConnector.id)
        }
    }, [currentConnector, setCurrentWallet])

    return { availableConnectors, currentConnector, currentAccount, status, toggleConnector }
}

export default useWalletConnection
