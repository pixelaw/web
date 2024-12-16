import { usePixelawProvider } from "@/providers/PixelawProvider.tsx"
import { BurnerConnector } from "@dojoengine/create-burner"
import { type Connector, InjectedConnector, useAccount, useConnect, useDisconnect } from "@starknet-react/core"
import { constants } from "starknet"
import { ArgentMobileConnector, isInArgentMobileAppBrowser } from "starknetkit/argentMobile"
import { WebWalletConnector } from "starknetkit/webwallet"
import styles from "./WalletSelectorPage.module.css"

const WalletSelectorPage = () => {
    const { connectAsync } = useConnect()
    const { disconnectAsync } = useDisconnect()

    const { dojoStuff } = usePixelawProvider()

    const availableConnectors = isInArgentMobileAppBrowser()
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

    if (dojoStuff?.controllerConnector) {
        availableConnectors.push(dojoStuff?.controllerConnector)
    }

    // if (dojoStuff?.burnerManager) {
    //     availableConnectors.push(BurnerConnector)
    // }

    const { connector: currentConnector, account: currentAccount, status } = useAccount()

    const toggleConnector = async (connector: Connector) => {
        if (currentConnector && currentConnector.id === connector.id) {
            await disconnectAsync()
        } else {
            try {
                await connectAsync({ connector })
            } catch (error) {
                console.error("Connection failed:", error)
            }
        }
    }

    return (
        <div className={styles.inner}>
            <h1>Current Wallet</h1>
            <p>account: {currentAccount ? currentAccount.address : "no account"}</p>
            <p>connector: {currentConnector ? currentConnector.id : "none"}</p>
            <p>status: {status}</p>

            <h1>Wallet Selector</h1>
            <ul className={styles.settingsList}>
                {Object.entries(availableConnectors).map(([, availConnector]) => (
                    <li key={availConnector.id}>
                        <button
                            type={"button"}
                            className={styles.menuButton}
                            onClick={() => toggleConnector(availConnector)}
                        >
                            {currentConnector && currentConnector.id === availConnector.id
                                ? `Disconnect ${availConnector.id}`
                                : `Connect to ${availConnector.id}`}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default WalletSelectorPage
