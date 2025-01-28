import Loading from "@/components/Loading/Loading.tsx"
import MenuBar from "@/components/MenuBar/MenuBar.tsx"
import GamePage from "@/pages/GamePage/GamePage.tsx"
import SettingsPage from "@/pages/SettingsPage.tsx"
import WalletSelectorPage from "@/pages/WalletSelectorPage.tsx"
import WorldSelectorPage from "@/pages/WorldSelectorPage.tsx"
import { usePixelawProvider } from "@/providers/PixelawProvider.tsx"
import { Route, Routes } from "react-router-dom"
import styles from "./Main.module.css"

function Main() {
    //<editor-fold desc="State">

    //</editor-fold>

    //<editor-fold desc="Hooks">

    const { coreStatus } = usePixelawProvider()

    //</editor-fold>

    //<editor-fold desc="Handlers">

    //</editor-fold>

    //<editor-fold desc="Custom behavior">

    //</editor-fold>

    //<editor-fold desc="Output">
    if (["uninitialized", "initializing", "loadConfig"].includes(coreStatus)) {
        document.title = "PixeLAW: Loading"
        return <Loading />
    }

    if (coreStatus === "error") {
        document.title = "PixeLAW: Error"
        const errorMessage = `${clientError}`
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorMessage}>
                    <h1 className={styles.errorTitle}>Something went wrong</h1>
                    {errorMessage !== "" && <p className={styles.errorDetail}>{errorMessage}</p>}
                    <p className={styles.errorSuggestion}>
                        Try to refresh this page. If issue still persists, alert the team at Discord.
                    </p>
                </div>
            </div>
        )
    }

    document.title = "PixeLAW: World"

    return (
        <div className={styles.container}>
            <MenuBar />

            <div className={styles.main}>
                <Routes>
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/world" element={<WorldSelectorPage />} />
                    <Route path="/wallet" element={<WalletSelectorPage />} />
                    <Route path="/" element={<GamePage />} />
                </Routes>
            </div>
        </div>
    )
    //</editor-fold>
}

export default Main
