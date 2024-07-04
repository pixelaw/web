import { useQuery } from '@tanstack/react-query';
import { GraphQLClient } from 'graphql-request';
import GetPaletteColors from '@/../graphql/GetPaletteColors.graphql';
import { useSettingsStore } from '@/stores/SettingsStore.ts';
import { numRGBAToHex } from '@/webtools/utils.ts';

type Data = {
    paletteColorsModels: {
        edges: {
            node: {
                game_id: number;
                idx: number;
                color: number;
            };
        }[];
    };
};

const usePaletteColors = () => {
    const settings = useSettingsStore();
    const baseUrl = settings?.config?.toriiUrl ?? '';
    const gqlClient = new GraphQLClient(`${baseUrl}/graphql`);

    return useQuery({
        queryKey: ['paletteColors'],
        queryFn: async () => {
            const result: Data = await gqlClient.request(GetPaletteColors);
            return result.paletteColorsModels.edges.map(({ node }) => {
                return {
                    ...node,
                    color: numRGBAToHex(node.color),
                };
            });
        },
        refetchInterval: 2_000,
    });
};

export default usePaletteColors;
