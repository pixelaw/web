import { useQuery } from '@tanstack/react-query'
// @ts-ignore
import { GraphQLClient } from 'graphql-request';
import {useSettingsStore} from "@/stores/SettingsStore.ts";
import GetProposals from "@/../graphql/GetProposals.graphql";

export type ProposalDataType = {
    game_id: number,
    index: number,
    author: string,
    proposal_type: number,
    target_color: number,
    start: number,
    end: number,
    yes_px: number,
    no_px: number,
    is_activated: boolean
}

type Data = {
    proposalModels: {
        edges: {
            node: ProposalDataType
        }[]
    }
}

const useProposals = (gameId: number) => {
    const settings = useSettingsStore()
    const baseUrl = settings?.config?.toriiUrl ?? ''
    const gqlClient = baseUrl ? new GraphQLClient(`${baseUrl}/graphql`) : null;

    return useQuery(
        {
            queryKey: ['proposals', gameId],
            queryFn: async () => {

                const result: Data = await gqlClient.request(GetProposals, { game_id: gameId })
                return result.proposalModels.edges.map(edge => edge.node)
            },
            enabled: !!gameId,
            refetchInterval: 2_000
        }
    )
}

export default useProposals
