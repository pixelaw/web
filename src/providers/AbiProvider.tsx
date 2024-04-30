import {useQuery} from '@tanstack/react-query'
import {createContext, useEffect, useMemo} from "react";
import {DojoProvider} from "@dojoengine/core";

export const AbiContext = createContext({
    metadatas: [],
    getAbiByAddress: (address: string) => {},
});

const useMetadatas = (provider: DojoProvider, components) => {
// TODO
    provider.provider.getClassHashAt()

    // const {data, refetch} = useQuery({
    //     queryKey: ['metadatas'],
    //     queryFn: async () => {
    //         const {data} = await graphSdk.metadatas()
    //         console.log("d" ,data)
    //         return (data.metadatas?.edges ?? [])
    //     }
    // })

    const getAbiByAddress = useMemo(() => {
        return (id: string) => {
            return data?.find(metadata => metadata.node.id === id);
        };
    }, [data]);

    useEffect(() => {
        refetch();
    }, [components, refetch]);

    return {data, getAbiByAddress};
}

const AbiProvider = ({children, provider, components}) => {
    const {data: metadatas, getAbiByAddress} = useMetadatas(provider, components);

    return (
        <AbiContext.Provider value={{metadatas, getAbiByAddress}}>
            {children}
        </AbiContext.Provider>
    );
};
export default AbiProvider;
