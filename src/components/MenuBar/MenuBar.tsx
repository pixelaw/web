import { formatWalletAddress } from "@/global/utils.js"
import { usePixelawProvider } from "@/providers/PixelawProvider.js"
import type React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import styles from "./MenuBar.module.css"

const MenuBar: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { dojoStuff } = usePixelawProvider()

    if (!dojoStuff) return
    const walletAddress = dojoStuff.userAccount?.address
    if (!walletAddress) return

    // Determine if the settings page is shown based on the current path
    const showSettings = location.pathname === "/settings"
    const showWorldSelector = location.pathname === "/world"
    const showWalletSelector = location.pathname === "/wallet"

    const toggleSettings = () => {
        if (showSettings) {
            navigate(-1) // Go back if we're currently showing settings
        } else {
            navigate("/settings") // Navigate to settings if not currently showing
        }
    }
    const toggleWalletSelector = () => {
        if (showWalletSelector) {
            navigate(-1) // Go back if we're currently showing settings
        } else {
            navigate("/wallet")
        }
    }

    const toggleWorldSelector = () => {
        if (showWorldSelector) {
            navigate(-1) // Go back if we're currently showing settings
        } else {
            navigate("/world") // Navigate to settings if not currently showing
        }
    }
    return (
        <div className={styles.inner}>
            <div className={styles.logoContainer}>
                <img
                    src="/assets/logo/pixeLaw-logo.png"
                    alt="logo"
                />
            </div>
            <div className={styles.rightSection}>
                <div className={styles.addressContainer}>{formatWalletAddress(walletAddress)}</div>
                <div className={styles.addressContainer}>World: dev(0x4adbe4)</div>
                <button
                    type={"button"}
                    className={styles.menuButton}
                    onClick={toggleWalletSelector}
                >
                    Wallet
                </button>
                <button
                    type={"button"}
                    className={styles.menuButton}
                    onClick={toggleWorldSelector}
                >
                    World
                </button>
                <button
                    type={"button"}
                    className={styles.menuButton}
                    onClick={toggleSettings}
                >
                    Settings
                </button>
            </div>
        </div>
    )
}

export default MenuBar
