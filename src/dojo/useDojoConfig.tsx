import {useEffect, useState} from "react";
import manifest from "@/dojo/manifest.ts";

type DojoConfig = {
    rpcUrl: string;
    toriiUrl: string;
    relayUrl?: string;
    masterAddress?: string;
    masterPrivateKey?: string;
    accountClassHash?: string;
    feeTokenAddress?: string;
    manifest: any;
}

const defaultDojoConfig: DojoConfig = {
    relayUrl: "http://localhost:8080",
    rpcUrl: "http://localhost:5050",
    toriiUrl: "http://localhost:8080",
    manifest: manifest("0xfea84b178ab1dc982ef9e369246f8c4d53aea52ea7af08879911f436313e4e"),
    masterAddress: '0x003c4dd268780ef738920c801edc3a75b6337bc17558c74795b530c0ff502486',
    masterPrivateKey: '0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a',
}

interface DojoConfigResult {
    config: DojoConfig;
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

export const useDojoConfig = (): {
    setRpcUrl: (url: string) => void;
    error: Error | string | undefined;
    config: DojoConfig;
    isSuccess: boolean
} => {
    const [config, setConfig] = useState(defaultDojoConfig);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<Error | string | undefined>(undefined);
    console.log("reloading useDojoConfig", config)

    const setRpcUrl = (url: string) => {
        const newConfig = {...config, rpcUrl: url};
        setConfig(newConfig);
        console.log("setRpcUrl", newConfig)
        return newConfig;
    }

    useEffect(() => {
        console.log("checking useEffect")
        const checkUrls = async () => {
            const rpcUrlIsValid = await checkUrl(config.rpcUrl);
            const toriiUrlIsValid = await checkUrl(config.toriiUrl);

            if (rpcUrlIsValid && toriiUrlIsValid) {
                console.log("all good")
                setIsSuccess(true);
            } else {
                setError('One or more URLs are invalid.');
                console.log("YIKES")
                setIsSuccess(false);
            }
        };
        checkUrls().catch((error) => console.error(error));
    }, [config.rpcUrl, config.toriiUrl]);


    return {config, isSuccess, error, setRpcUrl};
}
