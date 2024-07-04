import { useQuery } from '@tanstack/react-query';
import { GraphQLClient } from 'graphql-request';
import GetPlayer from '@/../graphql/GetPlayer.graphql';
import { useSettingsStore } from '@/stores/SettingsStore.ts';

type Data = {
    playerModels: {
        edges: {
            node: {
                address: string;
                max_px: number;
                num_owns: number;
                num_commit: number;
                current_px: number;
                last_date: string;
                is_banned: boolean;
            };
        }[];
    };
};

const usePlayer = (playerAddress: string) => {
    const settings = useSettingsStore();
    const baseUrl = settings?.config?.toriiUrl ?? '';
    const gqlClient = new GraphQLClient(`${baseUrl}/graphql`);

    return useQuery({
        queryKey: ['playerAddress', playerAddress],
        queryFn: async () => {
            const result: Data = await gqlClient.request(GetPlayer, {
                player_address: playerAddress,
            });
            const player = result.playerModels.edges?.[0];
            if (!player)
                return {
                    address: playerAddress,
                    max_px: 10,
                    num_owns: 0,
                    num_commit: 0,
                    current_px: 10,
                    last_date: 0,
                    is_banned: false,
                };
            return {
                ...player.node,
                last_date: parseInt(player.node.last_date, 16),
            };
        },
        refetchInterval: 2_000,
        enabled: !!playerAddress,
    });
};

export default usePlayer;
