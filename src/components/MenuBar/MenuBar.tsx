import { formatWalletAddress } from "@/global/utils.js"
import { usePixelawProvider } from "@/providers/PixelawProvider.js"
import type React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import styles from "./MenuBar.module.css"

const MenuBar: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { gameData } = usePixelawProvider()

    if (!gameData) return
    const walletAddress = gameData.account.account?.address
    if (!walletAddress) return

    // Determine if the settings page is shown based on the current path
    const showSettings = location.pathname === "/settings"

    const toggleSettings = () => {
        if (showSettings) {
            navigate(-1) // Go back if we're currently showing settings
        } else {
            navigate("/settings") // Navigate to settings if not currently showing
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
