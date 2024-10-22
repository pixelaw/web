import GET_APPS_QUERY from "@/../graphql/GetApps.graphql"
import type { App, AppStore } from "@/webtools/types.ts"
import { felt252ToUnicode } from "@/webtools/utils.ts"
import type { DocumentNode } from "graphql"
import { GraphQLClient } from "graphql-request"
import { useEffect, useState } from "react"
import { shortString } from "starknet"

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

export async function fetchApps(baseUrl: string): Promise<App[]> {
    const gqlClient = new GraphQLClient(`${baseUrl}/graphql`)
    try {
        const data = await gqlClient.request<GetAppsResponse>(GET_APPS_QUERY)
        return data.pixelawAppModels.edges.map(({ node }) => ({
            name: shortString.decodeShortString(node.name),
            icon: felt252ToUnicode(node.icon),
            action: shortString.decodeShortString(node.action),
            system: node.system,
            entity: {
                id: node.entity.id,
            },
        }))
    } catch (error) {
        console.error("Error fetching apps:", error)
        return []
    }
}

export function useDojoAppStore(baseUrl?: string): AppStore {
    const [preparedApps, setPreparedApps] = useState<App[]>([])

    useEffect(() => {
        if (!baseUrl) return
        fetchApps(baseUrl).then(setPreparedApps)
    }, [baseUrl])

    const getByName = (name: string): App | undefined => {
        return preparedApps.find((app) => app.name === name)
    }

    const getAll = (): App[] => {
        return preparedApps
    }

    return { getByName, getAll, prepare: () => {} }
}
