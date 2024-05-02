import React from "react";
import Apps from "@/components/Apps.tsx";
import { ColorResult, CompactPicker } from "react-color";
import DrawPanel from "@/components/shared/DrawPanel";
import DrawPanelProvider from "@/providers/DrawPanelProvider.tsx";
import useAnnounceAlert from "@/hooks/events/useAnnounceAlert";
import { getGameStore, useGameStore } from "@/global/user.store";

const Main = () => {
  const selectedHexColor = useGameStore((state) => state.selectedHexColor);

  const handleColorChange = (color: ColorResult) => {
    getGameStore().set({ selectedHexColor: color.hex });
  };

  // subscribe to torii messages to announce alerts and automatically update the components
  useAnnounceAlert();

  return (
    <React.Fragment>
      {
        <DrawPanelProvider>
          <DrawPanel />

          <div className="fixed bottom-1 flex justify-center w-full">
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/*// @ts-ignore*/}
            <CompactPicker
              color={selectedHexColor}
              onChangeComplete={handleColorChange}
            />
          </div>

          <Apps />
        </DrawPanelProvider>
      }
    </React.Fragment>
  );
};

export default Main;
