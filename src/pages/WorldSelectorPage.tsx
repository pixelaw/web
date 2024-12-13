import styles from "./SettingsPage.module.css";
import deploymentsConfig from '@/config/deployments.json';
import {usePixelawProvider} from "@/providers/PixelawProvider.tsx";

const WorldSelectorPage = () => {

    const { deployment, setDeployment} = usePixelawProvider();

    const handleWorldChange = (deploymentKey: string) => {
        setDeployment(deploymentKey);
    };
    console.log(deployment)
    return (
        <div className={styles.inner}>
            <h1>World Selector</h1>
            <ul className={styles.list}>
                {Object.entries(deploymentsConfig.deployments).map(([deploymentKey, deploymentConfig]) => (
                    <li
                        key={deploymentKey}
                        className={`${styles.listItem} ${deployment === deploymentKey ? styles.selected : ""}`}
                    >
                        <button
                            type={"button"}
                            className={`${styles.menuButton} ${deployment === deploymentKey ? styles.selectedButton : styles.unselectedButton}`}
                            onClick={() => handleWorldChange(deploymentKey)}
                        >
                            {deploymentConfig.description}
                        </button>
                    </li>
                    ))}
            </ul>
        </div>
);
};

export default WorldSelectorPage;
