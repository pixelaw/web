import MainLayout from "@/components/layouts/MainLayout";
import ScreenAtomRenderer from "@/components/ScreenAtomRenderer";
import {Toaster} from '@/components/ui/toaster'
import {useQuery} from '@tanstack/react-query'
import {setup} from '@/dojo/setup'
import {DojoProvider} from './DojoContext';
import Loading from '@/components/Loading'
import {cn} from '@/lib/utils'
import {createDojoConfig} from '@dojoengine/core'
import manifest from "@/dojo/manifest.ts";
import AbiProvider from "@/providers/AbiProvider.tsx";


const DO_NOT_EXCEED_MS = 30_000

const PUBLIC_NODE_URL = localStorage.getItem('PUBLIC_NODE_URL') || 'http://localhost:5050';
const PUBLIC_TORII = localStorage.getItem('PUBLIC_TORII') || 'http://localhost:8080';
const WORLD_ADDRESS = localStorage.getItem('WORLD_ADDRESS') || '0xfea84b178ab1dc982ef9e369246f8c4d53aea52ea7af08879911f436313e4e';


function App() {

    console.log("Reloading App")


    const checkRpcUrl = useQuery({
        queryKey: ['rpcUrl'],
        queryFn: async () => await fetch(PUBLIC_NODE_URL),
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, DO_NOT_EXCEED_MS),
        retry: 8,
        staleTime: Infinity, // Data will never be considered stale
    })

    const checkTorii = useQuery({
        queryKey: ['toriiUrl'],
        queryFn: async () => await fetch(PUBLIC_TORII),
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, DO_NOT_EXCEED_MS),
        retry: 8,
        enabled: checkRpcUrl.isSuccess
    })


    const setupQuery = useQuery({
        queryKey: ['setup'],
        queryFn: async () => {
            return setup(
                createDojoConfig({
                    manifest: manifest(WORLD_ADDRESS),
                    masterAddress: '0x003c4dd268780ef738920c801edc3a75b6337bc17558c74795b530c0ff502486',
                    masterPrivateKey: '0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a',
                    rpcUrl: PUBLIC_NODE_URL,
                    toriiUrl: PUBLIC_TORII
                })
            )
        },
        enabled: checkRpcUrl.isSuccess && checkTorii.isSuccess,
    })

    if (checkRpcUrl.isLoading) {
        return <Loading>Loading Public Node URL</Loading>
    }

    if (checkTorii.isLoading) {
        return <Loading>Contracts are being deployed</Loading>
    }

    if (setupQuery.isLoading) {
        return <Loading>Loading setupQuery</Loading>
    }

    if (setupQuery.data) {
        return (
            <DojoProvider value={setupQuery.data}>
                <AbiProvider    >
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

    if (checkRpcUrl.isError) {
        errorMessage = `PUBLIC_NODE_URL error: ${checkRpcUrl.error.message}. If this is happening in your local environment, Katana might not be up.`
    }

    if (checkTorii.isError) {
        errorMessage = `PUBLIC_TORII error: ${checkTorii.error.message}. If this is happening in your local environment, Torii might not be up.`
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
