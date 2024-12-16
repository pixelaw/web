import { formatAddress } from "@/global/utils.ts"
import { usePixelawProvider } from "@/providers/PixelawProvider.tsx"
import useSettingStore from "@/stores/SettingStore.ts"
import { BurnerConnector } from "@dojoengine/create-burner"
import { type Connector, InjectedConnector, useAccount, useConnect, useDisconnect } from "@starknet-react/core"
import { constants } from "starknet"
import { ArgentMobileConnector, isInArgentMobileAppBrowser } from "starknetkit/argentMobile"
import { WebWalletConnector } from "starknetkit/webwallet"
import styles from "./WalletSelectorPage.module.css"

const WalletSelectorPage = () => {
    const { setCurrentWallet } = useSettingStore()
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

    if (dojoStuff?.burnerManager) {
        const burnerManager = dojoStuff.burnerManager

        const connector = new BurnerConnector(
            {
                id: "burner",
                name: `burner_${formatAddress(burnerManager.account!.address)}`,
            },
            burnerManager.account!,
        )

        // FIXME somehow property request is missing?
        availableConnectors.push(connector)
    }

    const { connector: currentConnector, account: currentAccount, status } = useAccount()

    const toggleConnector = async (connector: Connector | null) => {
        if (!connector) {
            // Select "None"
            await disconnectAsync()
            setCurrentWallet("")
        } else if (currentConnector && currentConnector.id === connector.id) {
            // Toggle Off
            await disconnectAsync()
        } else {
            // Select a connector
            try {
                await connectAsync({ connector })
                setCurrentWallet(connector.id)
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
                <li key="">
                    <button type={"button"} className={styles.menuButton} onClick={() => toggleConnector(null)}>
                        None
                    </button>
                </li>
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
