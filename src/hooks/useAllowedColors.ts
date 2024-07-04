import { useQuery } from '@tanstack/react-query';
import { GraphQLClient } from 'graphql-request';
import GetAllowedColors from '@/../graphql/GetAllowedColors.graphql';
import { useSettingsStore } from '@/stores/SettingsStore.ts';

export type AllowedColorDataType = {
    game_id: number;
    color: number;
    is_allowed: boolean;
};

type Data = {
    allowedColorModels: {
        edges: {
            node: AllowedColorDataType;
        }[];
    };
};

const useAllowedColors = (gameId: number) => {
    const settings = useSettingsStore();
    const baseUrl = settings?.config?.toriiUrl ?? '';
    const gqlClient = new GraphQLClient(`${baseUrl}/graphql`);

    return useQuery({
        queryKey: ['allowedColors', gameId],
        queryFn: async () => {
            const result: Data = await gqlClient.request(GetAllowedColors, { game_id: gameId });
            return result.allowedColorModels.edges.map((edge) => edge.node);
        },
        enabled: !!gameId,
        refetchInterval: 2_000,
    });
};

export default useAllowedColors;
