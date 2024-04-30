import {useQuery} from '@tanstack/react-query'
import {createContext, ReactNode, useMemo} from "react";
import {useAtom} from "jotai/index";
import {gameModeAtom} from "@/global/states.ts";
import {useComponentValue} from "@dojoengine/react";
import {useDojo} from "@/dojo/useDojo.ts";
import {getEntityIdFromKeys} from "@dojoengine/utils";
import {Abi, shortString} from "starknet";

const emptyAbi: Abi = []

export const AbiContext = createContext({
    abi: emptyAbi,
    isLoading: true,
});

const loadAbi = () => {
    const {
        setup: {
            clientComponents: {AppName},
            dojoProvider: {provider}
        },
    } = useDojo()

    const [gameMode] = useAtom(gameModeAtom)

    // Find the current app system address
    const selectedAppId = useMemo(() => getEntityIdFromKeys([ BigInt(shortString.encodeShortString(gameMode)) ]), [gameMode])
    const selectedApp = useComponentValue(AppName, selectedAppId)
    const selectedAppSystem = selectedApp?.system


    const {data: abi = emptyAbi, isLoading} = useQuery({
        queryKey: ['abi', gameMode],
        queryFn: async () => {
            let result: Abi = []
            if(selectedAppSystem) {
                console.log("reloading abi for", gameMode)
                const ch =  await provider.getClassHashAt(selectedAppSystem)
                const cl =  await provider.getClass(ch)
                result = cl.abi
            }
            return result
        },
        enabled: !!gameMode,
    })

    return {abi, isLoading};
}

const AbiProvider = ({children}: {children: ReactNode}) => {
    const {abi, isLoading} = loadAbi();

    return (
        <AbiContext.Provider value={{abi, isLoading}}>
            {children}
        </AbiContext.Provider>
    );
};
export default AbiProvider;
