import { useQuery } from '@tanstack/react-query'
// @ts-ignore
import { GraphQLClient } from 'graphql-request';
import {useSettingsStore} from "@/stores/SettingsStore.ts";
import GetAllowedColors from "@/../graphql/GetAllowedColors.graphql"

export type AllowedColorDataType = {
    game_id: number,
    color: number,
    is_allowed: boolean
}

type Data = {
    allowedColorModels: {
        edges: {
            node: AllowedColorDataType
        }[]
    }
}

const useAllowedColors = (gameId: number) => {
    const settings = useSettingsStore()
    const baseUrl = settings?.config?.toriiUrl ?? ''
    const gqlClient = baseUrl ? new GraphQLClient(`${baseUrl}/graphql`) : null;

    return useQuery(
        {
            queryKey: ['allowedColors', gameId],
            queryFn: async () => {
                const result: Data = await gqlClient.request(GetAllowedColors, { game_id: gameId })
                return result.allowedColorModels.edges.map(edge => edge.node)
            },
            enabled: !!gameId,
            refetchInterval: 2_000
        }
    )
}

export default useAllowedColors
