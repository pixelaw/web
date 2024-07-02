import { useQuery } from '@tanstack/react-query'
// @ts-ignore
import { GraphQLClient } from 'graphql-request';
import {useSettingsStore} from "@/stores/SettingsStore.ts";
import {numRGBAToHex} from "@/webtools/utils.ts";
import GetPaletteColors from "@/../graphql/GetPaletteColors.graphql";

type Data = {
    paletteColorsModels: {
        edges: {
            node: {
                game_id: number,
                idx: number,
                color: number
            }
        }[]
    }
}

const usePaletteColors = () => {
    const settings = useSettingsStore()
    const baseUrl = settings?.config?.toriiUrl ?? ''
    const gqlClient = baseUrl ? new GraphQLClient(`${baseUrl}/graphql`) : null;

    return useQuery(
        {
            queryKey: ['paletteColors'],
            queryFn: async () => {

                const result: Data = await gqlClient.request(GetPaletteColors)
                return result.paletteColorsModels.edges.map(({ node }) =>  {
                    return  {
                        ...node,
                        color: numRGBAToHex(node.color)
                    }
                })
            },
            refetchInterval: 1_000
        }
    )
}

export default usePaletteColors
