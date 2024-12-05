import { create } from 'zustand';
import deploymentsConfig from '@/config/deployments.json';

// const DEPLOYMENTS_CONFIG_URL = 'https://raw.githubusercontent.com/pixelaw/config/refs/heads/main/web.config.json';

export interface BurnerConfig {
    masterAddress: string;
    masterPrivateKey: string;
    accountClassHash: string;
    feeTokenAddress: string;
}

export interface DeploymentConfig {
    serverUrl: string;
    rpcUrl: string;
    toriiUrl: string;
    relayUrl: string;
    world: string;
    burner?: BurnerConfig ;
}

export interface Deployments {
    [key: string]: DeploymentConfig; // Index signature for dynamic keys
}

export interface DeploymentsConfig {
    deployments: Deployments;
}

export interface StoreState {
    currentDeployment: string;
    deploymentsConfig: DeploymentsConfig ;
    addDeployment: (key: string, deployment: DeploymentConfig) => void;
    getDeploymentByKey: (key: string) => DeploymentConfig;
}

const useSettingStore = create<StoreState>((set) => ({
    currentDeployment: "local",
    deploymentsConfig: deploymentsConfig,
    addDeployment: (key, deployment) => {
        set((state) => {
            if (!state.deploymentsConfig) return state;
            return {
                deploymentsConfig: {
                    deployments: {
                        ...state.deploymentsConfig.deployments,
                        [key]: deployment,
                    },
                },
            };
        });
    },
    getDeploymentByKey: (key:string):DeploymentConfig => {
        const state = useSettingStore.getState();
        return state.deploymentsConfig.deployments[key];
    }
}));

export default useSettingStore;
