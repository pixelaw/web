import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useMemo } from "react";
import { useComponentValue } from "@dojoengine/react";
import { useDojo } from "@/dojo/useDojo.ts";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { Abi, shortString } from "starknet";
import { getGameStore } from "@/global/game.store";

const emptyAbi: Abi = [];

export const AbiContext = createContext({
  abi: emptyAbi,
  isLoading: true,
});

const loadAbi = () => {
  const {
    setup: {
      clientComponents: { AppName },
      dojoProvider: { provider },
    },
  } = useDojo();

  const gameMode = getGameStore().gameMode;
  // Find the current app system address
  const selectedAppId = getEntityIdFromKeys([
    BigInt(shortString.encodeShortString(gameMode)),
  ]);
  const selectedApp = useComponentValue(AppName, selectedAppId);
  const selectedAppSystem = selectedApp?.system;
  // console.log({gameMode, selectedAppSystem})

  // Query the abi for the App System
  const { data: abi = emptyAbi, isLoading } = useQuery({
    queryKey: ["abi", gameMode],
    queryFn: async () => {
      let result: Abi = [];
      console.log("start query");
      if (selectedAppSystem) {
        console.log("reloading abi for", selectedAppSystem);
        const ch = await provider.getClassHashAt(selectedAppSystem);
        const cl = await provider.getClass(ch);
        result = cl.abi;
      }
      return result;
    },
    enabled: !!gameMode,
  });

  return { abi, isLoading };
};

const AbiProvider = ({ children }: { children: ReactNode }) => {
  const { abi, isLoading } = loadAbi();

  return (
    <AbiContext.Provider value={{ abi, isLoading }}>
      {children}
    </AbiContext.Provider>
  );
};
export default AbiProvider;
