import styles from "./SettingsPage.module.css";
import deploymentsConfig from '@/config/deployments.json';
import {usePixelawProvider} from "@/providers/PixelawProvider.tsx";

const WorldSelectorPage = () => {

    const { deployment, setDeployment} = usePixelawProvider();

    const handleWorldChange = (deploymentKey: string) => {
        setDeployment(deploymentKey);
        // Add additional logic here if needed, e.g., saving selection to storage
    };

    return (
        <div className={styles.inner}>
            <h1>World Selector</h1>
            <ul className={styles.list}>
                {Object.entries(deploymentsConfig.deployments).map(([deploymentKey, deploymentConfig]) => (
                    <li
                        key={deploymentKey}
                        className={`${styles.listItem} ${deployment === deploymentKey ? styles.selected : ""}`}
                        onClick={() => handleWorldChange(deploymentKey)}
                    >
                        {deploymentConfig.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WorldSelectorPage;
