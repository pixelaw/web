import worldsConfig from "@/config/worlds.json"
import useSettingStore from "@/stores/SettingStore.ts"
import styles from "./WorldSelectorPage.module.css"

const WorldSelectorPage = () => {
    const { setWorld, worldConfig, world } = useSettingStore()

    const handleWorldChange = (worldKey: string) => {
        setWorld(worldKey)
    }

    return (
        <div className={styles.inner}>
            <h1>World Selector: {world}</h1>
            <ul className={styles.list}>
                {Object.entries(worldsConfig).map(([worldKey, worldConfig]) => {
                    return (
                        <li
                            key={worldKey}
                            className={`${styles.listItem} ${world === worldKey ? styles.selected : ""}`}
                        >
                            <button
                                type="button"
                                className={`${styles.menuButton} ${world === worldKey ? styles.selectedButton : styles.unselectedButton}`}
                                onClick={() => handleWorldChange(worldKey)}
                            >
                                {worldConfig.description}
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default WorldSelectorPage
