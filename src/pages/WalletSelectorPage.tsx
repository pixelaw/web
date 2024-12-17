import useWalletConnection from "@/hooks/useWalletConnection.ts"
import styles from "./WalletSelectorPage.module.css"

const WalletSelectorPage = () => {
    const { availableConnectors, currentConnector, currentAccount, status, toggleConnector } = useWalletConnection()

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
