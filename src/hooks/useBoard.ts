import { useQuery } from '@tanstack/react-query';
import { GraphQLClient } from 'graphql-request';
import GetGame from '@/../graphql/GetGame.graphql';
import { useSettingsStore } from '@/stores/SettingsStore.ts';
import { MAX_UINT32 } from '@/webtools/types.ts';

type Data = {
    boardModels: {
        edges: {
            node: {
                id: number;
                origin: {
                    x: number;
                    y: number;
                };
                height: number;
                width: number;
            };
        }[];
    };
};

const useBoard = (id: number) => {
    const settings = useSettingsStore();
    const baseUrl = settings?.config?.toriiUrl ?? '';
    const gqlClient = new GraphQLClient(`${baseUrl}/graphql`);

    return useQuery({
        queryKey: ['board', id],
        queryFn: async () => {
            const result: Data = await gqlClient.request(GetGame, { id });
            const board = result.boardModels.edges?.[0];
            if (!board) return null;
            let x = board.node.origin.x + Math.floor(board.node.width / 2);
            x = x > MAX_UINT32 ? x - MAX_UINT32 : x;
            let y = board.node.origin.y + Math.floor(board.node.height / 2);
            y = y > MAX_UINT32 ? y - MAX_UINT32 : y;

            return {
                ...board.node,
                center: {
                    x,
                    y,
                },
            };
        },
        enabled: !!id,
        refetchInterval: 2_000,
    });
};

export default useBoard;
