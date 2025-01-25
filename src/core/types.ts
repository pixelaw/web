import type { PixelStore } from "@/webtools/types/PixelStore.types.ts"
import type { AppStore, Bounds, Coordinate, TileStore } from "@/webtools/types/types.ts"

export type PixelCoreEvents = {
    cellClicked: Coordinate
    centerChanged: Coordinate
    worldViewChanged: Bounds
    zoomChanged: number
    statusChange: CoreStatus
    pixelStoreUpdated: number
    tileStoreUpdated: number
    appStoreUpdated: number
    userScrolled: { bounds: Bounds }
    userZoomed: { bounds: Bounds }
    cacheUpdated: number
}

export type InteractHandler = {
    hoi: string
}

export type EngineStatus = "ready" | "loading" | "error" | "uninitialized"
export type CoreStatus = "uninitialized" | "loadConfig" | "initializing" | "ready" | "error"
export interface Engine {
    interacthandler: InteractHandler
    pixelStore: PixelStore
    tileStore: TileStore
    appStore: AppStore
    status: EngineStatus

    init(engineConfig: EngineConfig): Promise<void>
}

export type EngineConstructor<T extends Engine> = new () => T

export interface WalletConfig {
    masterAddress?: string
    masterPrivateKey?: string
    accountClassHash?: string
    rpcUrl?: string
    profileUrl?: string
    url?: string
}

export interface DojoConfig {
    serverUrl: string
    rpcUrl: string
    toriiUrl: string
    relayUrl: string
    feeTokenAddress: string
    wallets: {
        burner?: WalletConfig
        controller?: WalletConfig
    }
    world: string
}

// biome-ignore lint/complexity/noBannedTypes: TODO impl
export type MudConfig = {}

export type EngineConfig = DojoConfig | MudConfig

export interface DojoWorldConfig {
    engine: "dojo"
    description: string
    config: DojoConfig
}

export interface MudWorldConfig {
    engine: "mud"
    description: string
    config: MudConfig
}

export type WorldConfig = DojoWorldConfig | MudWorldConfig
