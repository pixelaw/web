import worldsConfig from "@/config/worlds.json"
import { DEFAULT_WORLD } from "@/global/constants.ts"
import { create } from "zustand"
import {EngineConfig, WorldConfig} from "@/core/types.ts";

// Ensure the worldsConfig is correctly typed
const typedWorldsConfig: Record<string, WorldConfig> = worldsConfig as Record<string, WorldConfig>

// Define the StoreState interface
export interface StoreState {
    wallet: string
    world: string
    worldsConfig: Record<string, WorldConfig>
    worldConfig: WorldConfig
    addWorld: (id: string, worldConfig: WorldConfig) => void
    setWallet: (id: string) => void
    setWorld: (id: string) => void
}

// Load state from localStorage
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

// Save state to localStorage
const saveState = (state: StoreState) => {
    try {
        const serializedState = JSON.stringify(state)
        localStorage.setItem("storeState", serializedState)
    } catch (err) {
        console.error("Could not save state", err)
    }
}

// Create the Zustand store
const useSettingStore = create<StoreState>((set) => ({
    ...{
        wallet: "",
        world: DEFAULT_WORLD,
        worldConfig: typedWorldsConfig[DEFAULT_WORLD],
        worldsConfig: typedWorldsConfig,
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
