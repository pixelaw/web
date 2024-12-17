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
    [id: string]: WorldConfig
}

export interface StoreState {
    wallet: string
    world: string
    worldsConfig: WorldsConfig
    worldConfig: WorldConfig | undefined
    addWorld: (id: string, worldConfig: WorldConfig) => void
    setWallet: (id: string) => void
    setWorld: (id: string) => void
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
        wallet: "",
        world: DEFAULT_WORLD,
        worldConfig: worldsConfig[DEFAULT_WORLD],
        worldsConfig: worldsConfig,
    },
    ...loadState(),
    addWorld: (id, worldConfig) => {
        set((state) => {
            const newState = {
                ...state,
                worldsConfig: {
                    ...state.worldsConfig,
                    [id]: worldConfig,
                },
            }
            saveState(newState)
            return newState
        })
    },
    setWorld: (id: string) => {
        set((state) => {
            const worldConfig = state.worldsConfig[id]
            if (!worldConfig) {
                console.error(`World with key ${id} does not exist.`)
                return state
            }
            const newState = {
                ...state,
                world: id,
                worldConfig: worldConfig,
            }
            saveState(newState)
            return newState
        })
    },
    setWallet: (id: string) => {
        set((state) => {
            const newState = {
                ...state,
                wallet: id,
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
