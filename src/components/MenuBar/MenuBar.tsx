import { formatAddress } from "@/global/utils.js"
import { usePixelawProvider } from "@/providers/PixelawProvider.js"
import { useAccount } from "@starknet-react/core"
import type React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import styles from "./MenuBar.module.css"

const MenuBar: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { dojoStuff, world } = usePixelawProvider()
    const { address } = useAccount()

    if (!dojoStuff) return
    console.log(address)
    // Determine if the settings page is shown based on the current path
    const showSettings = location.pathname === "/settings"
    const showWorldSelector = location.pathname === "/world"
    const showWalletSelector = location.pathname === "/wallet"

    const toggleSettings = () => {
        if (showSettings) {
            navigate("/")
        } else {
            navigate("/settings") // Navigate to settings if not currently showing
        }
    }
    const toggleWalletSelector = () => {
        if (showWalletSelector) {
            navigate("/")
        } else {
            navigate("/wallet")
        }
    }

    const toggleWorldSelector = () => {
        if (showWorldSelector) {
            navigate("/")
        } else {
            navigate("/world") // Navigate to settings if not currently showing
        }
    }
    return (
        <div className={styles.inner}>
            <div className={styles.logoContainer}>
                <img src="/assets/logo/pixeLaw-logo.png" alt="logo" />
            </div>
            <div className={styles.rightSection}>
                <button type={"button"} className={styles.menuButton} onClick={toggleWalletSelector}>
                    Wallet {address ? `: ${formatAddress(address)}` : "not connected"}
                </button>
                <button type={"button"} className={styles.menuButton} onClick={toggleWorldSelector}>
                    World ({world})
                </button>
                <button type={"button"} className={styles.menuButton} onClick={toggleSettings}>
                    Settings
                </button>
            </div>
        </div>
    )
}

export default MenuBar
