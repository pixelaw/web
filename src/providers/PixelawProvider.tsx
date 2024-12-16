import { getControllerConnector } from "@/dojo/controller.ts"
import baseManifest from "@/dojo/manifest.js"
import { getAbi } from "@/dojo/utils.js"
import { type SchemaType, schema } from "@/generated/models.gen.ts"
import { DEFAULT_WORLD } from "@/global/constants.ts"
import type { Manifest } from "@/global/types.js"
import { fetchApps } from "@/stores/DojoAppStore.js"
import useSettingStore, { type WorldConfig } from "@/stores/SettingStore.ts"
import type ControllerConnector from "@cartridge/connector/controller"
import { DojoProvider } from "@dojoengine/core"
import { BurnerManager } from "@dojoengine/create-burner"
import { type SDK, init } from "@dojoengine/sdk"
import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react"
import { Account, RpcProvider } from "starknet"

export type DojoStuff = {
    sdk: SDK<SchemaType>
    dojoProvider: DojoProvider
    manifest: Manifest
    burnerManager: BurnerManager | null
    userAccount: Account | undefined
    controllerConnector: ControllerConnector | undefined
}

export type IPixelawContext = {
    world: string
    walletType: "argent" | "braavos" | "burner" | "controller" | undefined
    clientState: "worldSelect" | "loading" | "error" | "gameActive"
    clientError: Error | string | null
    dojoStuff: DojoStuff | undefined
    worldStuff: WorldConfig
    setWorld: (world: string) => void
}

export const PixelawContext = createContext<IPixelawContext | undefined>(undefined)

// @dev createDojoConfig can only be called once, or we get a full hangup
let activeLoad = false

export const PixelawProvider = ({ children }: { children: ReactNode }) => {
    const { worldsConfig, getWorldByKey, currentWallet } = useSettingStore()

    const [contextValues, setContextValues] = useState<IPixelawContext>({
        world: DEFAULT_WORLD,
        walletType: "burner",
        clientState: "loading",
        clientError: null,
        dojoStuff: undefined,
        worldStuff: getWorldByKey(DEFAULT_WORLD),
        setWorld: () => {},
    })

    const setupDojo = useCallback(async () => {
        if (activeLoad) return
        activeLoad = true

        try {
            let burnerManager: BurnerManager
            let userAccount: Account
            let controllerConnector: ControllerConnector
            const worldConfig = getWorldByKey(contextValues.world)

            const apps = await fetchApps(worldConfig.toriiUrl)

            const contracts = await Promise.all(
                apps.map((address) => getAbi(new RpcProvider({ nodeUrl: worldConfig.rpcUrl }), address)),
            )

            // Manifest with updated contract ABIs
            const manifest = {
                ...baseManifest(worldConfig.world),
                contracts,
            } as unknown as Manifest

            const dojoProvider = new DojoProvider(manifest, worldConfig.rpcUrl)

            // If a wallet is already connected:
            if (currentWallet.length > 0) {
            }

            if (worldConfig.wallets.controller) {
                controllerConnector = getControllerConnector({
                    feeTokenAddress: worldConfig.feeTokenAddress,
                    manifest,
                    profileUrl: worldConfig.wallets.controller.profileUrl,
                    rpcUrl: worldConfig.wallets.controller.rpcUrl,
                    url: worldConfig.wallets.controller.url,
                })
            }

            if (worldConfig.wallets?.burner) {
                console.log("init burnerMgr")
                const burnerConfig = worldConfig.wallets.burner

                // Create burner manager
                burnerManager = new BurnerManager({
                    ...burnerConfig,
                    feeTokenAddress: worldConfig.feeTokenAddress,
                    rpcProvider: dojoProvider.provider,
                    masterAccount: new Account(
                        dojoProvider.provider,
                        burnerConfig.masterAddress,
                        burnerConfig.masterPrivateKey,
                    ),
                })

                await burnerManager.init()
                // Immediately create a burner wallet, even if it was not connected yet
                if (burnerManager.list().length === 0) {
                    try {
                        await burnerManager.create()
                        console.log("burner done")
                    } catch (e) {
                        console.error(e)
                    }
                }
            }

            console.log(worldConfig)
            const sdk = await init<SchemaType>(
                {
                    client: {
                        rpcUrl: worldConfig.rpcUrl,
                        toriiUrl: worldConfig.toriiUrl,
                        relayUrl: "", //deployment.relayUrl,
                        worldAddress: worldConfig.world,
                    },
                    domain: {
                        name: "pixelaw",
                        version: "1.0",
                        chainId: "KATANA",
                        revision: "1",
                    },
                },
                schema,
            )

            setContextValues((prev) => ({
                ...prev,
                clientState: "gameActive",
                clientError: null,
                dojoStuff: {
                    sdk,
                    dojoProvider,
                    manifest,
                    burnerManager,
                    userAccount,
                    controllerConnector,
                },
            }))
        } catch (e) {
            setContextValues((prev) => ({
                ...prev,
                clientState: "error",
                clientError: e as Error,
            }))
        } finally {
            activeLoad = false
        }
    }, [contextValues.world, getWorldByKey])

    useEffect(() => {
        if (worldsConfig && contextValues.world) {
            setupDojo()
        }
    }, [worldsConfig, contextValues.world, setupDojo])

    return <PixelawContext.Provider value={contextValues}>{children}</PixelawContext.Provider>
}

export const usePixelawProvider = (): IPixelawContext => {
    const context = useContext(PixelawContext)
    if (!context) throw new Error("PixelLawProvider can only be used within a PixelLawProvider")
    return context
}
