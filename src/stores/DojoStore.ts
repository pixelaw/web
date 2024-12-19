import GET_APPS_QUERY from "@/../graphql/GetApps.graphql"
import { getControllerConnector } from "@/dojo/controller.ts"
import baseManifest from "@/dojo/manifest.js"
import { getAbi, sleep } from "@/dojo/utils.ts"
import { type SchemaType, schema } from "@/generated/models.gen.ts"
import { formatAddress } from "@/global/utils.ts"
import type { WorldConfig } from "@/stores/SettingStore.ts"
import type { App } from "@/webtools/types.ts"
import { felt252ToUnicode } from "@/webtools/utils.ts"
import type ControllerConnector from "@cartridge/connector/controller"
import { DojoProvider, type Manifest } from "@dojoengine/core"
import { BurnerConnector, BurnerManager } from "@dojoengine/create-burner"
import { type SDK, init } from "@dojoengine/sdk"
import { GraphQLClient } from "graphql-request"
import { useEffect, useState } from "react"
import { Account, RpcProvider, shortString } from "starknet"

export type Status = "loading" | "ready" | "error"

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

async function fetchAppsAndManifest(worldConfig: WorldConfig): Promise<{ apps: App[]; manifest: Manifest }> {
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

function setupControllerConnector(manifest: Manifest, worldConfig: WorldConfig): ControllerConnector | null {
    if (worldConfig.wallets.controller) {
        return getControllerConnector({
            feeTokenAddress: worldConfig.feeTokenAddress,
            manifest,
            profileUrl: worldConfig.wallets.controller.profileUrl,
            rpcUrl: worldConfig.wallets.controller.rpcUrl,
            url: worldConfig.wallets.controller.url,
        })
    }
    return null
}

async function setupBurnerConnector(
    rpcProvider: DojoProvider,
    worldConfig: WorldConfig,
): Promise<BurnerConnector | null> {
    if (worldConfig.wallets?.burner) {
        const burnerConfig = worldConfig.wallets.burner
        const manager = new BurnerManager({
            ...burnerConfig,
            feeTokenAddress: worldConfig.feeTokenAddress,
            rpcProvider: rpcProvider.provider,
            masterAccount: new Account(rpcProvider.provider, burnerConfig.masterAddress, burnerConfig.masterPrivateKey),
        })
        console.log(burnerConfig)
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
}

export function useDojo(worldConfig?: WorldConfig): { dojoStuff: DojoStuff | null; status: Status } {
    const [status, setStatus] = useState<Status>("loading")
    const [dojoStuff, setDojoStuff] = useState<DojoStuff | null>(null)

    useEffect(() => {
        console.log("useEffect triggered!!!", worldConfig)
        if (!worldConfig) return

        const initialize = async () => {
            try {
                setStatus("loading")

                const sdk = await init<SchemaType>(
                    {
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
                    },
                    schema,
                )

                const { apps, manifest } = await fetchAppsAndManifest(worldConfig)
                const provider = new DojoProvider(manifest, worldConfig.rpcUrl)
                const controllerConnector = setupControllerConnector(manifest, worldConfig)
                await sleep(5000)
                const burnerConnector = await setupBurnerConnector(provider, worldConfig)

                setDojoStuff({
                    sdk,
                    controllerConnector,
                    apps,
                    manifest,
                    burnerConnector,
                    provider,
                })
                setStatus("ready")
            } catch (error) {
                console.error("Initialization error:", error)
                setStatus("error")
            }
        }
        initialize()
    }, [worldConfig])

    return { dojoStuff, status }
}
