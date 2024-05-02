import MainLayout from "@/components/layouts/MainLayout";
import ScreenAtomRenderer from "@/components/ScreenAtomRenderer";
import {Toaster} from '@/components/ui/toaster'
import {useQuery, QueryKeyHashFunction} from '@tanstack/react-query'
import {setup} from '@/dojo/setup'
import {DojoProvider} from './DojoContext';
import Loading from '@/components/Loading'
import {cn} from '@/lib/utils'
import {createDojoConfig} from '@dojoengine/core'
import AbiProvider from "@/providers/AbiProvider.tsx";
import {useDojoConfig} from "@/dojo/useDojoConfig.tsx";
import {useContext, useEffect, useRef} from "react";

let hasRun = false

function App() {

    console.log("Rendering App")

    const {config, isSuccess: configSuccess, error: configError, setRpcUrl} = useDojoConfig();
    //
    // useEffect(() => {
        const timer = setTimeout(() => {
            if (hasRun) return;
            hasRun = true;
            setRpcUrl("http://localhost:5051");
        }, 7000);
    //
    //     // Clean up function to clear the timeout if the component unmounts
    //     return () => clearTimeout(timer);
    // }, [setRpcUrl]); // Depend on setRpcUrl so the effect runs again if it changes


    console.log(config.rpcUrl,{ configSuccess})

    const setupQuery = useQuery({
        queryKey: ['setup', config.rpcUrl],
        queryFn: async () => {
            console.log("setupp", {configSuccess})
            return await setup(createDojoConfig(config))
        },
        enabled: configSuccess,
        staleTime: Infinity,
    })

    // useEffect(() => {
    //     console.log("App.useEffect")
    //     setupQuery.refetch();
    // }, [config.rpcUrl]);

    if (setupQuery.isLoading) {
        return <Loading>Loading setupQuery</Loading>
    }

    if (setupQuery.data) {
        return (
            <DojoProvider value={setupQuery.data}>
                <AbiProvider>
                    <MainLayout>
                        <ScreenAtomRenderer/>
                        <Toaster/>
                    </MainLayout>
                </AbiProvider>
            </DojoProvider>
        );
    }

    let errorMessage = ''

    if (setupQuery.isError) {
        errorMessage = `setupQuery Error: ${setupQuery.error}`
    }

    if (configError) {
        errorMessage = `configError Error: ${configError}`
    }

    // useEffect(() => {
    //     if (configSuccess && setupQuery && setupQuery.isSuccess) {
    //         console.log("refer")
    //         setupQuery.refetch();
    //     }
    // }, [config, configSuccess]);

    return (
        <div
            className={cn(
                [
                    'fixed top-0 bottom-0 left-0 w-full bg-brand-body z-40 flex-center'
                ]
            )}
        >
            <div className={'w-[25%]'}>
                <h1 className={'text-lg uppercase font-silkscreen text-brand-danger text-center'}>
                    Something went wrong
                </h1>
                {errorMessage !== '' &&
                    <p className={'text-sm text-brand-violetAccent text-white mt-xs'}>
                        {errorMessage}
                    </p>
                }
                <p className={'text-sm text-brand-violetAccent text-white mt-xs'}>
                    Try to refresh this page. If issue still persists, alert the team at Discord.
                </p>
            </div>
        </div>
    );
}

export default App;
