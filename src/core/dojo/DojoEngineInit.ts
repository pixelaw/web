import { init } from "@dojoengine/sdk";
import { DojoProvider } from "@dojoengine/core";
import type {DojoConfig} from "../types.ts";
import type { SchemaType } from "@/generated/models.gen.ts";
import GET_APPS_QUERY from "@/../graphql/GetApps.graphql"
import { getControllerConnector } from "@/dojo/controller.ts"
import baseManifest from "@/dojo/manifest.js"
import { getAbi } from "@/dojo/utils.ts"
import { formatAddress } from "@/global/utils.ts"
import type {App} from "@/webtools/types/types.ts"
import { felt252ToUnicode } from "@/webtools/utils.ts"
import type ControllerConnector from "@cartridge/connector/controller"
import {  type Manifest } from "@dojoengine/core"
import { BurnerConnector, BurnerManager } from "@dojoengine/create-burner"
import { type SDK } from "@dojoengine/sdk"
import { GraphQLClient } from "graphql-request"
import { Account, RpcProvider, shortString } from "starknet"


type GetAppsResponse = {
    pixelawAppModels: {
        edges: Array<{
            node: {
                system: string
                name: string
                icon: string
                action: string
                entity: {
                    id: string
                }
            }
        }>
    }
}

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

export async function dojoInit(worldConfig: DojoConfig, schema: SchemaType): Promise<DojoStuff | null> {
    if (!worldConfig) {
        throw new Error("WorldConfig is not loaded");
    }
    try {
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
        };

        const sdk = await init<SchemaType>(sdkSetup, schema);
        const { apps, manifest } = await fetchAppsAndManifest(worldConfig);
        const provider = new DojoProvider(manifest, worldConfig.rpcUrl);
        const controllerConnector = setupControllerConnector(manifest, worldConfig);
        const burnerConnector = await setupBurnerConnector(provider, worldConfig);

        return {
            sdk,
            controllerConnector,
            apps,
            manifest,
            burnerConnector,
            provider,
        };
    } catch (error) {
        console.error("Initialization error:", error);
        return null;
    }
}

async function fetchAppsAndManifest(worldConfig: DojoConfig): Promise<{ apps: App[]; manifest: Manifest }> {
    const gqlClient = new GraphQLClient(`${worldConfig.toriiUrl}/graphql`)
    try {
        const data = await gqlClient.request<GetAppsResponse>(GET_APPS_QUERY)

        const apps = data.pixelawAppModels.edges.map(({ node }) => ({
            name: shortString.decodeShortString(node.name),
            icon: felt252ToUnicode(node.icon),
            action: shortString.decodeShortString(node.action),
            system: node.system,
            entity: {
                id: node.entity.id,
            },
        }))

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
    const cacheKey = JSON.stringify({ manifest, rpcUrl: worldConfig.wallets.controller?.rpcUrl })
    if (controllerConnectorCache.has(cacheKey)) {
        return controllerConnectorCache.get(cacheKey) || null
    }

    const connector = worldConfig.wallets.controller
        ? getControllerConnector({
            feeTokenAddress: worldConfig.feeTokenAddress,
            manifest,
            rpcUrl: worldConfig.wallets.controller.rpcUrl,
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
                    burnerConfig.masterAddress,
                    burnerConfig.masterPrivateKey,
                ),
            })

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
