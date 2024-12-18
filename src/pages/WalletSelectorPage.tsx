import useWalletConnection from "@/hooks/useWalletConnection.ts"
import type { Connector } from "@starknet-react/core"
import { useNavigate } from "react-router-dom"
import styles from "./WalletSelectorPage.module.css"

const WalletSelectorPage = () => {
    const { availableConnectors, currentConnector, currentAccount, status, activateConnector } = useWalletConnection()

    const navigate = useNavigate()

    const handleConnectorSelection = (connector: Connector | null) => {
        activateConnector(connector)
        navigate("/")
    }
    return (
        <div className={styles.inner}>
            <h1>Current Wallet</h1>
            <p>
                {currentConnector ? currentConnector.id : "none"} {status}{" "}
                {currentAccount ? currentAccount.address : "no account"}
            </p>

            <h1>Wallet Selector</h1>
            <ul className={styles.settingsList}>
                <li key="">
                    <button
                        type={"button"}
                        className={styles.menuButton}
                        onClick={() => handleConnectorSelection(null)}
                    >
                        None
                    </button>
                </li>
                {Object.entries(availableConnectors).map(([, availConnector]) => (
                    <li key={availConnector.id}>
                        <button
                            type={"button"}
                            className={styles.menuButton}
                            onClick={() => handleConnectorSelection(availConnector)}
                            disabled={currentConnector && currentConnector.id === availConnector.id}
                        >
                            {currentConnector && currentConnector.id === availConnector.id
                                ? `${availConnector.id} (Connected)`
                                : `Connect to ${availConnector.id}`}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default WalletSelectorPage
