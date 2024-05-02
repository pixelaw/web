import MainLayout from "@/components/layouts/MainLayout";
import ScreenAtomRenderer from "@/components/ScreenAtomRenderer";
import {Toaster} from '@/components/ui/toaster'
import {useQuery} from '@tanstack/react-query'
import {setup} from '@/dojo/setup'
import {DojoProvider} from './DojoContext';
import Loading from '@/components/Loading'
import {cn} from '@/lib/utils'
import {createDojoConfig} from '@dojoengine/core'
import AbiProvider from "@/providers/AbiProvider.tsx";
import {useConfig} from "@/providers/ConfigProvider.tsx";
import {useContext} from "react";
import manifest from "@/dojo/manifest.ts";


function App() {

    console.log("Reloading App")

    const {config, isSuccess: configSuccess, error: configError} = useConfig();

    console.log("he")
    console.log({configSuccess, configError})

    const setupQuery = useQuery({
        queryKey: ['setup'],
        queryFn: async () => {
            console.log("setup")
            const result = await setup(createDojoConfig({
                manifest: manifest(config.worldAddress),
                masterAddress: '0x003c4dd268780ef738920c801edc3a75b6337bc17558c74795b530c0ff502486',
                masterPrivateKey: '0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a',
                rpcUrl: config.rpcUrl,
                toriiUrl: config.toriiUrl,
                relayUrl: config.relayUrl
            }))
            return result
        },
        enabled: configSuccess,
        staleTime: Infinity
    })

    console.log("done")

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
