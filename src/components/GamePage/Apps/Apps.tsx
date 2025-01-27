import App from "@/components/GamePage/App/App.tsx"
import type { AppStore, Coordinate } from "@/webtools/types/types.ts"
import styles from "./Apps.module.css"

export type AppsProps = {
    appStore: AppStore
    setSelectedApp: (app: string) => void
    selectedApp: string
    hoveredCell: Coordinate | undefined
}

const Apps: React.FC<AppsProps> = ({ appStore, setSelectedApp, selectedApp, hoveredCell }) => {
    if (!appStore) return null
    const allApps = appStore.getAll()

    return (
        <div className={styles.inner}>
            {allApps.map((app) => (
                // biome-ignore lint/a11y/useKeyWithClickEvents: TODO keyboard support later
                <div
                    key={app.name}
                    onClick={() => setSelectedApp(app.name)}
                    className={selectedApp === app.name ? styles.selected : ""}
                >
                    <App icon={app.icon} name={app.name} />
                </div>
            ))}
            {hoveredCell && (
                <div id={"hoveredCell"}>
                    x: {hoveredCell[0]}
                    y: {hoveredCell[1]}
                </div>
            )}
        </div>
    )
}

export default Apps
