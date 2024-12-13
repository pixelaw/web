import styles from "./SettingsPage.module.css"
import {
    Connector,
    InjectedConnector,
    useAccount,
    useConnect,
    useDisconnect
} from "@starknet-react/core";
import { ControllerConnector } from "@cartridge/connector";
import  {useCallback} from "react";
import {ArgentMobileConnector, isInArgentMobileAppBrowser} from "starknetkit/argentMobile";
import {constants} from "starknet";
import {WebWalletConnector} from "starknetkit/webwallet";


const WalletSelectorPage = () => {
    const { connectAsync } = useConnect();
    const { disconnectAsync } = useDisconnect();

    const rpc = useCallback(() => {
        return { nodeUrl: 'https://api.cartridge.gg/x/starknet/mainnet' };
    }, []);

    const controllerConnector = new ControllerConnector({
        rpc: rpc().nodeUrl,
    }) as never as Connector

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
            controllerConnector,
        ];

    const { address: currentAddress, connector: currentConnector, account: currentAccount,status } = useAccount();


    const toggleConnector = async (connector: Connector) => {
        if(currentConnector && currentConnector.id === connector.id){
            await disconnectAsync()
        }else{
            try {
                await connectAsync({ connector });
                // Handle successful connection
            } catch (error) {
                console.error("Connection failed:", error)
                // Handle connection error
            }
        }

    }

    console.log("c", currentConnector)
    console.log("a", currentAccount)
    return (
        <div className={styles.inner}>
            <h1>Current Wallet</h1>
            <p>account: {currentAccount?currentAccount.address:"no account"}</p>
            <p>connector: {currentConnector?currentConnector.id:"none"}</p>
            <p>address: {currentAddress}</p>
            <p>status: {status}</p>

            <h1>Wallet Selector</h1>
            <ul className={styles.settingsList}>
                {Object.entries(availableConnectors).map(([, availConnector]) => (
                    <li
                    key={availConnector.id}>
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
