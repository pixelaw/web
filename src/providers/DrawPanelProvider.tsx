import React, { createRef, MutableRefObject, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { CellDatum, Coordinate } from "@/components/shared/DrawPanel.tsx";
import { usePixelaw } from "@/dojo/usePixelaw.ts";
import { MAP_SIZE, MAX_CELL_SIZE } from "@/global/constants.ts";
import { useEntityQuery } from "@dojoengine/react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getComponentValue, Has } from "@dojoengine/recs";
import { argbToHex } from "@/global/utils.ts";
import useInteract from "@/hooks/systems/useInteract";
import ParamPicker from "@/components/ParamPicker";
import { getGameStore, useGameStore } from "@/global/user.store";
import { TPixel } from "@/hooks/useRenderGrid";
import { Vector2 } from "threejs-math";

type DrawPanelType = {
    gameMode: string;
    selectedHexColor: string;
    coordinates: [number | undefined, number | undefined] | undefined;
    viewStart: Vector2;
    viewEnd: Vector2;
    panOffset: Vector2;
    data?: Array<CellDatum | undefined> | undefined;
    grid: Map<string, TPixel>;
    onCellClick?: (position: [number, number]) => void;
    onHover?: (coordinate: Coordinate) => void;
};

export const DrawPanelContext = React.createContext<DrawPanelType>({} as DrawPanelType);

export default function DrawPanelProvider({ children }: { children: React.ReactNode }) {
    const grid = useRef<Map<string, TPixel>>(new Map());
    const [panOffset] = useState<Vector2>(new Vector2(0, 0));
    const [viewStart] = useState<Vector2>(new Vector2(0, 0));
    const [viewEnd] = useState<Vector2>(new Vector2(28, 8));
    const {
        setup: {
            clientComponents: { Pixel },
        },
    } = usePixelaw();

    //mode of the game
    //setting the coordinates and passing it to plugin when hover in the cell
    const {
        gameMode,
        positionWithAddressAndType: position,
        selectedHexColor,
    } = useGameStore((state) => ({
        gameMode: state.gameMode,
        positionWithAddressAndType: state.hoveredPixel,
        selectedHexColor: state.selectedHexColor,
    }));

    const { interact, params, instruction } = useInteract(`${gameMode}`, selectedHexColor, {
        x: position?.x ?? 10,
        y: position?.y ?? 10,
    });

    const hasParams = !!params.length;

    const [additionalParams, setAdditionalParams] = React.useState<Record<string, any>>({});

    React.useEffect(() => {
        setAdditionalParams({});
    }, [gameMode]);

    const entityIds = useEntityQuery([Has(Pixel)]);

    const { pixels, data } = useMemo(() => {
        console.log("pixels memo");

        const pixelData: Record<`[${number},${number}]`, { color: string; text: string }> = {};
        const pixels = entityIds
            .map((entityId) => getComponentValue(Pixel, entityId))
            .filter((entity) => !!entity)
            .filter((entity) => entity?.color !== 0);

        pixels.forEach((pixel) => {
            pixelData[`[${pixel!.x},${pixel!.y}]`] = {
                color: argbToHex(pixel!.color),
                text: pixel?.text?.toString() ?? "",
            };
            grid.current.set(`[${pixel!.x},${pixel!.y}]`, {
                position: [pixel!.x, pixel!.y],
                color: argbToHex(pixel!.color),
                text: pixel?.text?.toString() ?? "",
            })
        });

        const data = Object.entries({ ...pixelData }).map(([key, value]) => {
            return {
                coordinates: key.match(/\d+/g)?.map(Number) as [number, number],
                hexColor: value.color,
                text: value.text,
            };
        });

        return { pixels, data };
    }, [entityIds]);

    const [openModal, setOpenModal] = React.useState(false);
    const handleInteract = (otherParams?: Record<string, any>) => {
        const variables = hasParams
            ? {
                  otherParams,
              }
            : {};

        interact
            .mutateAsync(variables)
            .then()
            .catch((err) => {
                console.error("reversing color because of: ", err);
            });

        setOpenModal(false);
        setAdditionalParams({});
    };

    const handleCellClick = (coordinate: Coordinate) => {
        const pixel = pixels.find((pixel) => pixel!.x === coordinate[0] && pixel!.y == coordinate[1]);
        getGameStore().set({
            hoveredPixel: {
                x: coordinate[0],
                y: coordinate[1],
                address: pixel?.owner || "N/A",
                pixel: pixel?.app || "N/A",
            },
        });
        if (hasParams) setOpenModal(true);
        else handleInteract();
    };

    const handleHover = (coordinate: Coordinate) => {
        // do not hover when the modal is open
        if (openModal) return;
        // const pixel = pixels.find((pixel) => pixel!.x === coordinate[0] && pixel!.y == coordinate[1]);
        // getGameStore().set({
        //     hoveredPixel: {
        //         x: coordinate[0],
        //         y: coordinate[1],
        //         address: pixel?.owner || "N/A",
        //         pixel: pixel?.app || "N/A",
        //     },
        // });
    };

    // TODO: Figure out what this does
    // React.useEffect(() => {
    //   if (!notificationData) return;
    //   const targetPixelX = notificationData.x * cellSize;
    //   const targetPixelY = notificationData.y * cellSize;

    //   const offsetX = targetPixelX - CANVAS_WIDTH / 2;
    //   const offsetY = targetPixelY - CANVAS_HEIGHT / 2;

    //   const maxOffsetX = -(MAP_SIZE * cellSize - CANVAS_WIDTH);
    //   const maxOffsetY = -(MAP_SIZE * cellSize - CANVAS_HEIGHT);

    //   setPanOffsetX(
    //     offsetX < 0
    //       ? 0
    //       : Math.abs(offsetX) > Math.abs(maxOffsetX)
    //         ? maxOffsetX
    //         : -offsetX
    //   );
    //   setPanOffsetY(
    //     offsetY < 0
    //       ? 0
    //       : Math.abs(offsetY) > Math.abs(maxOffsetY)
    //         ? maxOffsetY
    //         : -offsetY
    //   );
    // }, [cellSize, notificationData]);

    return (
        <DrawPanelContext.Provider
            value={{
                gameMode,
                selectedHexColor,
                coordinates: [position.x, position.y],
                viewStart,
                viewEnd,
                panOffset,
                data,
                grid: grid.current,
                onCellClick: handleCellClick,
                onHover: handleHover,
            }}
        >
            {children}
            <ParamPicker
                instruction={instruction}
                value={additionalParams}
                onChange={(newValue) => setAdditionalParams(newValue)}
                onSelect={(newValue) => handleInteract(newValue)}
                onSubmit={() => handleInteract(additionalParams)}
                params={params}
                open={openModal}
                onOpenChange={(open) => setOpenModal(open)}
            />
        </DrawPanelContext.Provider>
    );
}

export function useDrawPanel() {
    return React.useContext(DrawPanelContext);
}
