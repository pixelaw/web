import worldsConfig from "@/config/worlds.json"
import useSettingStore from "@/stores/SettingStore.ts"
import { useNavigate } from "react-router-dom"
import styles from "./WorldSelectorPage.module.css"

const WorldSelectorPage = () => {
    const { setWorld, world } = useSettingStore()
    const navigate = useNavigate()

    const handleWorldChange = (worldKey: string) => {
        setWorld(worldKey)
        navigate("/")
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
