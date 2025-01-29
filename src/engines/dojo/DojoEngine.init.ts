import type { SchemaType } from "@/engines/dojo/generated/models.gen.ts"
import { getControllerConnector } from "@/engines/dojo/utils/controller.ts"
import type { App } from "@/types.ts"
import type { DojoConfig } from "@/types.ts"
import type ControllerConnector from "@cartridge/connector/controller"
import { DojoProvider } from "@dojoengine/core"
import type { Manifest } from "@dojoengine/core"
import { BurnerConnector, BurnerManager, type BurnerManagerOptions } from "@dojoengine/create-burner"
import { init } from "@dojoengine/sdk"
import type { SDK } from "@dojoengine/sdk"
import { Account, RpcProvider, shortString } from "starknet"
import baseManifest from "./utils/manifest.js"
import { felt252ToString, felt252ToUnicode, formatAddress, getAbi } from "./utils/utils.ts"

export type DojoStuff = {
    apps: App[]
    manifest: Manifest | null
    controllerConnector: ControllerConnector | null
    burnerConnector: BurnerConnector | null
    sdk: SDK<SchemaType> | null
    provider: DojoProvider
}
const controllerConnectorCache = new Map<string, ControllerConnector | null>()
const burnerConnectorCache = new Map<string, Promise<BurnerConnector | null>>()

export async function dojoInit(worldConfig: DojoConfig, schema: SchemaType): Promise<DojoStuff> {
    if (!worldConfig) {
        throw new Error("WorldConfig is not loaded")
    }

    const sdkSetup = {
        client: {
            rpcUrl: worldConfig.rpcUrl,
            toriiUrl: worldConfig.toriiUrl,
            relayUrl: "",
            worldAddress: worldConfig.world,
        },
        domain: {
            name: "pixelaw",
            version: "1.0",
            chainId: "KATANA",
            revision: "1",
        },
    }

    const sdk = await init<SchemaType>(sdkSetup, schema)
    const { apps, manifest } = await fetchAppsAndManifest(worldConfig)
    const provider = new DojoProvider(manifest, worldConfig.rpcUrl)
    const controllerConnector = setupControllerConnector(manifest, worldConfig)
    const burnerConnector = await setupBurnerConnector(provider, worldConfig)

    return {
        sdk,
        controllerConnector,
        apps,
        manifest,
        burnerConnector,
        provider,
    }
}

async function fetchAppsAndManifest(worldConfig: DojoConfig): Promise<{ apps: App[]; manifest: Manifest }> {
    try {
        const query = "SELECT internal_entity_id, name, system, action, icon FROM 'pixelaw-App';"

        const response = await fetch(`http://localhost:8080/sql?query=${query}`)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const json = await response.json()
        const apps = json.map((item) => {
            return {
                name: felt252ToString(item.name),
                icon: felt252ToUnicode(item.icon),
                action: felt252ToString(item.action),
                system: item.system,
                entity: {
                    id: item.internal_entity_id,
                },
            }
        })

        const contracts = await Promise.all(
            apps.map((app) => getAbi(new RpcProvider({ nodeUrl: worldConfig.rpcUrl }), app)),
        )

        const manifest = {
            ...baseManifest(worldConfig.world),
            contracts,
        } as unknown as Manifest

        return { apps, manifest }
    } catch (error) {
        console.error("Error fetching apps and manifest:", error)
        return { apps: [], manifest: {} as Manifest }
    }
}

function setupControllerConnector(manifest: Manifest, worldConfig: DojoConfig): ControllerConnector | null {
    // return null // TODO disabling controller since it broke with latest dojo update
    if (!worldConfig.wallets.controller) {
        return null
    }
    const cacheKey = JSON.stringify({ manifest, rpcUrl: worldConfig.wallets.controller?.rpcUrl })
    if (controllerConnectorCache.has(cacheKey)) {
        return controllerConnectorCache.get(cacheKey) || null
    }

    const connector = worldConfig.wallets.controller
        ? getControllerConnector({
              feeTokenAddress: worldConfig.feeTokenAddress,
              manifest,
              rpcUrl: worldConfig.wallets.controller.rpcUrl!,
          })
        : null

    controllerConnectorCache.set(cacheKey, connector)
    return connector
}

async function setupBurnerConnector(
    rpcProvider: DojoProvider,
    worldConfig: DojoConfig,
): Promise<BurnerConnector | null> {
    const cacheKey = JSON.stringify({ rpcProvider, burnerConfig: worldConfig.wallets?.burner })
    if (burnerConnectorCache.has(cacheKey)) {
        return burnerConnectorCache.get(cacheKey) || null
    }

    const promise = (async () => {
        if (worldConfig.wallets?.burner) {
            const burnerConfig = worldConfig.wallets.burner

            const manager = new BurnerManager({
                ...burnerConfig,
                feeTokenAddress: worldConfig.feeTokenAddress,
                rpcProvider: rpcProvider.provider,
                masterAccount: new Account(
                    rpcProvider.provider,
                    burnerConfig.masterAddress!,
                    burnerConfig.masterPrivateKey!,
                ),
            } as unknown as BurnerManagerOptions)

            await manager.init()
            if (manager.list().length === 0) {
                try {
                    await manager.create()
                } catch (e) {
                    console.error(e)
                }
            }

            return new BurnerConnector(
                {
                    id: "burner",
                    name: `burner_${formatAddress(manager.account!.address)}`,
                },
                manager.account!,
            )
        }
        return null
    })()

    burnerConnectorCache.set(cacheKey, promise)
    return promise
}
