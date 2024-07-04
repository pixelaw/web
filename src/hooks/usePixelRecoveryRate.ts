import { useQuery } from '@tanstack/react-query';
import { GraphQLClient } from 'graphql-request';
import GetPixelRecoveryRate from '@/../graphql/GetPixelRecoveryRate.graphql';
import { useSettingsStore } from '@/stores/SettingsStore.ts';

type Data = {
    pixelRecoveryRateModels: {
        edges: {
            node: {
                game_id: number;
                rate: string;
            };
        }[];
    };
};

const usePixelRecoveryRate = () => {
    const settings = useSettingsStore();
    const baseUrl = settings?.config?.toriiUrl ?? '';
    const gqlClient = new GraphQLClient(`${baseUrl}/graphql`);

    return useQuery({
        queryKey: ['usePixelRecoveryRate'],
        queryFn: async () => {
            const result: Data = await gqlClient.request(GetPixelRecoveryRate);
            const gameRate = result.pixelRecoveryRateModels.edges?.[0];
            if (!gameRate) throw new Error('game not yet started');
            return {
                ...gameRate.node,
                rate: parseInt(gameRate.node.rate, 16),
            };
        },
        retryDelay: (failureCount) => failureCount * 1_000,
    });
};

export default usePixelRecoveryRate;
