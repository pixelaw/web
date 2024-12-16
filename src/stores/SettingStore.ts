import worldsConfig from "@/config/worlds.json"
import { DEFAULT_WORLD } from "@/global/constants.ts"
import { create } from "zustand"

// const DEPLOYMENTS_CONFIG_URL = 'https://raw.githubusercontent.com/pixelaw/config/refs/heads/main/web.config.json';

export interface BurnerConfig {
    masterAddress: string
    masterPrivateKey: string
    accountClassHash: string
}

// Controller Configuration
export interface ControllerConfig {
    rpcUrl: string
    profileUrl: string
    url: string
}

// Wallets Configuration
export interface WalletsConfig {
    burner?: BurnerConfig
    controller?: ControllerConfig
}

export interface WorldConfig {
    serverUrl: string
    rpcUrl: string
    toriiUrl: string
    relayUrl: string
    world: string
    feeTokenAddress: string
    wallets: WalletsConfig
}

export interface WorldsConfig {
    [key: string]: WorldConfig // Index signature for dynamic keys
}

export interface StoreState {
    currentWallet: string
    currentWorld: string
    worldsConfig: WorldsConfig
    addWorld: (key: string, deployment: WorldConfig) => void
    getWorldByKey: (key: string) => WorldConfig
    setCurrentWallet: (wallet: string) => void
}

const loadState = (): Partial<StoreState> => {
    try {
        const serializedState = localStorage.getItem("storeState")
        if (serializedState === null) return {}
        return JSON.parse(serializedState)
    } catch (err) {
        console.error("Could not load state", err)
        return {}
    }
}

const saveState = (state: StoreState) => {
    try {
        const serializedState = JSON.stringify(state)
        localStorage.setItem("storeState", serializedState)
    } catch (err) {
        console.error("Could not save state", err)
    }
}

const useSettingStore = create<StoreState>((set) => ({
    ...{
        currentWallet: "",
        currentWorld: DEFAULT_WORLD,
        worldsConfig: worldsConfig,
    },
    ...loadState(),
    addWorld: (key, deployment) => {
        set((state) => {
            const newState = {
                ...state,
                worldsConfig: {
                    ...state.worldsConfig,
                    [key]: deployment,
                },
            }
            saveState(newState)
            return newState
        })
    },
    getWorldByKey: (key: string): WorldConfig => {
        const state = useSettingStore.getState()
        return state.worldsConfig[key]
    },
    setCurrentWallet: (wallet: string) => {
        set((state) => {
            const newState = {
                ...state,
                currentWallet: wallet,
            }
            saveState(newState)
            return newState
        })
    },
}))

// Subscribe to store changes and save to localStorage
useSettingStore.subscribe((state) => {
    saveState(state)
})

export default useSettingStore
