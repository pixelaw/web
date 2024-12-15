import { create } from 'zustand';
import worldsConfig from '@/config/worlds.json';
import {DEFAULT_WORLD} from "@/global/constants.ts";

// const DEPLOYMENTS_CONFIG_URL = 'https://raw.githubusercontent.com/pixelaw/config/refs/heads/main/web.config.json';

export interface BurnerConfig {
    masterAddress: string;
    masterPrivateKey: string;
    accountClassHash: string;
    feeTokenAddress: string;
}

export interface WorldConfig {
    serverUrl: string;
    rpcUrl: string;
    toriiUrl: string;
    relayUrl: string;
    world: string;
    burner?: BurnerConfig ;
}

export interface WorldsConfig {
    [key: string]: WorldConfig; // Index signature for dynamic keys
}


export interface StoreState {
    currentDeployment: string;
    worldsConfig: WorldsConfig ;
    addWorld: (key: string, deployment: WorldConfig) => void;
    getWorldByKey: (key: string) => WorldConfig;
}

const useSettingStore = create<StoreState>((set) => ({
    currentDeployment: DEFAULT_WORLD,
    worldsConfig: worldsConfig,
    addWorld: (key, deployment) => {
        set((state) => {
            if (!state.worldsConfig) return state;
            return {
                    worldsConfig: {
                        ...state.worldsConfig,
                        [key]: deployment,
                    },

            };
        });
    },
    getWorldByKey: (key:string):WorldConfig => {
        const state = useSettingStore.getState();
        return state.worldsConfig[key];
    }
}));

export default useSettingStore;
