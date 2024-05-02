import MainLayout from "@/components/layouts/MainLayout";
import ScreenAtomRenderer from "@/components/ScreenAtomRenderer";
import {Toaster} from '@/components/ui/toaster'
import {useQuery,} from '@tanstack/react-query'
import {setup} from '@/dojo/setup'
import {DojoProvider} from './DojoContext';
import Loading from '@/components/Loading'
import {cn} from '@/lib/utils'
import {createDojoConfig} from '@dojoengine/core'
import AbiProvider from "@/providers/AbiProvider.tsx";

import { useEffect, useState} from "react";
import { getSettingsStore, setDojoConfig, useSettingsStore } from "./global/settings.store";


function App() {
    console.log("💟 PixeLAW App 💟")
    const {config, configIsValid, configError} = useSettingsStore(state => {
        return {
            config: state.config,
            configIsValid: state.configIsValid,
            configError: state.configError
        }
    });

    const setupQuery = useQuery({
        queryKey: ['setupQuery'],
        queryFn: async () => {
            if (!config) {
                throw new Error("Missing valid Dojo config")
            }
            console.log("🏵️ Setting up Dojo 🔨", config)
            return await setup(createDojoConfig(config!))
        },
        enabled: config !== undefined && configIsValid,
        staleTime: Infinity,
        retry: false, // important: when retrying, dojo can lock up in a setup loop and new queries will never be triggered
    })

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
        errorMessage = `configError ${configError}`
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
