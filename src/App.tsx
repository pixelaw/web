import MainLayout from "@/components/layouts/MainLayout";
import ScreenAtomRenderer from "@/components/ScreenAtomRenderer";
import {Toaster} from '@/components/ui/toaster'
import {useQuery,} from '@tanstack/react-query'
import {setupPixelaw, SetupResult} from '@/dojo/setupPixelaw'
import Loading from '@/components/Loading'
import {cn} from '@/lib/utils'
import {createDojoConfig, DojoProvider} from '@dojoengine/core'
import AbiProvider from "@/providers/AbiProvider.tsx";
import { useCallback, useEffect, useState} from "react";
import { Account } from "starknet";
import { useBurnerManager } from "@dojoengine/create-burner";
import { TPixelLawError, usePixelawProvider } from "./providers/PixelawProvider";
import { Client } from "@dojoengine/torii-client";

function App() {
    const {clientState, error, gameData} = usePixelawProvider();

    if (clientState === "loading") {
        return <Loading>Loading DojoState</Loading>
    }

    if (clientState === "gameActive") {
        return (
            <AbiProvider>
                <MainLayout>
                    <ScreenAtomRenderer/>
                    <Toaster/>
                </MainLayout>
            </AbiProvider>
        );
    }

    let errorMessage = '[Pixel Panic error]'

    if (clientState === "error") {
        // conditional over err type:
        const errType = typeof (error as TPixelLawError).type === 'string' ? (error as TPixelLawError).type : 'unknown'
        // error.type == "DojoStateError" 
        // error.type == "ConfigError"
        // dojostate error / config error verbosity (in custom error type?)
        errorMessage = `${errType} error: ${error}`
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
