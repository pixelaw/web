import { usePixelawProvider } from "@/providers/PixelawProvider.tsx"

import useSettingStore from "@/stores/SettingStore.ts"
import { type Connector, InjectedConnector, useAccount, useConnect, useDisconnect } from "@starknet-react/core"
import { useEffect, useState } from "react"
import { constants } from "starknet"

import { ArgentMobileConnector, isInArgentMobileAppBrowser } from "starknetkit/argentMobile"
import { WebWalletConnector } from "starknetkit/webwallet"

const useWalletConnection = () => {
    const { setWallet } = useSettingStore()
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

    const activateConnector = async (newConnector: Connector | null) => {
        try {
            // Disconnect the current connector if it exists
            if (currentConnector) {
                await disconnectAsync()
            }

            // Connect to the new connector if provided
            if (newConnector) {
                await connectAsync({ connector: newConnector })
                setWallet(newConnector.id)
            } else {
                setWallet("")
            }
        } catch (error) {
            console.error("Activation failed:", error)
        }
    }

    useEffect(() => {
        if (currentConnector) {
            setWallet(currentConnector.id)
        }
    }, [currentConnector, setWallet])

    return { availableConnectors, currentConnector, currentAccount, status, activateConnector }
}

export default useWalletConnection
