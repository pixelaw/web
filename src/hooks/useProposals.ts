import { shortenHex } from '@dojoengine/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GraphQLClient } from 'graphql-request';
import { createClient } from 'graphql-ws';
import { useEffect } from 'react';
import GetProposals from '@/../graphql/GetProposals.graphql';
import { toastSuccess } from '@/components/Toast';
import { usePixelawProvider } from '@/providers/PixelawProvider.tsx';
import { useSettingsStore } from '@/stores/SettingsStore.ts';

export type ProposalDataType = {
    game_id: number;
    index: number;
    author: string;
    proposal_type: number;
    target_color: number;
    start: number;
    end: number;
    yes_px: number;
    no_px: number;
    is_activated: boolean;
};

type Data = {
    proposalModels: {
        edges: {
            node: ProposalDataType;
        }[];
    };
};

const useProposals = (gameId: number) => {
    const settings = useSettingsStore();
    const baseUrl = settings?.config?.toriiUrl ?? '';
    const gqlClient = new GraphQLClient(`${baseUrl}/graphql`);

    return useQuery({
        queryKey: ['proposals', gameId],
        queryFn: async () => {
            const result: Data = await gqlClient.request(GetProposals, { game_id: gameId });
            return result.proposalModels.edges.map((edge) => edge.node);
        },
        enabled: !!gameId,
    });
};

export default useProposals;

const SUBSCRIPTION = `
subscription {
  entityUpdated {
    id
    keys
    models {
      ... on Proposal {
        game_id
        index
        author
        proposal_type
        target_color
        start
        end
        yes_px
        no_px
        is_activated
      }
    }
  }
}
`;

type SubscriptionMessageType = {
    data: {
        entityUpdated: {
            id: string;
            keys: string[];
            models: (ProposalDataType | Record<string, never>)[];
        };
    };
};

export const useProposalSubscription = () => {
    const settings = useSettingsStore();
    const baseUrl = settings?.config?.toriiUrl ?? '';
    const client = createClient({
        url: baseUrl.replace('http', 'ws') + '/graphql',
    });

    const queryClient = useQueryClient();

    const { gameData } = usePixelawProvider();

    useEffect(() => {
        const unsubscribe = client.subscribe(
            { query: SUBSCRIPTION },
            {
                next: ({ data }: SubscriptionMessageType) => {
                    const proposalEntities = data.entityUpdated.models.filter(
                        (model) => !!Object.keys(model).length,
                    ) as unknown as ProposalDataType[];
                    if (!proposalEntities.length) return;
                    queryClient.invalidateQueries({ queryKey: ['proposals'] }).then();

                    const newProposals = proposalEntities.filter((proposalEntity) => {
                        return (
                            proposalEntity.yes_px === 0 &&
                            proposalEntity.no_px === 0 &&
                            !proposalEntity.is_activated
                        );
                    });

                    newProposals.forEach((newProposal) => {
                        const isPlayer =
                            gameData?.account?.account?.address?.toLowerCase() ===
                            newProposal.author.toLowerCase();
                        const playerAddress = isPlayer ? 'You' : shortenHex(newProposal.author, 10);

                        toastSuccess({
                            message: `${playerAddress} just created a new proposal`,
                        });
                    });
                },
                error: (err) => console.error(err),
                complete: () => console.log('Subscription completed'),
            },
        );

        return () => unsubscribe();
    }, [gameData, queryClient, client]);
};
