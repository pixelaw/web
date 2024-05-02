import {useEffect, useState} from "react";

type Config = {
    worldAddress: string,
    rpcUrl: string,
    toriiUrl: string,
    relayUrl: string,
}

const defaultConfig: Config = {
    relayUrl: "http://localhost:8080",
    rpcUrl: "http://localhost:5050",
    toriiUrl: "http://localhost:8080",
    worldAddress: "0xfea84b178ab1dc982ef9e369246f8c4d53aea52ea7af08879911f436313e4e"
}

interface ConfigResult {
    config: Config;
    isSuccess: boolean;
    error: Error | string | undefined;
}

const checkUrl = async (url: string) => {
    try {
        await fetch(url);
        return true;
    } catch (e) {
        throw new Error(`Failed to fetch ${url}`);
    }
};

export const useConfig = (): ConfigResult => {
    let config = defaultConfig
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<Error | string | undefined>(undefined);

    useEffect(() => {
        const checkUrls = async () => {
            try {
                await Promise.all([checkUrl(config.rpcUrl), checkUrl(config.toriiUrl)]);
                setIsSuccess(true);
            } catch (e) {
                const error = e as Error;
                setError(error.message);
                setIsSuccess(false);
            }
        };
        checkUrls().catch((error) => console.error(error));

    }, [config.rpcUrl, config.toriiUrl]);


    console.log("checking ",{error})
    return {config, isSuccess, error};
}
