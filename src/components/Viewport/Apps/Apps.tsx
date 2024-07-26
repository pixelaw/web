import App from "@/components/Viewport/App/App.tsx"
import { useViewStateStore } from "@/stores/ViewStateStore.ts"
import type { AppStore } from "@/webtools/types.ts"
import styles from "./Apps.module.css"

type AppsProps = {
    appStore: AppStore
}

const Apps: React.FC<AppsProps> = ({ appStore }) => {
    const { selectedApp, setSelectedApp, hoveredCell } = useViewStateStore()

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
                    <App
                        icon={app.icon}
                        name={app.name}
                    />
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
