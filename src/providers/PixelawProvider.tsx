import { ReactNode, createContext, useCallback, useContext, useMemo } from "react";
import { IPixelawGameData, setupPixelaw, TPixelLawError } from "../dojo/setupPixelaw";
import { useSettingsStore } from "@/global/settings.store.ts";
import { createDojoConfig } from "@dojoengine/core";
import { useQuery } from "@tanstack/react-query";

export type IPixelLawContext = {
    clientState: "worldSelect" | "loading" | "error" | "gameActive";
    error: TPixelLawError | string | null;
    gameData: IPixelawGameData | undefined;
};

export const PixelawContext = createContext<IPixelLawContext | null>(null);

export const PixelawProvider = ({ children }: { children: ReactNode }) => {
    const currentValue = useContext(PixelawContext);

    if (currentValue) throw new Error("DojoProvider can only be used once");

    const { config, configIsValid } = useSettingsStore((state) => {
        return {
            config: state.config,
            configIsValid: state.configIsValid,
            configError: state.configError,
        };
    });

    const setupFunction = useCallback(async () => {
        if (!config) {
            throw new Error("Missing valid Dojo config");
        }
        if (!config.masterAddress || !config.masterPrivateKey) {
            // TODO move to checkdojoconfig, weirdly doesn't work?
            throw new Error("Missing master account, please set in settings");
        }
        return await setupPixelaw(createDojoConfig(config));
    }, [config]);

    const setupQuery = useQuery({
        queryKey: ["setupQuery"],
        queryFn: setupFunction,
        enabled: config !== undefined && configIsValid,
        staleTime: Infinity,
        // important: when retrying, dojo can lock up in a setup loop and new queries will never be triggered
        retry: false,
    });

    const dojoValues = useMemo((): IPixelLawContext => {
        const data: IPixelLawContext = {
            error: setupQuery.error,
            gameData: setupQuery.data,
            setup: setupQuery.data?.setup,
            clientState: setupQuery.isLoading ? "loading" : setupQuery.isSuccess ? "gameActive" : "worldSelect",
        } as IPixelLawContext;
        return data;
    }, [setupQuery]);

    return <PixelawContext.Provider value={dojoValues}>{children}</PixelawContext.Provider>;
};

export const usePixelawProvider = () => {
    const context = useContext(PixelawContext);
    if (!context) throw new Error("PixelLawProvider can only be used within a PixelLawProvider");
    return context;
};
