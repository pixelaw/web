import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { usePixelaw } from "@/dojo/usePixelaw.ts";
import { useEntityQuery } from "@dojoengine/react";
import { getComponentValue, Has } from "@dojoengine/recs";
import { argbToHex } from "@/global/utils.ts";
import useInteract from "@/hooks/systems/useInteract";
import ParamPicker from "@/components/ParamPicker";
import { getGameStore, useGameStore } from "@/global/game.store";
import { renderGrid, TPixel } from "@/drawing/renderGrid";

type TDrawPanelType = {
    setCanvasRef: React.Dispatch<React.SetStateAction<MutableRefObject<HTMLCanvasElement>>>;
    onCellClick?: (position: [number, number]) => void;
    onHover?: (coordinate: [number, number]) => void;
};

export type TPixelData = {
    x: Number;
    y: Number;
    created_at: Number;
    updated_at: Number;
    app: string;
    color: string;
    owner: string;
    text: string;
    timestamp: Number;
    action: BigInt;
};

export const DrawPanelContext = React.createContext<TDrawPanelType>({} as TDrawPanelType);

export default function DrawPanelProvider({ children }: { children: React.ReactNode }) {
    const [canvasRef, setCanvasRef] = useState<MutableRefObject<HTMLCanvasElement>>(null!);
    const grid = useRef<Map<string, TPixel>>(new Map());
    const pixelData = useRef<Map<string, TPixelData>>(new Map());
    const {
        setup: {
            clientComponents: { Pixel },
        },
    } = usePixelaw();

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

    /*
     * @notice Update loop that stores Pixel data in a map that can
     * be accessed by [x,y] coordinates (lookup is efficient)
     */
    useEffect(() => {
        entityIds
            .map((entityId) => getComponentValue(Pixel, entityId))
            .filter((entity) => !!entity)
            .filter((entity) => entity?.color !== 0)
            .forEach((pixel) => {
                const color = argbToHex(pixel!.color);
                const text = pixel?.text?.toString() ?? "";
                pixelData.current.set(`[${pixel!.x},${pixel!.y}]`, {
                    x: pixel!.x,
                    y: pixel!.y,
                    created_at: pixel!.created_at,
                    updated_at: pixel!.updated_at,
                    app: pixel!.app.toString(),
                    color,
                    owner: pixel!.owner.toString(),
                    text,
                    timestamp: pixel!.timestamp,
                    action: pixel!.action,
                });
                grid.current.set(`[${pixel!.x},${pixel!.y}]`, {
                    position: [pixel!.x, pixel!.y],
                    color,
                    text,
                });
            });
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

    const handleCellClick = (coordinate: [number, number]) => {
        const pixel = pixelData.current.get(`[${coordinate[0]}, ${coordinate[1]}]`);
        console.log("💡 Pixel clicked", pixel);
        getGameStore().set({
            hoveredPixel: {
                x: coordinate[0],
                y: coordinate[1],
                address: pixel?.owner || "N/A", // TODO: finish
                pixel: pixel?.app || "N/A", // TODO: finish this
            },
        });
        if (hasParams) setOpenModal(true);
        else handleInteract();
    };

    const handleHover = (coordinate: [number, number]) => {
        // do not hover when the modal is open
        if (openModal) return;
        const pixel = pixelData.current.get(`[${coordinate[0]}, ${coordinate[1]}]`);
        if (getGameStore().hoveredPixel.x === coordinate[0] && getGameStore().hoveredPixel.y === coordinate[1]) return;
        getGameStore().set({
            hoveredPixel: {
                x: coordinate[0],
                y: coordinate[1],
                address: pixel?.owner || "N/A",
                pixel: pixel?.app || "N/A",
            },
        });
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

    //render canvas grid
    useEffect(() => {
        let animationId: number;
        const render = () => {
            animationId = requestAnimationFrame(render);
            if (!canvasRef || !canvasRef.current || !grid || !grid.current) return;
            renderGrid({
                canvas: canvasRef.current,
                grid: grid.current,
            });
        };
        animationId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationId);
    }, [canvasRef, grid]);

    return (
        <DrawPanelContext.Provider
            value={{
                setCanvasRef,
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
