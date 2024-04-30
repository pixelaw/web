import {useQuery} from '@tanstack/react-query'
import {createContext, useEffect, useMemo} from "react";
import {DojoProvider} from "@dojoengine/core";
import {ClientComponents} from "@/dojo/createClientComponents.ts";
import {useAtom} from "jotai/index";
import {gameModeAtom} from "@/global/states.ts";
import {useComponentValue} from "@dojoengine/react";
import {useDojo} from "@/dojo/useDojo.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {Has, getComponentValue} from '@latticexyz/recs'
import {getEntityIdFromKeys} from "@dojoengine/utils";
import { shortString} from "starknet";

export const AbiContext = createContext({
    abi: [],
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
    console.log("loadAbi ", gameMode)
    // Find the current app system address
    const selectedAppId = getEntityIdFromKeys([ BigInt(shortString.encodeShortString(gameMode)) ])
    const selectedApp = useComponentValue(AppName, selectedAppId)
    const selectedAppSystem = selectedApp.system
    console.log({selectedAppSystem})


    const {data: abi, isLoading} = useQuery({
        queryKey: ['abi', gameMode],
        queryFn: async () => {
            console.log("reloading abi")
            const ch =  await provider.getClassHashAt(selectedAppSystem)
            const cl =  await provider.getClass(ch)
            const abi = cl.abi

            return abi
        },
        enabled: !!gameMode,
    })

    return {abi, isLoading};
}

const AbiProvider = ({children}) => {
    const {abi, isLoading} = loadAbi();

    return (
        <AbiContext.Provider value={{abi, isLoading}}>
            {children}
        </AbiContext.Provider>
    );
};
export default AbiProvider;
