import App from "@/components/Viewport/App/App.tsx"
import { usePixelawProvider } from "@/providers/PixelawProvider.tsx"
import { useViewStateStore } from "@/stores/ViewStateStore.ts"

import styles from "./Apps.module.css"

const Apps: React.FC = () => {
    const { pixelawCore } = usePixelawProvider()
    const { appStore } = pixelawCore

    const { selectedApp, setSelectedApp, hoveredCell } = useViewStateStore()

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
