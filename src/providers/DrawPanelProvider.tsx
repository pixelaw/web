import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { usePixelaw } from "@/dojo/usePixelaw.ts";
import { useEntityQuery } from "@dojoengine/react";
import { getComponentValue, Has } from "@dojoengine/recs";
import { argbToHex } from "@/global/utils.ts";
import useInteract from "@/hooks/systems/useInteract";
import ParamPicker from "@/components/ParamPicker";
import { getGameStore, useGameStore } from "@/global/game.store";
import { renderGrid, TPixel } from "@/drawing/renderGrid";
import { createCamera } from "@/drawing/camera";
import queryString from 'query-string';
import { Vector2, Vector3 } from "threejs-math";

type TDrawPanelType = {
    setCanvas: (canvas: MutableRefObject<HTMLCanvasElement>) => void;
    camera: ReturnType<typeof createCamera>;
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
    const [camera, setCamera] = useState<ReturnType<typeof createCamera>>(null!);
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
     * @dev Update loop that stores Pixel data in a map that can
     * be accessed by [x,y] coordinates (lookup is efficient)
     */
    useEffect(() => {
        entityIds
            .map((entityId) => getComponentValue(Pixel, entityId))
            .filter((entity) => !!entity)
            .filter((entity) => entity?.color !== 0)
            .forEach((pixel) => {
                const color = argbToHex(pixel.color);
                const text = Number(pixel?.text) === 0 ? "" : pixel?.text?.toString() ?? "";
                pixelData.current.set(`[${pixel.x},${pixel.y}]`, {
                    x: pixel.x,
                    y: pixel.y,
                    created_at: pixel.created_at,
                    updated_at: pixel.updated_at,
                    app: pixel.app.toString(),
                    color,
                    owner: pixel.owner.toString(),
                    text,
                    timestamp: pixel.timestamp,
                    action: pixel.action,
                });
                grid.current.set(`[${pixel.x},${pixel.y}]`, {
                    position: [pixel.x, pixel.y],
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
        const pixel = pixelData.current.get(`[${coordinate[0]},${coordinate[1]}]`);
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
        const pixel = pixelData.current.get(`[${coordinate[0]},${coordinate[1]}]`);
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

    useEffect(() => {
        let animationId: number;
        const render = () => {
            animationId = requestAnimationFrame(render);
            if (!canvasRef || !canvasRef.current || !grid || !grid.current) return;
            renderGrid({
                canvas: canvasRef.current,
                grid: grid.current,
                camera,
            });
        };
        animationId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationId);
    }, [canvasRef, grid]);

    /*
     * @dev Handles the canvas setup of DrawPanelProvider
     */

    const setCanvas = useCallback((canvas: MutableRefObject<HTMLCanvasElement>) => {
        if (!canvas.current) return;
        setCanvasRef(canvas);
        const camera = createCamera(canvas.current);
        setCamera(camera);
        getGameStore().set({ camera });
    }, []);

    /*
     * @dev Fetches camera target from QueryString
     */
    useEffect(() => {
        if (!camera) return;
        const query = queryString.parse(window.location.search);
        console.log("query", query) 
        if (query.target) {
            const target = query.target.split(',')
            const x = Number(target[0])
            const y = Number(target[1])
            camera.setPosition(new Vector3(x, y, camera.getZoom()))
        }
    }, [camera])

    return (
        <DrawPanelContext.Provider
            value={{
                setCanvas,
                camera,
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
